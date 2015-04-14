// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2013 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.client;

import com.google.appinventor.client.boxes.ProjectListBox;
import com.google.appinventor.client.explorer.commands.*;
import com.google.appinventor.client.explorer.project.Project;
import com.google.appinventor.client.tracking.Tracking;
import com.google.appinventor.client.utils.Downloader;
import com.google.appinventor.client.widgets.DropDownButton;
import com.google.appinventor.client.widgets.DropDownButton.DropDownItem;
import com.google.appinventor.client.wizards.DownloadUserSourceWizard;
import com.google.appinventor.client.wizards.ProjectUploadWizard;
// TODO Add the standard template option to the "Projects" drop-down to match
// App Inventor 2. // Refer to TODOs later in this file.
//import com.google.appinventor.client.wizards.TemplateUploadWizard;
import com.google.appinventor.client.wizards.youngandroid.NewYoungAndroidProjectWizard;
import com.google.appinventor.common.version.AppInventorFeatures;
import com.google.appinventor.common.version.GitBuildId;
import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.appinventor.shared.rpc.project.ProjectRootNode;
import com.google.appinventor.shared.storage.StorageUtil;
import com.google.common.collect.Lists;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.ClickListener;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

import java.util.List;

import static com.google.appinventor.client.Ode.MESSAGES;


/**
 * TopToolbar lives in the TopPanel, to create functionality in the designer.
 */
public class TopToolbar extends Composite {
  private static final String RELEASE_NOTES_LINK_URL =
      Ode.APP_INVENTOR_DOCS_URL + "/ReleaseNotes.html";
  private static final String RELEASE_NOTES_LINK_AND_TEXT =
      "<a href=\"" + RELEASE_NOTES_LINK_URL + "\" target=\"_blank\">release notes</a>" ;
  private static final String termsOfServiceText =
      "<a href='" + Ode.APP_INVENTOR_DOCS_URL + "/about/termsofservice.html'" +
          " target=_blank>" + MESSAGES.privacyTermsLink() + "</a>";

  private static final String WIDGET_NAME_NEW = "New";
  private static final String WIDGET_NAME_SAVE = "Save";
  private static final String WIDGET_NAME_SAVE_AS = "SaveAs";
  private static final String WIDGET_NAME_CHECKPOINT = "Checkpoint";
  private static final String WIDGET_NAME_MY_PROJECTS = "MyProjects";
  private static final String WIDGET_NAME_BUILD_TO_ZIP_OUTPUT = "BuildToZipOutput";
  private static final String WIDGET_NAME_BUILD = "Build";
  private static final String WIDGET_NAME_BUILD_BARCODE = "Barcode";
  private static final String WIDGET_NAME_CONNECT_TO = "ConnectTo";
  private static final String WIDGET_NAME_WEB_APP_BUTTON = "Live Web App";
  private static final String WIDGET_NAME_PROJECT = "Project";
  private static final String WIDGET_NAME_HELP = "Help";
  private static final String WIDGET_NAME_ABOUT = "About";
  private static final String WIDGET_NAME_LIBRARY = "Library";
  private static final String WIDGET_NAME_GETSTARTED = "GetStarted";
  private static final String WIDGET_NAME_TUTORIALS = "Tutorials";
  private static final String WIDGET_NAME_TROUBLESHOOTING = "Troubleshooting";
  private static final String WIDGET_NAME_FORUMS = "Forums";
  private static final String WIDGET_NAME_FEEDBACK = "ReportIssue";;
  private static final String WIDGET_NAME_IMPORTPROJECT = "ImportProject";
  // TODO Bring the import template function back when an app is available.
  // Refer to TODOs later in this file.
//private static final String WIDGET_NAME_IMPORTTEMPLATE = "ImportTemplate";
  private static final String WIDGET_NAME_EXPORTALLPROJECTS = "ExportAllProjects";
  private static final String WIDGET_NAME_EXPORTPROJECT = "ExportProject";
  private static final String WIDGET_NAME_GENERATE_JAVASCRIPT = "GenerateJavaScript";

  private static final String WIDGET_NAME_ADMIN = "Admin";
  private static final String WIDGET_NAME_DOWNLOAD_USER_SOURCE = "DownloadUserSource";
  private static final String WIDGET_NAME_SWITCH_TO_DEBUG = "SwitchToDebugPane";

  public DropDownButton fileDropDown;
  public DropDownButton connectDropDown;
  public DropDownButton buildDropDown;
  public DropDownButton helpDropDown;
  public DropDownButton adminDropDown;

  public TopToolbar() {
    /*
     * Layout is as follows:
     * +--------------------------------------------------------------+
     * | Project ▾ | Connect ▾ | Build ▾| Help ▾| Admin ▾ |
     * +--------------------------------------------------------------+
     */
    HorizontalPanel toolbar = new HorizontalPanel();
    toolbar.setVerticalAlignment(HorizontalPanel.ALIGN_MIDDLE);

    List<DropDownItem> fileItems = Lists.newArrayList();
    List<DropDownItem> connectItems = Lists.newArrayList();
    List<DropDownItem> buildItems = Lists.newArrayList();
    List<DropDownItem> helpItems = Lists.newArrayList();

    // Projects -> {My projects; Start new project; Import project (.wai) From my computer; |;
    // Save; Save As; Checkpoint; |; Import Project (.wai) To My Computer; Export all projects;}
    fileItems.add(new DropDownItem(WIDGET_NAME_MY_PROJECTS, MESSAGES.projectMenuItem(),
        new SwitchToProjectAction()));
    fileItems.add(null);
    fileItems.add(new DropDownItem(WIDGET_NAME_NEW, MESSAGES.newProjectMenuItem(),
        new NewAction()));
    fileItems.add(new DropDownItem(WIDGET_NAME_IMPORTPROJECT, MESSAGES.importProjectMenuItem(),
        new ImportProjectAction()));
    // TODO Add the standard template option to the "Projects" drop-down to match App Inventor 2,
    // which, at the time of writing, has a "HelloPurr.aia" template app.  The code for including
    // the HellPurr.aia template can be found by searching for ".aia".  Web App Inventor now uses
    // a .wai project extension.  The next two lines will display the relevant drop-down option.
//    fileItems.add(new DropDownItem(WIDGET_NAME_IMPORTTEMPLATE, MESSAGES.importTemplateButton(),
//        new ImportTemplateAction()));
    fileItems.add(null);
    fileItems.add(new DropDownItem(WIDGET_NAME_SAVE, MESSAGES.saveMenuItem(),
        new SaveAction()));
    fileItems.add(new DropDownItem(WIDGET_NAME_SAVE_AS, MESSAGES.saveAsMenuItem(),
        new SaveAsAction()));
    fileItems.add(new DropDownItem(WIDGET_NAME_CHECKPOINT, MESSAGES.checkpointMenuItem(),
        new CheckpointAction()));
    fileItems.add(null);
    fileItems.add(new DropDownItem(WIDGET_NAME_EXPORTPROJECT, MESSAGES.exportProjectMenuItem(),
        new ExportProjectAction()));
    fileItems.add(new DropDownItem(WIDGET_NAME_EXPORTALLPROJECTS, MESSAGES.exportAllProjectsMenuItem(),
        new ExportAllProjectsAction()));


      // View -> {Live edit of web app; Download Web App; Hosted Web App;
      // Generate JavaScript only when logged in as an admin}
      buildItems.add(new DropDownItem(WIDGET_NAME_WEB_APP_BUTTON, MESSAGES.webAppMenuItem(),
              new WebAppAction()));
      buildItems.add(new DropDownItem(WIDGET_NAME_BUILD_TO_ZIP_OUTPUT, MESSAGES.buildHTMLOutputMenuItem(),
              new BuildToZipAction()));
      buildItems.add(new DropDownItem(WIDGET_NAME_BUILD_BARCODE, MESSAGES.showBarcodeMenuItem(),
              new BarcodeAction()));
      if (AppInventorFeatures.hasYailGenerationOption() && Ode.getInstance().getUser().getIsAdmin()) {
          buildItems.add(null);
      buildItems.add(new DropDownItem(WIDGET_NAME_GENERATE_JAVASCRIPT, MESSAGES.toJavaScript(),
              new GenerateJavaScriptAction()));
      }

    // Help -> {About, Library, Get Started, Tutorials, Troubleshooting, Forums, Report an Issue}
    helpItems.add(new DropDownItem(WIDGET_NAME_ABOUT, MESSAGES.aboutMenuItem(),
        new AboutAction()));
    helpItems.add(null);
    helpItems.add(new DropDownItem(WIDGET_NAME_LIBRARY, MESSAGES.libraryMenuItem(),
        new LibraryAction()));
    helpItems.add(new DropDownItem(WIDGET_NAME_GETSTARTED, MESSAGES.getStartedMenuItem(),
        new GetStartedAction()));
    helpItems.add(new DropDownItem(WIDGET_NAME_TUTORIALS, MESSAGES.tutorialsMenuItem(),
        new TutorialsAction()));
    helpItems.add(new DropDownItem(WIDGET_NAME_TROUBLESHOOTING, MESSAGES.troubleshootingMenuItem(),
        new TroubleShootingAction()));
    helpItems.add(new DropDownItem(WIDGET_NAME_FORUMS, MESSAGES.forumsMenuItem(),
        new ForumsAction()));
    helpItems.add(null);
    helpItems.add(new DropDownItem(WIDGET_NAME_FEEDBACK, MESSAGES.feedbackMenuItem(),
        new FeedbackAction()));

    // Create the TopToolbar drop down menus.
    fileDropDown = new DropDownButton(WIDGET_NAME_PROJECT, MESSAGES.projectsTabName(),
        fileItems, false);
    connectDropDown = new DropDownButton(WIDGET_NAME_CONNECT_TO, MESSAGES.connectTabName(),
        connectItems, false);
    buildDropDown = new DropDownButton(WIDGET_NAME_BUILD, MESSAGES.buildTabName(),
        buildItems, false);
    helpDropDown = new DropDownButton(WIDGET_NAME_HELP, MESSAGES.helpTabName(),
        helpItems, false);

    // Set the DropDown Styles
    fileDropDown.setStyleName("ode-TopPanelButton");
    connectDropDown.setStyleName("ode-TopPanelButton");
    buildDropDown.setStyleName("ode-TopPanelButton");
    helpDropDown.setStyleName("ode-TopPanelButton");

    // Add the Buttons to the Toolbar.
    toolbar.add(fileDropDown);
    toolbar.add(buildDropDown);

    // Commented out language switching until we have a clean Chinese translation. (AFM)
    toolbar.add(helpDropDown);

    //Only if logged in as an admin, add the Admin Button
    if (Ode.getInstance().getUser().getIsAdmin()) {
      List<DropDownItem> adminItems = Lists.newArrayList();
      adminItems.add(new DropDownItem(WIDGET_NAME_DOWNLOAD_USER_SOURCE,
          MESSAGES.downloadUserSourceMenuItem(), new DownloadUserSourceAction()));
      adminItems.add(new DropDownItem(WIDGET_NAME_SWITCH_TO_DEBUG,
          MESSAGES.switchToDebugMenuItem(), new SwitchToDebugAction()));
      adminDropDown = new DropDownButton(WIDGET_NAME_ADMIN, MESSAGES.adminTabName(), adminItems,
          false);
      adminDropDown.setStyleName("ode-TopPanelButton");
      toolbar.add(adminDropDown);
    }

    initWidget(toolbar);

  }

  // -----------------------------
  // List of Commands for use in Drop-Down Menus
  // -----------------------------

  private static class NewAction implements Command {
    @Override
    public void execute() {
      new NewYoungAndroidProjectWizard().center();
      // The wizard will switch to the design view when the new
      // project is created.
    }
  }

  private class SaveAction implements Command {
    @Override
    public void execute() {
      ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
      if (projectRootNode != null) {
        ChainableCommand cmd = new SaveAllEditorsCommand(null);
        cmd.startExecuteChain(Tracking.PROJECT_ACTION_SAVE_YA, projectRootNode);
      }
    }
  }

  private class SaveAsAction implements Command {
    @Override
    public void execute() {
      ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
      if (projectRootNode != null) {
        ChainableCommand cmd = new SaveAllEditorsCommand(
            new CopyYoungAndroidProjectCommand(false));
        cmd.startExecuteChain(Tracking.PROJECT_ACTION_SAVE_AS_YA, projectRootNode);
      }
    }
  }

  private class CheckpointAction implements Command {
    @Override
    public void execute() {
      ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
      if (projectRootNode != null) {
        ChainableCommand cmd = new SaveAllEditorsCommand(
            new CopyYoungAndroidProjectCommand(true));
        cmd.startExecuteChain(Tracking.PROJECT_ACTION_CHECKPOINT_YA, projectRootNode);
      }
    }
  }

  private static class SwitchToProjectAction implements Command {
    @Override
    public void execute() {
      Ode.getInstance().switchToProjectsView();
      Ode.getInstance().getTopToolbar().updateFileMenuButtons(0);
    }
  }

  private class BarcodeAction implements Command {
    @Override
    public void execute() {
      ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
      if (projectRootNode != null) {
        String target = "web";
        ChainableCommand cmd = new SaveAllEditorsCommand(
            new GenerateJavaScriptCommand(
                new BuildCommand(target, new ShowBarcodeCommand(target))));
//        updateBuildButton(true);
        cmd.startExecuteChain(Tracking.PROJECT_ACTION_BUILD_BARCODE_YA, projectRootNode,
            new Command() {
              @Override
              public void execute() {
//                updateBuildButton(false);
              }
            });
      }
    }
  }
  
  private static class ExportProjectAction implements Command {
    @Override
    public void execute() {
      List<Project> selectedProjects =
          ProjectListBox.getProjectListBox().getProjectList().getSelectedProjects();
      if (Ode.getInstance().getCurrentView() == Ode.PROJECTS) {
        //If we are in the projects view
        if (selectedProjects.size() == 1) {
          exportProject(selectedProjects.get(0));
        } else {
          // The user needs to select only one project.
          ErrorReporter.reportInfo(MESSAGES.wrongNumberProjectsSelected());
        }
      } else {
        //If we are in the designer view.
        Downloader.getInstance().download(ServerLayout.DOWNLOAD_SERVLET_BASE + ServerLayout.DOWNLOAD_PROJECT_SOURCE + "/" + Ode.getInstance().getCurrentYoungAndroidProjectId());
      }
    }

    private void exportProject(Project project) {
      Tracking.trackEvent(Tracking.PROJECT_EVENT,
          Tracking.PROJECT_ACTION_DOWNLOAD_PROJECT_SOURCE_YA, project.getProjectName());

      Downloader.getInstance().download(ServerLayout.DOWNLOAD_SERVLET_BASE +
          ServerLayout.DOWNLOAD_PROJECT_SOURCE + "/" + project.getProjectId());
    }
  }

  private static class ExportAllProjectsAction implements Command {
    @Override
    public void execute() {
      Tracking.trackEvent(Tracking.PROJECT_EVENT,
          Tracking.PROJECT_ACTION_DOWNLOAD_ALL_PROJECTS_SOURCE_YA);

      // Is there a way to disable the Download All button until this completes?
      if (Window.confirm(MESSAGES.downloadAllAlert())) {

        Downloader.getInstance().download(ServerLayout.DOWNLOAD_SERVLET_BASE +
            ServerLayout.DOWNLOAD_ALL_PROJECTS_SOURCE);
      }
    }
  }

  private static class ImportProjectAction implements Command {
    @Override
    public void execute() {
      new ProjectUploadWizard().center();
    }
  }

  // TODO Add the standard template option to the "Projects" drop-down to match App Inventor 2.
  // See details earlier in file.  These lines retained for that purpose.
  //private static class ImportTemplateAction implements Command {
    //@Override
    //public void execute() {
      //new TemplateUploadWizard().center();
    //}
  //}

    /**
     *
     * Build and download html for a web app project
     *
     */
    public class BuildToZipAction implements Command {
        @Override
        public void execute() {
            ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
            if (projectRootNode != null) {
                //String target = YoungAndroidProjectNode.YOUNG_ANDROID_TARGET_ANDROID;
                String target = "web";    // TODO: We need a new type of project service and project node.
                ChainableCommand cmd = new SaveAllEditorsCommand(
                        new GenerateJavaScriptCommand(
                                /* new BuildWebCommand(target, */
                                        new DownloadWebOutputCommand(target)
                                /*)*/
                                ));
//	        updateBuildButton(true);
                cmd.startExecuteChain(Tracking.PROJECT_ACTION_BUILD_DOWNLOAD_YA, projectRootNode,
                        new Command() {
                            @Override
                            public void execute() {
//	                updateBuildButton(false);
                            }
                        });
            }
        }
    }


    private class WebAppAction implements Command {

        @Override
        public void execute() {
            final ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
            if (projectRootNode != null) {

                ChainableCommand cmd = new SaveAllEditorsCommand(
                        new GenerateJavaScriptCommand(
                                new BuildCommand("LiveWebApp",
                                        new LaunchLiveWebAppCommand(null))));

                cmd.startExecuteChain(Tracking.PROJECT_ACTION_LAUNCH_LIVE_WEB_APP, projectRootNode);
            }
        }
    }

    /**
     * Implements the action to generate Javascript for the current project.
     * The intention is that this will be helpful for debugging during development,
     * and will most likely be disabled in the production system.
     */
    private class GenerateJavaScriptAction implements Command {
        @Override
        public void execute() {
            ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
            if (projectRootNode != null) {
                ChainableCommand cmd = new SaveAllEditorsCommand(new GenerateJavaScriptCommand(null));
                //updateBuildButton(true);
                cmd.startExecuteChain(Tracking.PROJECT_ACTION_BUILD_YAIL_YA, projectRootNode,
                        new Command() {
                            @Override
                            public void execute() {
                                //updateBuildButton(false);
                            }
                        });
            }
        }
    }

  private static class AboutAction implements Command {
    @Override
    public void execute() {
      final DialogBox db = new DialogBox(false, true);
      db.setText("About MIT Web App Inventor");
      db.setStyleName("ode-DialogBox");
      db.setHeight("200px");
      db.setWidth("400px");
      db.setGlassEnabled(true);
      db.setAnimationEnabled(true);
      db.center();

      VerticalPanel DialogBoxContents = new VerticalPanel();
      HTML message = new HTML(
          MESSAGES.gitBuildId(GitBuildId.getDate(), GitBuildId.getVersion()) +
 //             "<BR/>Use Companion: " + BlocklyPanel.getCompVersion() +
              "<BR/><BR/>Please see " + RELEASE_NOTES_LINK_AND_TEXT +
              "<BR/><BR/>" + termsOfServiceText
      );

      SimplePanel holder = new SimplePanel();
      Button ok = new Button("Close");
      ok.addClickListener(new ClickListener() {
        public void onClick(Widget sender) {
          db.hide();
        }
      });
      holder.add(ok);
      DialogBoxContents.add(message);
      DialogBoxContents.add(holder);
      db.setWidget(DialogBoxContents);
      db.show();
    }
  }

  private static class LibraryAction implements Command {
    @Override
    public void execute() {
      Window.open("http://appinventor.mit.edu/explore/library", "_ai2", "scrollbars=1");
    }
  }

  private static class GetStartedAction implements Command {
    @Override
    public void execute() {
      Window.open("http://appinventor.mit.edu/explore/get-started", "_ai2", "scrollbars=1");
    }
  }

  private static class TutorialsAction implements Command {
    @Override
    public void execute() {
      Window.open("http://appinventor.mit.edu/explore/ai2/tutorials", "_ai2", "scrollbars=1");
    }
  }

  private static class TroubleShootingAction implements Command {
    @Override
    public void execute() {
      Window.open("http://appinventor.mit.edu/explore/ai2/support/troubleshooting", "_ai2",
          "scrollbars=1");
    }
  }

  private static class ForumsAction implements Command {
    @Override
    public void execute() {
      Window.open("https://groups.google.com/forum/#!forum/mitappinventortest", "_ai2", "scrollbars=1");
    }
  }

  private static class FeedbackAction implements Command {
    @Override
    public void execute() {
      Window.open("http://something.example.com", "_blank", "scrollbars=1");
    }
  }

  private void updateConnectToDropDownButton(boolean isEmulatorRunning, boolean isCompanionRunning, boolean isUsbRunning){
    if (!isEmulatorRunning && !isCompanionRunning && !isUsbRunning) {
      connectDropDown.setItemEnabled(MESSAGES.AICompanionMenuItem(), true);
      connectDropDown.setItemEnabled(MESSAGES.emulatorMenuItem(), true);
      connectDropDown.setItemEnabled(MESSAGES.usbMenuItem(), true);
    } else {
      connectDropDown.setItemEnabled(MESSAGES.AICompanionMenuItem(), false);
      connectDropDown.setItemEnabled(MESSAGES.emulatorMenuItem(), false);
      connectDropDown.setItemEnabled(MESSAGES.usbMenuItem(), false);
    }
  }

  /**
   * Indicate that we are no longer connected to the Companion, adjust
   * buttons accordingly. Called from BlocklyPanel
   */
  public static void indicateDisconnect() {
    TopToolbar instance = Ode.getInstance().getTopToolbar();
    instance.updateConnectToDropDownButton(false, false, false);
  }

  /**
   * Enables and/or disables buttons based on how many projects exist
   * (in the case of "Download All Projects") or are selected (in the case
   * of "Delete" and "Download Source").
   */
  public void updateFileMenuButtons(int view) {
    if (view == 0) {  // We are in the Projects view
      fileDropDown.setItemEnabled(MESSAGES.deleteProjectMenuItem(),
          Ode.getInstance().getProjectManager().getProjects() == null);
      fileDropDown.setItemEnabled(MESSAGES.exportAllProjectsMenuItem(),
          Ode.getInstance().getProjectManager().getProjects().size() > 0);
      fileDropDown.setItemEnabled(MESSAGES.exportProjectMenuItem(), false);
      fileDropDown.setItemEnabled(MESSAGES.saveMenuItem(), false);
      fileDropDown.setItemEnabled(MESSAGES.saveAsMenuItem(), false);
      fileDropDown.setItemEnabled(MESSAGES.checkpointMenuItem(), false);
      buildDropDown.setItemEnabled(MESSAGES.showBarcodeMenuItem(), false);
      buildDropDown.setItemEnabled(MESSAGES.downloadToComputerMenuItem(), false);
    } else { // We have to be in the Designer/Blocks view
      fileDropDown.setItemEnabled(MESSAGES.deleteProjectButton(), false);
      fileDropDown.setItemEnabled(MESSAGES.exportAllProjectsMenuItem(), false);
      fileDropDown.setItemEnabled(MESSAGES.exportProjectMenuItem(), true);
      fileDropDown.setItemEnabled(MESSAGES.saveMenuItem(), true);
      fileDropDown.setItemEnabled(MESSAGES.saveAsMenuItem(), true);
      fileDropDown.setItemEnabled(MESSAGES.checkpointMenuItem(), true);
      buildDropDown.setItemEnabled(MESSAGES.showBarcodeMenuItem(), true);
      buildDropDown.setItemEnabled(MESSAGES.downloadToComputerMenuItem(), true);
    }
    updateKeystoreFileMenuButtons();
  }

  /**
   * Enables or disables buttons based on whether the user has an android.keystore file.
   */
  public void updateKeystoreFileMenuButtons() {
    Ode.getInstance().getUserInfoService().hasUserFile(StorageUtil.ANDROID_KEYSTORE_FILENAME,
        new AsyncCallback<Boolean>() {
          @Override
          public void onSuccess(Boolean keystoreFileExists) {
            fileDropDown.setItemEnabled(MESSAGES.deleteKeystoreMenuItem(), keystoreFileExists);
            fileDropDown.setItemEnabled(MESSAGES.downloadKeystoreMenuItem(), keystoreFileExists);
          }

          @Override
          public void onFailure(Throwable caught) {
            // Enable the MenuItems. If they are clicked, we'll check again if the keystore exists.
            fileDropDown.setItemEnabled(MESSAGES.deleteKeystoreMenuItem(), true);
            fileDropDown.setItemEnabled(MESSAGES.downloadKeystoreMenuItem(), true);
          }
        });
  }


  //Admin commands
  private static class DownloadUserSourceAction implements Command {
    @Override
    public void execute() {
      new DownloadUserSourceWizard().center();
    }
  }

  private static class SwitchToDebugAction implements Command {
    @Override
    public void execute() {
      Ode.getInstance().switchToDebuggingView();
    }
  }

}
