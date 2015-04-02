// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.shared.rpc.project;

/**
 * Encapsulates a {@link RawFile} and a count of the number of
 * files contained within, representing the built output of a web project
 *
 */
public class ProjectWebOutputZip extends ProjectZip {
    /**
     * Creates new raw zip file.
     *
     * @param rawFile encapsulation of the file name and contents
     * @param fileCount the number of files in the zip file
     */
    public ProjectWebOutputZip(RawFile rawFile, int fileCount) {
        super(rawFile, fileCount);
    }

    /**
     * Creates new raw zip file.
     *
     * @param fileName file name
     * @param content file content
     * @param fileCount number of files in the zip file
     */
    public ProjectWebOutputZip(String fileName, byte[] content, int fileCount) {
        super(fileName, content, fileCount);
    }
}
