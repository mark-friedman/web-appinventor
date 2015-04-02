// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.shared.rpc.webapp;

import com.google.gwt.user.client.rpc.AsyncCallback;

/**
 * Asynchronous version of {@link com.google.appinventor.shared.rpc.webapp.WebAppUploadService}.
 *
 * @author utdotech@gmail.com (Onyeka Igabari)
 */
public interface WebAppUploadServiceAsync {
    /**
     * See {@link com.google.appinventor.shared.rpc.webapp.WebAppUploadService#uploadFile(String, String)}.
     */
    void uploadFile(String fileName, String fileData, AsyncCallback<Void> callback);
}