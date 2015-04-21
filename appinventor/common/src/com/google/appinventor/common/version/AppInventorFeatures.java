// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2009-2011 Google, All Rights reserved
// Copyright 2011-2012 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.common.version;

/**
 * Class used to determine whether a new feature should be visible to the user.
 *
 */
public final class AppInventorFeatures {

  private AppInventorFeatures() {
  }

  public static boolean hasDebuggingView() {
    // Set this to true if you want the Debugging view to show.
    return true;
  }

  public static boolean hasJSGenerationOption() {
    // Set this to true if you want an option to just generate JavaScript
    return true;
  }

  public static boolean sendBugReports() {
    // Set this to true if you want to prompt the user to report bugs.
    return true;
  }

  public static boolean allowMultiScreenApplications() {
    // Set this to true if you want users to be able to create more than one screen in a single
    // project.
    return true;
  }

  public static boolean showInternalComponentsCategory() {
    // Set this to true if you want to show the "For internal use only" section of the components
    // palette in the designer.
    return false;
  }

  public static boolean trackClientEvents() {
    // Set this to true if you want to track events with Google Analytics.
    return false;
  }

  /**
   * If set to return true, a splash screen will be shown on every login. The
   * Contents are defined in {@link com.google.appinventor.client.Ode#createWelcomeDialog}
   * You should set the "message" variable there to an iframe that points to your
   * content. The default size of the splash box is 400x400 (which you can change).
   *
   * @return true to display a splash screen
   */
  public static boolean showSplashScreen() {
    return false;
  }

  /**
   * If set to return true, a special splash screen offering the person to take
   * a survey is displayed. it is defined in:
   * {@link com.google.appinventor.client.Ode#showSurveySplash}
   * You should alter the wording defined there to be appropriate for your
   * situation. The words there are for MIT.
   *
   * The survey itself is defined in:
   * {@link com.google.appinventor.client.Ode#takeSurvey}
   *
   * Surveys are versioned. Once a person takes a survey they are
   * never shown the survey splash screen again until the value in
   * {@link com.google.appinventor.components.common#YaVersion.SPLASH_SURVEY}
   * is incremented.
   *
   * @return true to display the survey splash screen
   */
  public static boolean showSurveySplashScreen() {
    return false;
  }

  /**
   * If set to true, an account can be in use in only one browser tab.
   * When a new login is detected, all older sessions are no longer
   * permitted to save project files.
   *
   * @return true to limit account use to one session at a time
   */
  public static boolean requireOneLogin() {
    return false;
  }


}
