// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.server.project.youngandroid;

import com.google.appengine.api.utils.SystemProperty;
import com.google.apphosting.api.ApiProxy;
import com.google.appinventor.common.utils.StringUtils;
import com.google.appinventor.common.version.GitBuildId;
import com.google.appinventor.components.common.YaVersion;
import com.google.appinventor.server.CrashReport;
import com.google.appinventor.server.FileExporter;
import com.google.appinventor.server.FileExporterImpl;
import com.google.appinventor.server.Server;
import com.google.appinventor.server.encryption.EncryptionException;
import com.google.appinventor.server.flags.Flag;
import com.google.appinventor.server.project.CommonProjectService;
import com.google.appinventor.server.project.utils.Security;
import com.google.appinventor.server.properties.json.ServerJsonParser;
import com.google.appinventor.server.storage.StorageIo;
import com.google.appinventor.shared.properties.json.JSONParser;
import com.google.appinventor.shared.rpc.RpcResult;
import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.appinventor.shared.rpc.project.*;
import com.google.appinventor.shared.rpc.project.youngandroid.NewYoungAndroidProjectParameters;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetNode;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetsFolder;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidBlocksNode;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidFormNode;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidPackageNode;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidProjectNode;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidSourceFolderNode;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidSourceNode;
import com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidYailNode;
import com.google.appinventor.shared.rpc.user.User;
import com.google.appinventor.shared.settings.Settings;
import com.google.appinventor.shared.settings.SettingsConstants;
import com.google.appinventor.shared.storage.StorageUtil;
import com.google.appinventor.shared.youngandroid.YoungAndroidSourceAnalyzer;
import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Strings;
import com.google.common.collect.Maps;
import com.google.common.io.CharStreams;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Provides support for Young Android projects.
 *
 * @author lizlooney@google.com (Liz Looney)
 * @author markf@google.com (Mark Friedman)
 */
public final class YoungAndroidProjectService extends CommonProjectService {

  private static int currentProgress = 0;
  private static final Logger LOG = Logger.getLogger(YoungAndroidProjectService.class.getName());

  // The value of this flag can be changed in appengine-web.xml
  private static final Flag<Boolean> sendGitVersion =
    Flag.createFlag("build.send.git.version", true);

  // Project folder prefixes
  public static final String SRC_FOLDER = YoungAndroidSourceAnalyzer.SRC_FOLDER;
  protected static final String ASSETS_FOLDER = "assets";
  static final String PROJECT_DIRECTORY = "youngandroidproject";

  // TODO(user) Source these from a common constants library.
  private static final String FORM_PROPERTIES_EXTENSION =
      YoungAndroidSourceAnalyzer.FORM_PROPERTIES_EXTENSION;
  private static final String CODEBLOCKS_SOURCE_EXTENSION =
      YoungAndroidSourceAnalyzer.CODEBLOCKS_SOURCE_EXTENSION;
  private static final String BLOCKLY_SOURCE_EXTENSION =
      YoungAndroidSourceAnalyzer.BLOCKLY_SOURCE_EXTENSION;
  private static final String YAIL_FILE_EXTENSION =
      YoungAndroidSourceAnalyzer.YAIL_FILE_EXTENSION;

  public static final String PROJECT_PROPERTIES_FILE_NAME = PROJECT_DIRECTORY + "/" +
      "project.properties";

  private static final JSONParser JSON_PARSER = new ServerJsonParser();

  // Build folder path
  private static final String BUILD_FOLDER = "build";

  public static final String PROJECT_KEYSTORE_LOCATION = "android.keystore";

  // host[:port] to use for connecting to the build server
  private static final Flag<String> buildServerHost =
      Flag.createFlag("build.server.host", "localhost:9990");

  public YoungAndroidProjectService(StorageIo storageIo) {
    super(YoungAndroidProjectNode.YOUNG_ANDROID_PROJECT_TYPE, storageIo);
  }

  /**
   * Returns project settings that can be used when creating a new project.
   */
  public static String getProjectSettings(String icon, String vCode, String vName, String useslocation, String aName) {
    icon = Strings.nullToEmpty(icon);
    vCode = Strings.nullToEmpty(vCode);
    vName = Strings.nullToEmpty(vName);
    useslocation = Strings.nullToEmpty(useslocation);
    aName = Strings.nullToEmpty(aName);
    return "{\"" + SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS + "\":{" +
        "\"" + SettingsConstants.YOUNG_ANDROID_SETTINGS_ICON + "\":\"" +
        icon + "\",\"" + SettingsConstants.YOUNG_ANDROID_SETTINGS_VERSION_CODE +
        "\":\"" + vCode +"\",\"" + SettingsConstants.YOUNG_ANDROID_SETTINGS_VERSION_NAME +
        "\":\"" + vName + "\",\"" + SettingsConstants.YOUNG_ANDROID_SETTINGS_USES_LOCATION +
        "\":\"" + useslocation + "\",\"" + SettingsConstants.YOUNG_ANDROID_SETTINGS_APP_NAME +
        "\":\"" + aName + "\"}}";
  }

  /**
   * Returns the contents of the project properties file for a new Young Android
   * project.
   *
   * @param projectName the name of the project
   * @param qualifiedName the qualified name of Screen1 in the project
   * @param icon the name of the asset to use as the application icon
   * @param vcode the version code
   * @param vname the version name
   */
  public static String getProjectPropertiesFileContents(String projectName, String qualifiedName,
    String icon, String vcode, String vname, String useslocation, String aname) {
    String contents = "main=" + qualifiedName + "\n" +
        "name=" + projectName + '\n' +
        "assets=../" + ASSETS_FOLDER + "\n" +
        "source=../" + SRC_FOLDER + "\n" +
        "build=../build\n";
    if (icon != null && !icon.isEmpty()) {
      contents += "icon=" + icon + "\n";
    }
    if (vcode != null && !vcode.isEmpty()) {
      contents += "versioncode=" + vcode + "\n";
    }
    if (vname != null && !vname.isEmpty()) {
      contents += "versionname=" + vname + "\n";
    }
    if (useslocation != null && !useslocation.isEmpty()) {
      contents += "useslocation=" + useslocation + "\n";
    }
    if (aname != null) {
      contents += "aname=" + aname + "\n";
    }
    return contents;
  }

  /**
   * Returns the contents of a new Young Android form file.
   * @param qualifiedName the qualified name of the form.
   * @return the contents of a new Young Android form file.
   */
  @VisibleForTesting
  public static String getInitialFormPropertiesFileContents(String qualifiedName) {
    final int lastDotPos = qualifiedName.lastIndexOf('.');
    String packageName = qualifiedName.split("\\.")[2];
    String formName = qualifiedName.substring(lastDotPos + 1);
    // The initial Uuid is set to zero here since (as far as we know) we can't get random numbers
    // in ode.shared.  This shouldn't actually matter since all Uuid's are random int's anyway (and
    // 0 was randomly chosen, I promise).  The TODO(user) in MockComponent.java indicates that
    // there will someday be assurance that these random Uuid's are unique.  Once that happens
    // this will be perfectly acceptable.  Until that happens, choosing 0 is just as safe as
    // allowing a random number to be chosen when the MockComponent is first created.
    return "#|\n$JSON\n" +
        "{\"YaVersion\":\"" + YaVersion.YOUNG_ANDROID_VERSION + "\",\"Source\":\"Form\"," +
        "\"Properties\":{\"$Name\":\"" + formName + "\",\"$Type\":\"Form\"," +
        "\"$Version\":\"" + YaVersion.FORM_COMPONENT_VERSION + "\",\"Uuid\":\"" + 0 + "\"," +
        "\"Title\":\"" + formName + "\",\"AppName\":\"" + packageName +"\"}}\n|#";
  }

  /**
   * Returns the initial contents of a Young Android blockly blocks file.
   */
  private static String getInitialBlocklySourceFileContents(String qualifiedName) {
    return "";
  }

  private static String packageNameToPath(String packageName) {
    return SRC_FOLDER + '/' + packageName.replace('.', '/');
  }

  public static String getSourceDirectory(String qualifiedName) {
    return StorageUtil.dirname(packageNameToPath(qualifiedName));
  }

  // CommonProjectService implementation

  @Override
  public void storeProjectSettings(String userId, long projectId, String projectSettings) {
    super.storeProjectSettings(userId, projectId, projectSettings);

    // If the icon has been changed, update the project properties file.
    // Extract the new icon from the projectSettings parameter.
    Settings settings = new Settings(JSON_PARSER, projectSettings);
    String newIcon = Strings.nullToEmpty(settings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_ICON));
    String newVCode = Strings.nullToEmpty(settings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_VERSION_CODE));
    String newVName = Strings.nullToEmpty(settings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_VERSION_NAME));
    String newUsesLocation = Strings.nullToEmpty(settings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_USES_LOCATION));
    String newAName = Strings.nullToEmpty(settings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_APP_NAME));

    // Extract the old icon from the project.properties file from storageIo.
    String projectProperties = storageIo.downloadFile(userId, projectId,
        PROJECT_PROPERTIES_FILE_NAME, StorageUtil.DEFAULT_CHARSET);
    Properties properties = new Properties();
    try {
      properties.load(new StringReader(projectProperties));
    } catch (IOException e) {
      // Since we are reading from a String, I don't think this exception can actually happen.
      e.printStackTrace();
      return;
    }
    String oldIcon = Strings.nullToEmpty(properties.getProperty("icon"));
    String oldVCode = Strings.nullToEmpty(properties.getProperty("versioncode"));
    String oldVName = Strings.nullToEmpty(properties.getProperty("versionname"));
    String oldUsesLocation = Strings.nullToEmpty(properties.getProperty("useslocation"));
    String oldAName = Strings.nullToEmpty(properties.getProperty("aname"));

    if (!newIcon.equals(oldIcon) || !newVCode.equals(oldVCode) || !newVName.equals(oldVName)
      || !newUsesLocation.equals(oldUsesLocation) || !newAName.equals(oldAName)) {
      // Recreate the project.properties and upload it to storageIo.
      String projectName = properties.getProperty("name");
      String qualifiedName = properties.getProperty("main");
      String newContent = getProjectPropertiesFileContents(projectName, qualifiedName, newIcon, newVCode, newVName, newUsesLocation, newAName);
      storageIo.uploadFileForce(projectId, PROJECT_PROPERTIES_FILE_NAME, userId,
          newContent, StorageUtil.DEFAULT_CHARSET);
    }
  }

  /**
   * {@inheritDoc}
   *
   * {@code params} needs to be an instance of
   * {@link NewYoungAndroidProjectParameters}.
   */
  @Override
  public long newProject(String userId, String projectName, NewProjectParameters params) {
    NewYoungAndroidProjectParameters youngAndroidParams = (NewYoungAndroidProjectParameters) params;
    String qualifiedFormName = youngAndroidParams.getQualifiedFormName();

    String propertiesFileName = PROJECT_PROPERTIES_FILE_NAME;
    String propertiesFileContents = getProjectPropertiesFileContents(projectName,
      qualifiedFormName, null, null, null, null, null);

    String formFileName = YoungAndroidFormNode.getFormFileId(qualifiedFormName);
    String formFileContents = getInitialFormPropertiesFileContents(qualifiedFormName);

    String blocklyFileName = YoungAndroidBlocksNode.getBlocklyFileId(qualifiedFormName);
    String blocklyFileContents = getInitialBlocklySourceFileContents(qualifiedFormName);
    
    String yailFileName = YoungAndroidYailNode.getYailFileId(qualifiedFormName);
    String yailFileContents = "";

    Project project = new Project(projectName);
    project.setProjectType(YoungAndroidProjectNode.YOUNG_ANDROID_PROJECT_TYPE);
    // Project history not supported in legacy ode new project wizard
    project.addTextFile(new TextFile(propertiesFileName, propertiesFileContents));
    project.addTextFile(new TextFile(formFileName, formFileContents));
    project.addTextFile(new TextFile(blocklyFileName, blocklyFileContents));
    project.addTextFile(new TextFile(yailFileName, yailFileContents));

    // Create new project
    return storageIo.createProject(userId, project, getProjectSettings("", "1", "1.0", "false", projectName));
  }

  @Override
  public long copyProject(String userId, long oldProjectId, String newName) {
    String oldName = storageIo.getProjectName(userId, oldProjectId);
    String oldProjectSettings = storageIo.loadProjectSettings(userId, oldProjectId);
    String oldProjectHistory = storageIo.getProjectHistory(userId, oldProjectId);
    Settings oldSettings = new Settings(JSON_PARSER, oldProjectSettings);
    String icon = oldSettings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_ICON);
    String vcode = oldSettings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_VERSION_CODE);
    String vname = oldSettings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_VERSION_NAME);
    String useslocation = oldSettings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_USES_LOCATION);
    String aname = oldSettings.getSetting(
        SettingsConstants.PROJECT_YOUNG_ANDROID_SETTINGS,
        SettingsConstants.YOUNG_ANDROID_SETTINGS_APP_NAME);

    Project newProject = new Project(newName);
    newProject.setProjectType(YoungAndroidProjectNode.YOUNG_ANDROID_PROJECT_TYPE);
    newProject.setProjectHistory(oldProjectHistory);

    // Get the old project's source files and add them to new project, modifying where necessary.
    for (String oldSourceFileName : storageIo.getProjectSourceFiles(userId, oldProjectId)) {
      String newSourceFileName;

      String newContents = null;
      if (oldSourceFileName.equals(PROJECT_PROPERTIES_FILE_NAME)) {
        // This is the project properties file. The name of the file doesn't contain the old
        // project name.
        newSourceFileName = oldSourceFileName;
        // For the contents of the project properties file, generate the file with the new project
        // name and qualified name.
        String qualifiedFormName = StringUtils.getQualifiedFormName(
            storageIo.getUser(userId).getUserEmail(), newName);
        newContents = getProjectPropertiesFileContents(newName, qualifiedFormName, icon, vcode, vname, useslocation, aname);
      } else {
        // This is some file other than the project properties file.
        // oldSourceFileName may contain the old project name as a path segment, surrounded by /.
        // Replace the old name with the new name.
        newSourceFileName = StringUtils.replaceLastOccurrence(oldSourceFileName,
            "/" + oldName + "/", "/" + newName + "/");
      }

      if (newContents != null) {
        // We've determined (above) that the contents of the file must change for the new project.
        // Use newContents when adding the file to the new project.
        newProject.addTextFile(new TextFile(newSourceFileName, newContents));
      } else {
        // If we get here, we know that the contents of the file can just be copied from the old
        // project. Since it might be a binary file, we copy it as a raw file (that works for both
        // text and binary files).
        byte[] contents = storageIo.downloadRawFile(userId, oldProjectId, oldSourceFileName);
        newProject.addRawFile(new RawFile(newSourceFileName, contents));
      }
    }

    // Create the new project and return the new project's id.
    return storageIo.createProject(userId, newProject, getProjectSettings(icon, vcode, vname, useslocation, aname));
  }

  @Override
  public ProjectRootNode getRootNode(String userId, long projectId) {
    // Create root, assets, and source nodes (they are mocked nodes as they don't really
    // have to exist like this on the file system)
    ProjectRootNode rootNode =
        new YoungAndroidProjectNode(storageIo.getProjectName(userId, projectId),
                                    projectId);
    ProjectNode assetsNode = new YoungAndroidAssetsFolder(ASSETS_FOLDER);
    ProjectNode sourcesNode = new YoungAndroidSourceFolderNode(SRC_FOLDER);

    rootNode.addChild(assetsNode);
    rootNode.addChild(sourcesNode);

    // Sources contains nested folders that are interpreted as packages
    Map<String, ProjectNode> packagesMap = Maps.newHashMap();

    // Retrieve project information
    List<String> sourceFiles = storageIo.getProjectSourceFiles(userId, projectId);
    for (String fileId : sourceFiles) {
      if (fileId.startsWith(ASSETS_FOLDER + '/')) {
        // Assets is a flat folder
        assetsNode.addChild(new YoungAndroidAssetNode(StorageUtil.basename(fileId), fileId));

      } else if (fileId.startsWith(SRC_FOLDER + '/')) {
        // We send form (.scm), blocks (.blk), and yail (.yail) nodes to the ODE client.
        YoungAndroidSourceNode sourceNode = null;
        if (fileId.endsWith(FORM_PROPERTIES_EXTENSION)) {
          sourceNode = new YoungAndroidFormNode(fileId);
        } else if (fileId.endsWith(BLOCKLY_SOURCE_EXTENSION)) {
          sourceNode = new YoungAndroidBlocksNode(fileId);
        } else if (fileId.endsWith(CODEBLOCKS_SOURCE_EXTENSION)) {
          String blocklyFileName = 
              fileId.substring(0, fileId.lastIndexOf(CODEBLOCKS_SOURCE_EXTENSION)) 
              + BLOCKLY_SOURCE_EXTENSION;
          if (!sourceFiles.contains(blocklyFileName)) {
            // This is an old project that hasn't been converted yet. Convert
            // the blocks file to Blockly format and name. Leave the old
            // codeblocks file around for now (for debugging) but don't send it to the client.
            String blocklyFileContents = convertCodeblocksToBlockly(userId, projectId, fileId);
            storageIo.addSourceFilesToProject(userId, projectId, false, blocklyFileName);
            storageIo.uploadFileForce(projectId, blocklyFileName, userId, blocklyFileContents,
                StorageUtil.DEFAULT_CHARSET);
            sourceNode = new YoungAndroidBlocksNode(blocklyFileName);
          }
        } else if (fileId.endsWith(YAIL_FILE_EXTENSION)) {
          sourceNode = new YoungAndroidYailNode(fileId);
        }
        if (sourceNode != null) {
          String packageName = StorageUtil.getPackageName(sourceNode.getQualifiedName());
          ProjectNode packageNode = packagesMap.get(packageName);
          if (packageNode == null) {
            packageNode = new YoungAndroidPackageNode(packageName, packageNameToPath(packageName));
            packagesMap.put(packageName, packageNode);
            sourcesNode.addChild(packageNode);
          }
          packageNode.addChild(sourceNode);
        }
      }
    }

    return rootNode;
  }
  
  /*
   * Convert the contents of the codeblocks file named codeblocksFileId
   * to blockly format and return the blockly contents.
   */
  private String convertCodeblocksToBlockly(String userId, long projectId, 
      String codeblocksFileId) {
    // TODO(sharon): implement this!
    return "";
  }

  @Override
  public long addFile(String userId, long projectId, String fileId) {
    if (fileId.endsWith(FORM_PROPERTIES_EXTENSION) ||
        fileId.endsWith(BLOCKLY_SOURCE_EXTENSION)) {
      // If the file to be added is a form file or a blocks file, add a new form file, a new
      // blocks file, and a new yail file (as a placeholder for later code generation)
      String qualifiedFormName = YoungAndroidSourceNode.getQualifiedName(fileId);
      String formFileName = YoungAndroidFormNode.getFormFileId(qualifiedFormName);
      String blocklyFileName = YoungAndroidBlocksNode.getBlocklyFileId(qualifiedFormName);
      String yailFileName = YoungAndroidYailNode.getYailFileId(qualifiedFormName);

      List<String> sourceFiles = storageIo.getProjectSourceFiles(userId, projectId);
      if (!sourceFiles.contains(formFileName) &&
          !sourceFiles.contains(blocklyFileName) &&
          !sourceFiles.contains(yailFileName)) {

        String formFileContents = getInitialFormPropertiesFileContents(qualifiedFormName);
        storageIo.addSourceFilesToProject(userId, projectId, false, formFileName);
        storageIo.uploadFileForce(projectId, formFileName, userId, formFileContents,
            StorageUtil.DEFAULT_CHARSET);

        String blocklyFileContents = getInitialBlocklySourceFileContents(qualifiedFormName);
        storageIo.addSourceFilesToProject(userId, projectId, false, blocklyFileName);
        storageIo.uploadFileForce(projectId, blocklyFileName, userId, blocklyFileContents,
            StorageUtil.DEFAULT_CHARSET);

        String yailFileContents = "";  // start empty
        storageIo.addSourceFilesToProject(userId, projectId, false, yailFileName);
        return storageIo.uploadFileForce(projectId, yailFileName, userId, yailFileContents,
            StorageUtil.DEFAULT_CHARSET);
      } else {
        throw new IllegalStateException("One or more files to be added already exists.");
      }

    } else {
      return super.addFile(userId, projectId, fileId);
    }
  }

  @Override
  public long deleteFile(String userId, long projectId, String fileId) {
    if (fileId.endsWith(FORM_PROPERTIES_EXTENSION) ||
        fileId.endsWith(BLOCKLY_SOURCE_EXTENSION)) {
      // If the file to be deleted is a form file or a blocks file, delete both the form file
      // and the blocks file. Also, if there was a codeblocks file laying around
      // for that same form, delete it too (if it doesn't exist the delete
      // for it will be a no-op).
      String qualifiedFormName = YoungAndroidSourceNode.getQualifiedName(fileId);
      String formFileName = YoungAndroidFormNode.getFormFileId(qualifiedFormName);
      String blocklyFileName = YoungAndroidBlocksNode.getBlocklyFileId(qualifiedFormName);
      String codeblocksFileName = YoungAndroidBlocksNode.getCodeblocksFileId(qualifiedFormName);
      String yailFileName = YoungAndroidYailNode.getYailFileId(qualifiedFormName);
      storageIo.deleteFile(userId, projectId, formFileName);
      storageIo.deleteFile(userId, projectId, blocklyFileName);
      storageIo.deleteFile(userId, projectId, codeblocksFileName);
      storageIo.deleteFile(userId, projectId, yailFileName);
      storageIo.removeSourceFilesFromProject(userId, projectId, true,
          formFileName, blocklyFileName, codeblocksFileName, yailFileName);
      return storageIo.getProjectDateModified(userId, projectId);

    } else {
      return super.deleteFile(userId, projectId, fileId);
    }
  }

  private String buildErrorMsg(String exceptionName, String userId, long projectId, String target) {
    return "Request to build failed with " + exceptionName + ", user=" + userId
        + ", project=" + projectId + ", target=" + target;
  }

  // Note that this is a function rather than just a constant because we assume it will get
  // a little more complicated when we want to get the URL from an App Engine config file or
  // command line argument.
  private String getBuildServerUrlStr(String userName, String userId,
                                      long projectId, String fileName)
      throws UnsupportedEncodingException, EncryptionException {
    return "http://" + buildServerHost.get() + "/buildserver/build-all-from-zip-async"
           + "?uname=" + URLEncoder.encode(userName, "UTF-8")
           + (sendGitVersion.get()
               ? "&gitBuildVersion="
                 + URLEncoder.encode(GitBuildId.getVersion(), "UTF-8")
               : "")
           + "&callback="
           + URLEncoder.encode("http://" + getCurrentHost() + ServerLayout.ODE_BASEURL_NOAUTH
                               + ServerLayout.RECEIVE_BUILD_SERVLET + "/"
                               + Security.encryptUserAndProjectId(userId, projectId)
                               + "/" + fileName,
                               "UTF-8");
  }

  private String getCurrentHost() {
    if (Server.isProductionServer()) {
      String applicationVersionId = SystemProperty.applicationVersion.get();
      String applicationId = SystemProperty.applicationId.get();
      return applicationVersionId + "." + applicationId + ".appspot.com";
    } else {
      // TODO(user): Figure out how to make this more generic
      return "localhost:8888";
    }
  }

  /*
   * Reads the UTF-8 content from the given input stream.
   */
  private static String readContent(InputStream stream) throws IOException {
    if (stream != null) {
      BufferedReader reader = new BufferedReader(new InputStreamReader(stream, "UTF-8"));
      try {
        return CharStreams.toString(reader);
      } finally {
        reader.close();
      }
    }
    return null;
  }

  /**
   * Check if there are any build progress available for the given user's project
   *
   * @param user the User that owns the {@code projectId}.
   * @param projectId  project id to be built
   * @param target  build target (optional, implementation dependent)
   */
  public void updateCurrentProgress(User user, long projectId, String target) {
    try {
      String userId = user.getUserId();
      String projectName = storageIo.getProjectName(userId, projectId);
      String outputFileDir = BUILD_FOLDER + '/' + target;
      URL buildServerUrl = null;
      ProjectSourceZip zipFile = null;

      buildServerUrl = new URL(getBuildServerUrlStr(user.getUserEmail(),
        userId, projectId, outputFileDir));
      HttpURLConnection connection = (HttpURLConnection) buildServerUrl.openConnection();
      connection.setDoOutput(true);
      connection.setRequestMethod("POST");

      int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
          try {
            String content = readContent(connection.getInputStream());
            if (content != null && !content.isEmpty()) {
              LOG.info("The current progress is " + content + "%.");
              currentProgress = Integer.parseInt(content);
            }
          } catch (IOException e) {
            // No content. That's ok.
          }
         }
      } catch (MalformedURLException e) {
        // that's ok, nothing to do
      } catch (IOException e) {
        // that's ok, nothing to do
      } catch (EncryptionException e) {
        // that's ok, nothing to do
      } catch (RuntimeException e) {
        // that's ok, nothing to do
      }
  }

  // Nicely format floating number using only two decimal places
  private String format(double input) {
    DecimalFormat formatter = new DecimalFormat("###.##");
    return formatter.format(input);
  }

    /**
     * Make a request to built the html files for a web project.
     * The html files are stored to a target specific project output path;
     * The client can download the output file by file or via a stored
     * zip file.
     *
     * @param user the User that owns the {@code projectId}.
     * @param projectId  project id to be built
     * @param nonce random string used to find resulting build from unauth context
     * @param target The build target (= web or LiveWebApp)
     *
     * @return an RpcResult reflecting the result of the build
     */
    public RpcResult build(User user, long projectId, String nonce, String target) {
        boolean isLiveWebAppBuild = target.equalsIgnoreCase("LiveWebApp");
        String userId = user.getUserId();
        String projectName = storageIo.getProjectName(userId, projectId);
        String outputFileDir = BUILD_FOLDER + "/" + target + "/";   // Note: forces a target

        LOG.log(Level.FINE, "Building output, target = " + target);

        // Store the userId and projectId based on the nonce
        // Note: not used currently, but could be useful for LiveWebApp?
        storageIo.storeNonce(nonce, userId, projectId);
    
        // Search storage for project source.
        // Find the Javascript and JSON files.
        List<String> screenNames = new ArrayList<String>();
        Map<String, String> screenJavaScriptFileIds = new HashMap<String, String>();
        Map<String, String> screenComponentJSONFileIds = new HashMap<String, String>();

        for (String srcFileId : storageIo.getProjectSourceFiles(userId, projectId)) {

            LOG.log(Level.FINE, "Project source file id: " + srcFileId);

            if (StorageUtil.isTextFile(srcFileId)) {
                // Pare the file id down to just the file name - no path or extension
                String fileBaseName = StorageUtil.basename(StorageUtil.trimOffExtension(srcFileId));
                boolean isScreenSourceFile = false;

                // Is this an scm file for a screen (= the component json)
                if (srcFileId.endsWith(FORM_PROPERTIES_EXTENSION))
                {
                    screenComponentJSONFileIds.put(fileBaseName, srcFileId);
                    isScreenSourceFile = true;
                }
                // Is this the generated javascript file (for now, named *.yail)
                else if (srcFileId.endsWith(YAIL_FILE_EXTENSION))
                {
                    screenJavaScriptFileIds.put(fileBaseName, srcFileId);
                    isScreenSourceFile = true;
                }

                // Build a list of screen names from the scm and yail files.
                if (isScreenSourceFile)
                {
                    if (!screenNames.contains(fileBaseName))
                    {
                        LOG.log(Level.FINE, "...adding screen: " + fileBaseName);
                        screenNames.add(fileBaseName);
                    }
                }
            }
        }

        // Delete any previously built files for this target.
        List<String> buildOutputFiles = storageIo.getProjectOutputFiles(userId, projectId);
        for (String buildOutputFile : buildOutputFiles) {
            LOG.log(Level.FINER, "...found previous output file = " + buildOutputFile);
            if (buildOutputFile.contains(outputFileDir)) {
                LOG.log(Level.FINER, "...removing previous output file = " + buildOutputFile);
                storageIo.deleteFile(userId, projectId, buildOutputFile);
            }
        }

        // For each screen, put the html file together from the component JSON and JavaScript
        ArrayList<String> assetFileIds = new ArrayList<String>();
        try {

            for (String screenName : screenNames)
            {
                // Retrieve the file ids for this screen's source.
                String screenJavaScriptFileId = screenJavaScriptFileIds.get(screenName);
                String screenComponentJSONFileId = screenComponentJSONFileIds.get(screenName);

                // Name the html output based on the screen nam (just like the source)
                String builtHtmlFileId = outputFileDir + screenName + ".html";

                // Get the javascript and json for this screen
                String screenJavaScript = storageIo.downloadFile(userId, projectId, screenJavaScriptFileId, StorageUtil.DEFAULT_CHARSET);
                LOG.log(Level.FINEST, screenJavaScriptFileId + ":  " + screenJavaScript);

                String screenComponentJSON = storageIo.downloadFile(userId, projectId, screenComponentJSONFileId, StorageUtil.DEFAULT_CHARSET);
                LOG.log(Level.FINEST, screenComponentJSONFileId + ":  " + screenComponentJSON);

                // Build the html for this screen
                StitchResult screenResult = Shell.stitchBuildHTML(projectName, screenName, screenJavaScript, screenComponentJSON, isLiveWebAppBuild, "assets/");
                LOG.log(Level.INFO, "# Asset files found = " + screenResult.assetFiles.size());               
                for (String assetFileId : screenResult.assetFiles)
                {
                  // Add any new asset references
                  if ((assetFileId != null) && !assetFileId.isEmpty() && !assetFileIds.contains(assetFileId))
                  {
                    LOG.log(Level.INFO, "   Asset file = " + assetFileId);
                    assetFileIds.add(assetFileId);
                  }
                }

                LOG.log(Level.FINEST, "Built " + builtHtmlFileId + " : " + screenResult.html);

                // Save built file (add the id as an output file, then add the contents for that id)
                LOG.log(Level.FINE, "Storing web output as " + builtHtmlFileId);
                storageIo.addOutputFilesToProject(userId, projectId, builtHtmlFileId);
                storageIo.uploadFileForce(projectId, builtHtmlFileId, userId, screenResult.html, StorageUtil.DEFAULT_CHARSET);
            }
        } catch (JSONException e) {

            // Could not turn component json into html - return error.
            ///TODO
            //CrashReport.createAndLogError(LOG, null, buildErrorMsg("", userId, projectId, target), e);
            LOG.log(Level.FINE, "JSONException details:", e);

            return new RpcResult(false, "", e.getMessage());
        }

        // Create zip file of html and associated asset files for the build.
        // e.g. referenced image files.
        if (!isLiveWebAppBuild) {
            ProjectWebOutputZip zipFile = null;
            try {
                FileExporter fileExporter = new FileExporterImpl();
                if (assetFileIds.size() > 0)
                {
                    LOG.log(Level.INFO, "..first asset file (out of " + assetFileIds.size() + ") = " + assetFileIds.get(0));
                }
                zipFile = fileExporter.exportProjectWebOutputZip(userId, projectId, assetFileIds, projectName + ".zip", true);

                byte[] fileBytes = zipFile.getContent();

                String filePath = outputFileDir + projectName + ".zip";
                LOG.log(Level.FINE, "Saving build output file: " + filePath);
                storageIo.addOutputFilesToProject(userId, projectId, filePath);
                storageIo.uploadRawFileForce(projectId, filePath, userId, fileBytes);

            } catch (IOException e) {
                throw CrashReport.createAndLogError(LOG, null, "IOException when building web output zip file", e);
            }
        }

        // Html files are built and stored - return to client.
        // File can be retrieved via DownloadServlet
        // Return success for build result
        return new RpcResult(true, "Built web output for " + projectName, "");
    }

}

