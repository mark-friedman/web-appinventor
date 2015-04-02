package com.google.appinventor.client.explorer.commands;

import com.google.appinventor.client.DesignToolbar;
import com.google.appinventor.client.Ode;
import com.google.appinventor.client.editor.ProjectEditor;
import com.google.appinventor.client.editor.youngandroid.BlocklyPanel;
import com.google.appinventor.client.editor.youngandroid.YaBlocksEditor;
import com.google.appinventor.client.editor.youngandroid.YaProjectEditor;
import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.appinventor.shared.rpc.project.ProjectNode;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.Window;

/**
 * Created by rahulmadhavan on 3/1/15.
 *
 * Command for launching the live webApp
 *
 * @author rahulmadhavan21@gmail.com (Rahul Madhavan K)
 */
public class LaunchLiveWebAppCommand extends ChainableCommand{

    final String WINDOW_NAME = "liveWebApp";
    final String WINDOW_OPTIONS = "scrollbars=1";

    public LaunchLiveWebAppCommand(ChainableCommand nextCommand) {
        super(nextCommand);
    }


    protected boolean willCallExecuteNextCommand() {
        return true;
    }

    @Override
    protected void execute(final ProjectNode node) {
        ProjectEditor projectEditor = Ode.getInstance().getEditorManager().getOpenProjectEditor(node.getProjectId());
        if(projectEditor instanceof YaProjectEditor){
            DesignToolbar.DesignProject currentProject = Ode.getInstance().getDesignToolbar().getCurrentProject();
            String screen = currentProject.currentScreen;
            YaProjectEditor yaProjectEditor = (YaProjectEditor)projectEditor;
            YaBlocksEditor  yaBlocksEditor = yaProjectEditor.getBlocksFileEditor(screen);
            yaBlocksEditor.initWebApp(node.getProjectId());
            executeNextCommand(node);
        }else{
            executionFailedOrCanceled();
        }

    }

}

