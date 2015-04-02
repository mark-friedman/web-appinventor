// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.server;


import com.google.appinventor.server.util.CacheHeaders;
import com.google.appinventor.server.util.CacheHeadersImpl;
import com.google.appinventor.shared.rpc.project.RawFile;



import java.io.*;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet for serving files for the Live Web App
 */
public class WebAppLaunchServlet extends OdeServlet {
  /*
   * URIs for launch request are structured as follows:
   *    /<baseurl>/ode/webapp_launch/webapp/<project_id>/<target>/<screen>
   *        OR
   *    /<baseurl>/ode/webapp_launch/webapp/<project_id>/<target>/assets/<file>
   */

    // Constants for accessing split URI

    // used to fetch the <project_id> from the above mentioned url structure
    private static final int PROJECT_ID_INDEX = 4;

    // used to fetch the <target> from the above mentioned url structure
    private static final int TARGET_INDEX = 5;

    // used to fetch the <current screen> from the above mentioned url structure
    private static final int CURRENT_SCREEN_INDEX = 6;

    // max number of splits for the above mentioned url structure
    private static final int ASSET_INDEX = 7;

    // max number of splits for the above mentioned url structure
    private static final int SPLIT_LIMIT_PROJECT_OUTPUT = 8;


    // Logging support
    private static final Logger LOG = Logger.getLogger(WebAppLaunchServlet.class.getName());

    // Object used to safely set cache headers in responses
    private static final CacheHeaders CACHE_HEADERS = new CacheHeadersImpl();

    // Content type for response header (to avoid security vulnerabilities)
    private static final String HTML_CONTENT_TYPE = "text/html; charset=utf-8";

    private static final String ASSET_IDENTIFIER = "assets";

    private final FileExporter fileExporter = new FileExporterImpl();


    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        // Set a default http header to avoid security vulnerabilities.
        CACHE_HEADERS.setNotCacheable(resp);


        RawFile downloadableFile;

        String userId = null;

        try {
            String uri = req.getRequestURI();
            userId = userInfoProvider.getUserId();
            String[] uriComponents = uri.split("/", SPLIT_LIMIT_PROJECT_OUTPUT);
            long projectId = Long.parseLong(uriComponents[PROJECT_ID_INDEX]);
            String target = uriComponents[TARGET_INDEX];
            String currentScreen = uriComponents[CURRENT_SCREEN_INDEX];

            LOG.log(Level.FINE, "Web app launch: " + uri);

            if(currentScreen.equalsIgnoreCase(ASSET_IDENTIFIER)){
                String assetName = uriComponents[ASSET_INDEX];
                downloadableFile = fileExporter.exportFile(userId, projectId, ASSET_IDENTIFIER +"/"+ assetName );
            }else{
                resp.setContentType(HTML_CONTENT_TYPE);
                downloadableFile = fileExporter.exportProjectOutputFile(userId, projectId, target, currentScreen);
            }


        } catch (IllegalArgumentException e) {
            throw CrashReport.createAndLogError(LOG, req, "user=" + userId, e);
        } catch (FileNotFoundException e) {
            throw CrashReport.createAndLogError(LOG, req, "user=" + userId, e);
        }

        byte[] content = downloadableFile.getContent();

        // Set http response information
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentLength(content.length);

        // Attach download data
        ServletOutputStream out = resp.getOutputStream();
        out.write(content);
        out.close();
    }
}