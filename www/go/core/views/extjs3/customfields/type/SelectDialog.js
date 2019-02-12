/* global go, Ext */

go.modules.core.core.type.SelectDialog = Ext.extend(go.modules.core.core.FieldDialog, {
	height: dp(800),
	initFormItems: function () {
		var items = go.modules.core.core.type.SelectDialog.superclass.initFormItems.call(this);

//		items[0].items = items[0].items.concat([{
//				xtype: "numberfield",
//				decimals: 0,
//				name: "options.maxLength",
//				value: 50,
//				fieldLabel: t("Maximum length")
//			}, {
//				xtype: "textfield",
//				name: "default",
//				fieldLabel: t("Default value"),
//				anchor: "100%"
//			}]);


		items.push({
			xtype: "fieldset",
			title: t("Options"),
			items: [
				
				new go.modules.core.core.type.SelectOptionsTree({
					name: "dataType.options",
					hideLabel: true
				})
				
//				new go.form.FormGroup({
//					name: "dataType.options",
//					fieldLabel: t("Options"),
//					itemCfg: {
//						layout: "form",
//						items: [{
//								xtype: "hidden",
//								name: "id"
//							}, {
//								hideLabel: true,
//								xtype: "textfield",
//								name: "text",
//								anchor: "100%"
//							}]
//					}
//				})
			]
		});

		return items;
	}
});