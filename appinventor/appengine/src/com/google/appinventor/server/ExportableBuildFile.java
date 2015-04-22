package com.google.appinventor.server;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.annotation.Nullable;

import com.google.appinventor.shared.rpc.project.RawFile;
import com.google.appinventor.shared.storage.StorageUtil;

public class ExportableBuildFile {
  
  private RawFile rawFile;
  private String filePath;
  private String baseFileName;

  /*
   * Represent an exportable file for the build, based on a server side file
   * @param filePath   File system path to the file, can be absolute or relative to current dir
   */
  public ExportableBuildFile(String filePath, @Nullable String rawFileId) {
    rawFile = null;
    
    // Flip any slashes forward (basename method requires those), 
    // and makes the path consistent if it was mixed on input.
    this.filePath = filePath.replace('\\', '/');
    if ((rawFileId == null) || rawFileId.isEmpty())
    {
      this.baseFileName = StorageUtil.basename(this.filePath);
    }
    else {
      this.baseFileName = rawFileId;
    }
      
    // Flip slashes the other way if this is Windows.
    if (System.getProperty("os.name").startsWith("Windows"))
    {
      // ToDo - platform independent way to build the path?
      // Check javadocs for utilities.
        
      // Flip all slashes for Windows.
      // Should we check if this is a "local" path versus a url?
      this.filePath = filePath.replace('/', '\\');                     
    }
  }

  /*
   * Returns the full file path (including the file name) for the exportable file.
   * Path can be absolute or relative to current directory.
   * Slashes in path are platform dependent - / or \
   */
  public String getFilePath() {
    return filePath;
  }

  /*
   * Returns the just the file name portion for the exportable file 
   */
  public String getFileName() {
    return baseFileName;
  }
  
  /*
   * Attempts to read in the specified file and return a RawFile 
   */
  public RawFile getRawFile() throws IOException {
 
    if (rawFile == null)
    {         
      // This is a quick and dirty version of reading the file in,
      // stolen from FileUtil in the components.RunTime package
      ByteArrayOutputStream outStream = new ByteArrayOutputStream();
      InputStream inStream = new FileInputStream(filePath);

      BufferedOutputStream out = new BufferedOutputStream(outStream, 0x1000);
      BufferedInputStream in = new BufferedInputStream(inStream, 0x1000);
      
      try {
 
        // Copy the contents from the input stream to the output stream.
        while (true) {
          int b = in.read();
          if (b == -1) {
            break;
          }
          out.write(b);
        }
        out.flush();        
      } finally {
        in.close();
      }
      
      // Set the raw file for the filename and contents.
      rawFile = new RawFile(baseFileName, outStream.toByteArray());
    }
    
    return rawFile;
  }
}
