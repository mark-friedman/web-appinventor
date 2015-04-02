// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.shared.rpc.webapp;

import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

/**
 * Interface for the web app upload service.
 *
 * @author utdotech@gmail.com (Onyeka Igabari)
 */
@RemoteServiceRelativePath(ServerLayout.WEBAPP_UPLOAD_SERVICE)
public interface WebAppUploadService extends RemoteService {
    /**
     * Saves files related to the Live Web App experience.
     *
     * @param fileName  file name.
     * @param fileData  file data to save.
     */
    void uploadFile(String fileName, String fileData);
}