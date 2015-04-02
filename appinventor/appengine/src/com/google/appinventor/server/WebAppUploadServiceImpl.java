// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.server;

import com.google.appinventor.server.storage.StorageIo;
import com.google.appinventor.server.storage.StorageIoInstanceHolder;
import com.google.appinventor.shared.rpc.webapp.WebAppUploadService;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;


/**
 * The implementation of the Web App RPC service which runs on the server.
 *
 * <p>Note that this service must be state-less so that it can be run on
 * multiple servers.
 *
 * @author utdotech@gmail.com (Onyeka Igabari)
 */
public class WebAppUploadServiceImpl extends OdeRemoteServiceServlet implements WebAppUploadService {

    // Logging support
    private static final Logger LOG = Logger.getLogger(WebAppUploadServiceImpl.class.getName());

    //storage
    private final StorageIo storageIo = StorageIoInstanceHolder.INSTANCE;

    @Override
    public void uploadFile(String fileName, String fileData) {
        //LOG.log(Level.INFO, "got filename: " + fileName + " fileData: " + fileData);
        String userId = userInfoProvider.getUserId();
        List<String> userFiles = storageIo.getUserFiles(userId);
        if (!userFiles.contains(fileName)) {
            storageIo.addFilesToUser(userId, fileName);
        }
        storageIo.uploadUserFile(userInfoProvider.getUserId(), fileName, fileData,"UTF-8");
    }
}