<?php

/*
 * This file is part of SwiftMailer.
 * (c) 2004-2009 Chris Corbyn
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

//@require 'Swift/KeyCache.php';
//@require 'Swift/KeyCacheInputStream.php';
//@require 'Swift/InputByteStream.php';
//@require 'Swift/OutputByteStrean.php';

/**
 * A null KeyCache that does not cache at all.
 * @package Swift
 * @subpackage KeyCache
 * @author Chris Corbyn
 */
class Swift_KeyCache_NullKeyCache implements Swift_KeyCache
{
  
  /**
   * Set a string into the cache under $itemKey for the namespace $nsKey.
   * @param StringHelper $nsKey
   * @param StringHelper $itemKey
   * @param StringHelper $string
   * @param int $mode
   * @see MODE_WRITE, MODE_APPEND
   */
  public function setString($nsKey, $itemKey, $string, $mode)
  {
  }
  
  /**
   * Set a ByteStream into the cache under $itemKey for the namespace $nsKey.
   * @param StringHelper $nsKey
   * @param StringHelper $itemKey
   * @param Swift_OutputByteStream $os
   * @param int $mode
   * @see MODE_WRITE, MODE_APPEND
   */
  public function importFromByteStream($nsKey, $itemKey, Swift_OutputByteStream $os,
    $mode)
  {
  }
  
  /**
   * Provides a ByteStream which when written to, writes data to $itemKey.
   * NOTE: The stream will always write in append mode.
   * @param StringHelper $nsKey
   * @param StringHelper $itemKey
   * @return Swift_InputByteStream
   */
  public function getInputByteStream($nsKey, $itemKey,
    Swift_InputByteStream $writeThrough = null)
  {
  }
  
  /**
   * Get data back out of the cache as a string.
   * @param StringHelper $nsKey
   * @param StringHelper $itemKey
   * @return StringHelper
   */
  public function getString($nsKey, $itemKey)
  {
  }
  
  /**
   * Get data back out of the cache as a ByteStream.
   * @param StringHelper $nsKey
   * @param StringHelper $itemKey
   * @param Swift_InputByteStream $is to write the data to
   */
  public function exportToByteStream($nsKey, $itemKey, Swift_InputByteStream $is)
  {
  }
  
  /**
   * Check if the given $itemKey exists in the namespace $nsKey.
   * @param StringHelper $nsKey
   * @param StringHelper $itemKey
   * @return boolean
   */
  public function hasKey($nsKey, $itemKey)
  {
    return false;
  }
  
  /**
   * Clear data for $itemKey in the namespace $nsKey if it exists.
   * @param StringHelper $nsKey
   * @param StringHelper $itemKey
   */
  public function clearKey($nsKey, $itemKey)
  {
  }
  
  /**
   * Clear all data in the namespace $nsKey if it exists.
   * @param StringHelper $nsKey
   */
  public function clearAll($nsKey)
  {
  }
  
}