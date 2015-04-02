// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

package com.google.appinventor.client.explorer.commands;

import com.google.appinventor.client.Ode;
import com.google.appinventor.shared.rpc.project.ProjectNode;
import com.google.gwt.user.client.Command;

/**
 * Command for generating the JavaScript code for the current project
 * and saving it to the server.
 *
 * @author sharon@google.com (Sharon Perl)
 *
 * Last Edit: Feb-27-2015
 * Last Edit By: rayjl@uw.edu (Raymond Li)
 */
public class GenerateJavaScriptCommand extends ChainableCommand {

    /**
     * Creates a new generate yail command, with additional behavior provided
     * by another ChainableCommand.
     *
     * @param nextCommand the command to execute after the save has finished
     */
    public GenerateJavaScriptCommand(ChainableCommand nextCommand) {
        super(nextCommand);
    }

    @Override
    protected boolean willCallExecuteNextCommand() {
        return true;
    }

    @Override
    protected void execute(final ProjectNode node) {
        Ode.getInstance().getEditorManager().generateJavaScriptForBlocksEditors(
                new Command() {
                    @Override
                    public void execute() {
                        executeNextCommand(node);
                    }
                },
                new Command() {
                    @Override
                    public void execute() {
                        executionFailedOrCanceled();
                    }
                });
    }
}
