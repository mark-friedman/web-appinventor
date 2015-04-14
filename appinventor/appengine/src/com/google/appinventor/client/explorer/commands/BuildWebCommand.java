// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.client.explorer.commands;

import com.google.appinventor.client.ErrorReporter;
import com.google.appinventor.client.Ode;

import static com.google.appinventor.client.Ode.MESSAGES;

import com.google.appinventor.client.OdeAsyncCallback;
import com.google.appinventor.client.output.MessagesOutput;
import com.google.appinventor.client.tracking.Tracking;
import com.google.appinventor.shared.rpc.RpcResult;
import com.google.appinventor.shared.rpc.project.ProjectNode;
import com.google.gwt.http.client.Response;
import com.google.gwt.i18n.client.DateTimeFormat;

import java.util.Date;

/**
 * Command for building a target in a project.
 *
 */
public class BuildWebCommand extends ChainableCommand {
    // The build target
    private String target;

    /**
     * Creates a new build web command.
     *
     * @param target the build target
     */
    public BuildWebCommand(String target) {
        this(target, null);
    }

    /**
     * Creates a new build web command, with additional behavior provided by
     * another ChainableCommand.
     *
     * @param target the build target
     * @param nextCommand the command to execute after the build has finished
     */
    public BuildWebCommand(String target, ChainableCommand nextCommand) {
        super(nextCommand);
        this.target = target;
    }

    @Override
    public boolean willCallExecuteNextCommand() {
        return true;
    }

    @Override
    public void execute(final ProjectNode node) {
        final Ode ode = Ode.getInstance();
        final MessagesOutput messagesOutput = MessagesOutput.getMessagesOutput();
        messagesOutput.clear();
        messagesOutput.addMessages(MESSAGES.buildRequestedMessage(node.getName(),
                DateTimeFormat.getMediumDateTimeFormat().format(new Date())));

        OdeAsyncCallback<Boolean> callback =
            new OdeAsyncCallback<Boolean>(
                // failure message
                MESSAGES.buildError()) {
          @Override
          public void onSuccess(Boolean result) {        
            Tracking.trackEvent(Tracking.PROJECT_EVENT, Tracking.PROJECT_SUBACTION_BUILD_YA,
                                node.getName(), getElapsedMillis());
            if (result) {
              executeNextCommand(node);
            } else {
                  ErrorReporter.reportInfo(MESSAGES.buildFailedError());
                  executionFailedOrCanceled();
            }
          }

          @Override
          public void onFailure(Throwable caught) {
            super.onFailure(caught);
            executionFailedOrCanceled();
          }
        };

        String nonce = ode.generateNonce();
        ode.getProjectService().build(node.getProjectId(), nonce, target, callback);
    }
}
