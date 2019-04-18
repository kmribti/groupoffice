go.Jmap = {

	requests: [],

	requestOptions: {},

	callId: 0,

	timeout: null,

	nextCallId: function () {
		this.callId++;

		return this.callId;
	},

	debug: function () {
		var clientCallId = "clientCallId-" + this.nextCallId();
		this.requests.push(['community/dev/Debugger/get', {}, clientCallId]);

		this.requestOptions[clientCallId] = {
			method: 'community/dev/Debugger/get',
			params: {},
			callback: function(options, success, response) {
				
				console.group(clientCallId);
				response.forEach(function(r) {
					switch(r[0]) {
						case 'error':
							console.error(r[1]);
							break;
						case 'warn':
							console.warn(r[1]);
							break;
						case 'info':
							console.info(r[1]);
							break;
						default:							
							console.log(r[1]);
							break;
					}
				});
				console.groupEnd();
			}
		};
	},

	abort: function (clientCallId) {
		console.log("Abort request " + clientCallId);

		for (var i = 0, l = this.requests.length; i < l; i++) {
			if (this.requests[i][2] == clientCallId) {
				this.requests.splice(i, 1);
				break;
			}
		}

		delete this.requestOptions[clientCallId];
	},
	
	/**
	 * Find 
	 * @param {string} method
	 * @returns {Array|Boolean}
	 */
	findRequestByMethod: function(method) {
		for(var i = 0, l = this.requests.length; i < l; i++) {
			if(this.requests[i][0] == method) {
				return this.requests[i];
			}
		}
		
		return false;
	},
	
	getApiUrl : function() {
		return BaseHref + 'api/jmap.php';
	},
	
	get: function(cb, scope) {
		Ext.Ajax.request({
			url: this.getApiUrl(),
			method: 'GET',
			callback: function (opts, success, response) {
				var data;
				if(success && response.responseText) {
					data = Ext.decode(response.responseText);
				}
				cb.call(scope, data, opts, success, response);
			}
		});
	},
	
	downloadUrl: function(blobId) {
		if (!blobId) {
			return '';
		}
		return go.User.downloadUrl.replace('{blobId}', blobId);
	},
	
	upload : function(file, cfg) {
		if(Ext.isEmpty(file))
			return;

		Ext.Ajax.request({url: go.User.uploadUrl,
			success: function(response) {
				if(cfg.success && response.responseText) {
					data = Ext.decode(response.responseText);
					cfg.success.call(cfg.scope || this,data);
				}
			},
			failure: function(response) {
				if(cfg.failure && response.responseText) {
					data = Ext.decode(response.responseText);
					cfg.failure.call(cfg.scope || this,data);
				}
			},
			headers: {
				'X-File-Name': file.name,
				'Content-Type': file.type,
				'X-File-LastModifed': Math.round(file['lastModified'] / 1000).toString()
			},
			xmlData: file // just "data" wasn't available in ext
		});
	},
	
	/**
	 * Initializes Server Sent Events via EventSource. This function is called in MainLayout.onAuthenticated()
	 * 
	 * Note: disable this if you want to use xdebug because it will crash if you use SSE.
	 * 
	 * @returns {Boolean}
	 */
	sse : function() {
		if (!window.EventSource) {
			console.debug("Browser doesn't support EventSource");
			return false;
		}
		
		if(!go.User.eventSourceUrl) {
			console.debug("Not starting EventSource when xdebug is running");
			return false;
		}
		
		//filter out legacy modules
		var entities = go.Entities.getAll().filter(function(e) {return e.package != "legacy";});
		
		var url = go.User.eventSourceUrl + '?types=' + 
						entities.column("name").join(',');
		
		var source = new EventSource(url), me = this;
		
		source.addEventListener('state', function(e) {
			for(var entity in JSON.parse(e.data)) {
				var store =go.Db.store(entity);
				if(store) {
					store.getUpdates();
				}
			}
		}, false);

		source.addEventListener('open', function(e) {
			// Connection was opened.
		}, false);

		source.addEventListener('error', function(e) {
			if (e.readyState == EventSource.CLOSED) {
				// Connection was closed.
				
				me.sse();
			}
		}, false);
	},

	/**
	 * 
	 * 
	 * @param {type} options
	 * 
	 * An object containing:
	 * 
	 * method: jmap method
	 * params: jmap method parameters
	 * callback: function to call after request. Arghuments are options, success, response
	 * scope: callback function scope
	 * dispatchAfterCallback: dispatch the response after the callback. Defaults to false.
	 * 
	 * @returns {String} Client call ID.
	 */
	request: function (options) {
		if(!options.method) {
			throw "method is required";
		}
		
		var me = this;

		if (me.timeout) {
			clearTimeout(me.timeout);
		}
		
		var clientCallId = "clientCallId-" + this.nextCallId();
		
//		console.debug(clientCallId, options.method);
//		console.trace();

		this.requests.push([options.method, options.params || {}, clientCallId]);

		this.requestOptions[clientCallId] = options;

		me.timeout = setTimeout(function () {

			if (!me.requests.length) {
				//All requests aborted
				return;
			}

			me.debug();

			Ext.Ajax.request({
				url: me.getApiUrl(),
				method: 'POST',
				jsonData: me.requests,
				success: function (response, opts) {
					var responses = JSON.parse(response.responseText);
					

					responses.forEach(function (response) {

						//lookup request options by client ID
						var o = me.requestOptions[response[2]];
						if (!o) {
							//aborted
							console.debug("Aborted");
							return true;
						}
						if (response[0] == "error") {
							console.error('server-side JMAP failure', response);			
							//Ext.MessageBox.alert(t("Error"), response[1].message);
						}

						go.flux.Dispatcher.dispatch(response[0], response[1]);

						var success = response[0] !== "error";
						if (o.callback) {
							if (!o.scope) {
								o.scope = me;
							}
							//try {
								o.callback.call(o.scope, o, success, response[1]);
//							}
//							catch(e) {
//								console.error(e);
//							}
						}

						//cleanup request options
						delete me.requestOptions[response[2]];
					});
				},
				failure: function (response, opts) {
					console.log('server-side failure with status code ' + response.status);
				}
			});

			me.requests = [];
			me.timeout = null;

		}, 0);

		return clientCallId;
	}
};