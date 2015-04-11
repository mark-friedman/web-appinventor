// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.components.runtime.util;

import junit.framework.TestCase;

import java.io.IOException;

/**
 * Tests MediaUtil.java.
 *
 * @author lizlooney@google.com (Liz Looney)
 */
public class MediaUtilTest extends TestCase {  

  public void testFileUrlToFilePath() throws Exception {

    String filePathPrefix = "/sdcard/";
    String urlPathPrefix1 = "file:///sdcard/";
    String urlPathPrefix2 = "file:/sdcard/";

    // If Windows - file urls and expected paths contain a drive letter
    if (System.getProperty("os.name").startsWith("Windows"))
    {
      filePathPrefix = "C:\\sdcard\\";
      urlPathPrefix1 = "file:///C:\\sdcard\\";
      urlPathPrefix2 = "file:/C:\\sdcard\\";
    } 

    assertEquals(filePathPrefix + "17 Candle - Follow Me Down.m4a",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "17%20Candle%20-%20Follow%20Me%20Down.m4a"));
    assertEquals(filePathPrefix + "17 Candle - Follow Me Down.m4a",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "17%20Candle%20-%20Follow%20Me%20Down.m4a"));

    assertEquals(filePathPrefix + "Ali Spagnola - Radiation.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Ali%20Spagnola%20-%20Radiation.mp3"));
    assertEquals(filePathPrefix + "Ali Spagnola - Radiation.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Ali%20Spagnola%20-%20Radiation.mp3"));

    assertEquals(filePathPrefix + "Amanda Blank - DJ.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Amanda%20Blank%20-%20DJ.mp3"));
    assertEquals(filePathPrefix + "Amanda Blank - DJ.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Amanda%20Blank%20-%20DJ.mp3"));

    assertEquals(filePathPrefix + "Brett Dennen - Heaven.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Brett%20Dennen%20-%20Heaven.mp3"));
    assertEquals(filePathPrefix + "Brett Dennen - Heaven.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Brett%20Dennen%20-%20Heaven.mp3"));

    assertEquals(filePathPrefix + "Jackie Tohn - The Falling.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Jackie%20Tohn%20-%20The%20Falling.mp3"));
    assertEquals(filePathPrefix + "Jackie Tohn - The Falling.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Jackie%20Tohn%20-%20The%20Falling.mp3"));

    assertEquals(filePathPrefix + "Marcus Miller - Pluck.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Marcus%20Miller%20-%20Pluck.mp3"));
    assertEquals(filePathPrefix + "Marcus Miller - Pluck.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Marcus%20Miller%20-%20Pluck.mp3"));

    assertEquals(filePathPrefix + "Miike Snow - Animal.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Miike%20Snow%20-%20Animal.mp3"));
    assertEquals(filePathPrefix + "Miike Snow - Animal.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Miike%20Snow%20-%20Animal.mp3"));

    assertEquals(filePathPrefix + "Mos Def - Quiet Dog.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Mos%20Def%20-%20Quiet%20Dog.mp3"));
    assertEquals(filePathPrefix + "Mos Def - Quiet Dog.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Mos%20Def%20-%20Quiet%20Dog.mp3"));

    assertEquals(filePathPrefix + "White Denim - I Start To Run.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "White%20Denim%20-%20I%20Start%20To%20Run.mp3"));
    assertEquals(filePathPrefix + "White Denim - I Start To Run.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "White%20Denim%20-%20I%20Start%20To%20Run.mp3"));

    assertEquals(filePathPrefix + "William Fitzsimmons - Goodmorning.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "William%20Fitzsimmons%20-%20Goodmorning.mp3"));
    assertEquals(filePathPrefix + "William Fitzsimmons - Goodmorning.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "William%20Fitzsimmons%20-%20Goodmorning.mp3"));

    assertEquals(filePathPrefix + "Zack Borer -That's The Way.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix1 + "Zack%20Borer%20-That's%20The%20Way.mp3"));
    assertEquals(filePathPrefix + "Zack Borer -That's The Way.mp3",
        MediaUtil.fileUrlToFilePath(urlPathPrefix2 + "Zack%20Borer%20-That's%20The%20Way.mp3"));	  

    try {
      MediaUtil.fileUrlToFilePath("http://www.google.com");
      fail("Exception expected because scheme is not file");
    } catch (IOException e) {
      // Expected
    }

    try {
      MediaUtil.fileUrlToFilePath("not a well formed url");
      fail("Exception expected because url is not well formed");
    } catch (IOException e) {
      // Expected
    }
  }
}
