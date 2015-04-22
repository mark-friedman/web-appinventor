// -*- mode: java; c-basic-offset: 2; -*-
package com.google.appinventor.server;

import java.io.FileNotFoundException;
import java.io.IOException;

import com.google.appinventor.common.testutils.TestUtils;
import com.google.appinventor.shared.rpc.project.RawFile;
import com.google.appinventor.shared.storage.StorageUtil;

import org.junit.Test;
import static junit.framework.Assert.*;


public class ExportableBuildFileTest {

  public static final String BUILDFILE_ROOT_PATH = TestUtils.APP_INVENTOR_ROOT_DIR +
      "/appengine/tests/com/google/appinventor/server/";  // must end with a slash

  @Test
  public void testGetContentsFileExists() throws Exception {
    // Set for a path that exists.
    ExportableBuildFile exportableFile = new ExportableBuildFile(BUILDFILE_ROOT_PATH + "WEB-INF/whitelist", null);
    assertFalse(exportableFile.getFilePath().isEmpty());
    
    RawFile file = exportableFile.getRawFile();
    assertFalse(file == null);
    assertFalse(file.getFileName().isEmpty());
    
    assertTrue(exportableFile.getFilePath().endsWith(StorageUtil.basename(file.getFileName())));
 
    // Specify the file path a bit different - flip the slash - should resolve to the same file
    ExportableBuildFile exportableFile2 = new ExportableBuildFile(BUILDFILE_ROOT_PATH + "WEB-INF\\whitelist", null);
    assertTrue(exportableFile.getFilePath().equals(exportableFile2.getFilePath()));        
    
    RawFile file2 = exportableFile2.getRawFile();
    assertFalse(file2 == null);
    assertTrue(file2.getFileName().equals(file.getFileName()));
    assertTrue(file2.getContent().length == file.getContent().length);

    // Specify the file path a bit different - flip the slash - should resolve to the same file
    ExportableBuildFile exportableFile3 = new ExportableBuildFile(BUILDFILE_ROOT_PATH + "WEB-INF\\whitelist", "whitelist");
    assertTrue(exportableFile.getFilePath().equals(exportableFile3.getFilePath()));        
    
    RawFile file3 = exportableFile3.getRawFile();
    assertFalse(file3 == null);
    assertTrue(file3.getFileName().equals(file.getFileName()));
    assertTrue(file3.getContent().length == file.getContent().length);

  }

  @Test
  public void testFileDoesntExist() throws Exception {
    String nonExistantFileName = "doesntExist.js";
    ExportableBuildFile exportableFile = new ExportableBuildFile(nonExistantFileName, null);
    
    // Test that the expected fields were set the expected way.
    assertTrue(exportableFile != null);
    assertTrue(exportableFile.getFileName().equals(nonExistantFileName));
    assertTrue(exportableFile.getFilePath().equals(nonExistantFileName));
    
    try {
      RawFile file = exportableFile.getRawFile();
      // We should get a file not found exception here
      fail();
    }
    catch (FileNotFoundException e)
    {
      // We expect a file not found exception
    }
  }
}
