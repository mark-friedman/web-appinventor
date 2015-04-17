// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2013 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.server;

import com.google.appinventor.server.storage.StorageIo;
import com.google.appinventor.server.storage.StorageIoInstanceHolder;
import com.google.appinventor.server.util.CacheHeaders;
import com.google.appinventor.server.util.CacheHeadersImpl;
import com.google.appinventor.shared.rpc.Nonce;
import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.appinventor.shared.rpc.project.RawFile;
import com.google.appinventor.shared.storage.StorageUtil;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.FileNameMap;
import java.net.URLConnection;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet for building projects, and allowing other devices/computers to view the built pages.
 *
 */
public class BuildOutputServlet extends OdeServlet {

  /*
   * URIs for Build Output requests are structured as follows:
   *    /<baseurl>/<nonce>/[<folder key>/]file.ext
   *    key = storage folder location
   *          "" = build/web (ie: no folder key, just screen.html
   *          assets = assets (images, videos, etc)
   *    file.ext = file to retrieve.  Extension is used to set content type.
   */

  // Logging support
  private static final Logger LOG = Logger.getLogger(BuildOutputServlet.class.getName());

  // Object used to safely set cache headers in responses
  private static final CacheHeaders CACHE_HEADERS = new CacheHeadersImpl();

  // used to fetch the <nonce> from the above mentioned url structure
  private static final int NONCE_INDEX = 2;

  // used to fetch the <folder key> from the above mentioned url structure
  private static final int FOLDER_KEY_INDEX = 3;

  // the minimum number of segments in the url
  private static final int MIN_REQUIRED_LENGTH = FOLDER_KEY_INDEX + 1;

  // Default content type for response header (to avoid security vulnerabilities)
  private static final String CONTENT_TYPE = "text/html; charset=utf-8";

  private static final String ASSET_IDENTIFIER = "assets";

  private final FileExporter fileExporter = new FileExporterImpl();

  private final StorageIo storageIo = StorageIoInstanceHolder.INSTANCE;

  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {  

    // Set a default http header to avoid security vulnerabilities.
    CACHE_HEADERS.setNotCacheable(resp);
    resp.setContentType(CONTENT_TYPE);

    RawFile downloadableFile;

    String nonceValue = null;

    try {
      String uri = req.getRequestURI();
      // First, call split with no limit parameter.
      String[] uriComponents = uri.split("/");

      if (uriComponents.length < MIN_REQUIRED_LENGTH )
      {
        resp.sendError(resp.SC_NOT_FOUND, "Missing required path segments, nonce and file name required");
      }             

      String fileId = null;      

      nonceValue = uriComponents[NONCE_INDEX];
      // This removes expired Nonce objects
      // (10 at a time so we don't spend too
      // much time doing it)
      storageIo.cleanupNonces(); 

      Nonce nonce = storageIo.getNoncebyValue(nonceValue);
      if (nonce == null) {
        resp.sendError(resp.SC_NOT_FOUND, "Invalid Link");
        return;
      }
      Date now = new Date();
      if ((now.getTime() - nonce.getTimeStamp().getTime()) > 7200*1024) {
        resp.sendError(resp.SC_NOT_FOUND, "Link has timed out");
        return;
      }

      if (uriComponents.length == FOLDER_KEY_INDEX + 1)
      {
        // No more path segments, so this url ends with just the file name
        fileId = uriComponents[FOLDER_KEY_INDEX];
        downloadableFile = fileExporter.exportProjectOutputFile(nonce.getUserId(), nonce.getProjectId(), ServerLayout.BUILD_TARGET_WEB, fileId);
      } 
      else if (uriComponents.length >= FOLDER_KEY_INDEX + 1)
      {
        // Pick up the path segment and file name
        String folderKey = uriComponents[FOLDER_KEY_INDEX];
        // Check that the path segment is the asset folder (ie: we limit what we serve up)
        if (folderKey.equalsIgnoreCase(ASSET_IDENTIFIER))
        {
          fileId = ASSET_IDENTIFIER + "/" + uriComponents[FOLDER_KEY_INDEX+1];
          downloadableFile = fileExporter.exportFile(nonce.getUserId(), nonce.getProjectId(), fileId);
        }
        else {
          resp.sendError(resp.SC_NOT_FOUND, "Unrecognized path segment: " + folderKey);
          return;
        }
      }
      else {
        resp.sendError(resp.SC_NOT_FOUND, "Too many path segments");
        return;
      }     

    } catch (IllegalArgumentException e) {
      throw CrashReport.createAndLogError(LOG, req, "nonceValue=" + nonceValue, e);
    }

    String fileName = downloadableFile.getFileName();
    byte[] content = downloadableFile.getContent();

    // We are assuming the request url has a file with the appropriate extension 
    // so the content type map will work (ie: Screen1.html, myButton.png, etc).
    FileNameMap fileNameMap = URLConnection.getFileNameMap();
    String contentType = fileNameMap.getContentTypeFor(req.getRequestURI());    
      
    // Set http response information
    resp.setStatus(HttpServletResponse.SC_OK);
    resp.setContentType(contentType); 
    resp.setContentLength(content.length);

    LOG.log(Level.INFO, "Returning file = " + fileName + ", content type = " + contentType + ", size = " + content.length);
       
    // Attach download data
    ServletOutputStream out = resp.getOutputStream();
    out.write(content);
    out.close();
  }
}
