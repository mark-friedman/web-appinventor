// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.server;

import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.appinventor.shared.rpc.project.ProjectWebOutputZip;
import com.google.common.base.Strings;
import com.google.appinventor.server.storage.ObjectifyStorageIo;
import com.google.appinventor.server.storage.StorageIo;
import com.google.appinventor.server.storage.StorageIoInstanceHolder;
import com.google.appinventor.shared.rpc.project.ProjectSourceZip;
import com.google.appinventor.shared.rpc.project.RawFile;
import com.google.appinventor.shared.storage.StorageUtil;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.annotation.Nullable;

import org.json.JSONException;

/**
 * Implementation of {@link FileExporter} based on {@link StorageIo}
 *
 */
public final class FileExporterImpl implements FileExporter {

  private final StorageIo storageIo = StorageIoInstanceHolder.INSTANCE;

  @Override
  public RawFile exportProjectBuildOutputFile(String userId, long projectId, String target, @Nullable RawFile importFile)
      throws IOException {
    
    // Only the web target supported for build + download zip
    if (target.equals(ServerLayout.BUILD_TARGET_WEB))
    {
         
      String projectName = storageIo.getProjectName(userId, projectId);
      ArrayList<String> assetFileIds = new ArrayList<String>();
            
      ProjectServiceImpl projSvc = new ProjectServiceImpl();
      try
      {
        Boolean result = projSvc.build(userId, projectId, target, assetFileIds);      

        // Create zip file of html and associated asset files for the build.
        // (asset files = referenced images, videos, audio files)
        if (result) {
          ProjectWebOutputZip zipFile = null;
          String fileName = projectName + ".zip";

          zipFile = exportProjectWebOutputZip(userId, projectId, assetFileIds, fileName, true, importFile);

          return zipFile.getRawFile(); 
        }
      } 
      catch (JSONException e)
      {
        throw new IllegalArgumentException("Build failed with JSON parse exception; no zip file to download");      
      }
    } 
    
    throw new IllegalArgumentException("Build failed; no zip file to download");      
    
  }

    /**
     * Export a particular screen's built html
     *
     * @param userId the userId
     * @param projectId the project id belonging to the userId
     * @param target the output target platform, or null
     * @param currentScreen the current screen
     * @return RawFile with the name and content of the exported file
     * @throws IllegalArgumentException if download request cannot be fulfilled
     *         (either no output file or too many output files)
     */
    @Override
    public RawFile exportProjectOutputFile(String userId, long projectId, String target, String currentScreen)
            throws IOException {

        String currentScreenHtmlFileId = "build/" + target + "/" + currentScreen;

        byte[] content = storageIo.downloadRawFile(userId, projectId, currentScreenHtmlFileId);
        return new RawFile(StorageUtil.basename(currentScreenHtmlFileId), content);
    }



    /**
     * Exports project web output files as a zip.
     *
     * @param userId the userId
     * @param projectId the project id belonging to the userId
     * @param assetFileIds the asset file ids representing referenced files, e.g. image files.
     * @param zipName the desired name for the zip
     * @param fatalError set to true to cause missing GCS file to throw exception
     * @return the zip file, which includes a count of the number of zipped files
     *         and (indirectly) the name of the file and its contents
     * @throws IllegalArgumentException if download request cannot be fulfilled
     *         (no source files)
     * @throws IOException if files cannot be written
     */

    @Override
    public ProjectWebOutputZip exportProjectWebOutputZip(String userId,
                                                         long projectId,
                                                         ArrayList<String> assetFileIds,
                                                         String zipName,
                                                         boolean fatalError,
                                                         @Nullable RawFile importFile) throws IOException {
        // bundle project output files as a zip
        if (storageIo instanceof ObjectifyStorageIo) {
            return ((ObjectifyStorageIo)storageIo).exportProjectWebOutputZip(userId,
                projectId, assetFileIds, zipName, fatalError, importFile);
        } else {
            throw new IllegalArgumentException("Objectify only");
        }
    }


  @Override
  public ProjectSourceZip exportProjectSourceZip(String userId, long projectId,
                                                 boolean includeProjectHistory,
                                                 boolean includeAndroidKeystore,
                                                 @Nullable String zipName,
                                                 boolean fatalError) throws IOException {
    // Download project source files as a zip.
    if (storageIo instanceof ObjectifyStorageIo) {
      return ((ObjectifyStorageIo)storageIo).exportProjectSourceZip(userId, projectId,
          includeProjectHistory, includeAndroidKeystore, zipName, fatalError);
    } else {
      throw new IllegalArgumentException("Objectify only");
    }
  }

  @Override
  public ProjectSourceZip exportAllProjectsSourceZip(String userId,
      String zipName) throws IOException {
    // Create a zip file for each project's sources.
    List<Long> projectIds = storageIo.getProjects(userId);
    if (projectIds.size() == 0) {
      throw new IllegalArgumentException("No projects to download");
    }

    ByteArrayOutputStream zipFile = new ByteArrayOutputStream();
    ZipOutputStream out = new ZipOutputStream(zipFile);
    int count = 0;
    String metadata = "";
    for (Long projectId : projectIds) {
      try {
        ProjectSourceZip projectSourceZip =
            exportProjectSourceZip(userId, projectId, false, false, null, false);
        byte[] data = projectSourceZip.getContent();
        String name = projectSourceZip.getFileName();

        // If necessary, rename duplicate projects
        while (true) {
          try {
            out.putNextEntry(new ZipEntry(name));
            break;
          } catch (IOException e) {
            name = "duplicate-" + name;
          }
        }
        metadata += projectSourceZip.getMetadata() + "\n";

        out.write(data, 0, data.length);
        out.closeEntry();
        count++;
      } catch (IllegalArgumentException e) {
        System.err.println("No files found for userid: " + userId +
            " for projectid: " + projectId);
        continue;
      } catch (IOException e) {
        System.err.println("IOException while reading files found for userid: " +
            userId + " for projectid: " + projectId);
        continue;
      }
    }
    if (count == 0) {
      throw new IllegalArgumentException("No files to download");
    }

    List<String> userFiles = storageIo.getUserFiles(userId);
    if (userFiles.contains(StorageUtil.ANDROID_KEYSTORE_FILENAME)) {
      byte[] androidKeystoreBytes =
          storageIo.downloadRawUserFile(userId, StorageUtil.ANDROID_KEYSTORE_FILENAME);
      if (androidKeystoreBytes.length > 0) {
        out.putNextEntry(new ZipEntry(StorageUtil.ANDROID_KEYSTORE_FILENAME));
        out.write(androidKeystoreBytes, 0, androidKeystoreBytes.length);
        out.closeEntry();
        count++;
      }
    }

    out.close();

    // Package the big zip file up as a ProjectSourceZip and return it.
    byte[] content = zipFile.toByteArray();
    ProjectSourceZip projectSourceZip = new ProjectSourceZip(zipName, content, count);
    projectSourceZip.setMetadata(metadata);
    return projectSourceZip;
  }

  @Override
  public RawFile exportFile(String userId, long projectId, String filePath) throws IOException {
    // Download a specific project file.
    try {
      byte[] content = storageIo.downloadRawFile(userId, projectId, filePath);
      return new RawFile(StorageUtil.basename(filePath), content);
    } catch (RuntimeException e) {
      
      throw new RuntimeException("Error downloading project file: " + filePath
          + "user=" + userId + ", project=" + projectId, e);
    }
  }

  @Override
  public RawFile exportUserFile(String userId, String filePath) throws IOException {
    // Download a specific user file.
    try {
      byte[] content = storageIo.downloadRawUserFile(userId, filePath);
      return new RawFile(StorageUtil.basename(filePath), content);
    } catch (RuntimeException e) {
      throw new RuntimeException("Error downloading user file: " + filePath
          + "user=" + userId, e);
    }
  }

  /*
   * Filters a list of file names, removing those that don't start with the given prefix.
   */
  private List<String> filterByFilePrefix(List<String> files, String prefix) {
    List<String> filteredFiles = new ArrayList<String>();
    for (String file : files) {
      if (file.startsWith(prefix)) {
        filteredFiles.add(file);
      }
    }
    return filteredFiles;
  }
}
