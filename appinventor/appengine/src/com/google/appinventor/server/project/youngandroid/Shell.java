// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2011-2013 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.server.project.youngandroid;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONException;

/**
 * Shell takes component and blockly data and creates an HTML string
 * that represents the web output for a project.
 * 
 * Creation date: 02/28/15
 * 
 * @author court.s@husky.neu.edu (Stephen Court)
 */

public class Shell {

  /**
   * Builds the html for a screen in a project using JavaScript and component JSON
   * 
   * @param projectName = name of the project 
   * @param screenName = name of the screen in teh project
   * @param blocklyJavascript = javascript to include
   * @param componentJSON = "wrapped" component JSON
   * @param isLiveWebAppBuild = is this a LiveWebApp build or a "normal" build
   * @param assetSrcPrefix = a prefix to add to any src attribute values for components (ie: for images and the like)
   * @return the resulting html for the screen 
   * @throws JSONException
   */
  public static StitchResult stitchBuildHTML (String projectName,
                                              String screenName,
                                              String blocklyJavascript,
                                              String componentJSON,
                                              boolean isLiveWebAppBuild,
                                              String assetSrcPrefix)
                                                  throws JSONException {

    // New objects for component data manipulation
    ArrayList<String[]> componentPackage= new ArrayList<>();  // component data after parsing the data-store contents
    StringBuilder htmlStringBuilder = new StringBuilder();    // StringBuilder for building the page line-by-line
    StitchResult retVal = new StitchResult();

    // sends component JSON for parsing into HTML and CSS
    componentPackage = Parse.parseJsonString(componentJSON, assetSrcPrefix);

    // build the page sections
    htmlStringBuilder.append("<!doctype html>\n");
    htmlStringBuilder.append("<html lang='en'>\n");
    htmlStringBuilder.append("<head>\n");
    htmlStringBuilder.append("<meta charset='utf-8'>\n");
    htmlStringBuilder.append("<title>");
    // ToDo #1 - do we need to html encode here 
    //          (guessing yes, but would need to verify how client stores string property values)
    // ToDo #2 - This likely should be the screen Title attribute, not the screen component name
    htmlStringBuilder.append(screenName); 
    htmlStringBuilder.append("</title>\n");

    // inject css from the components
    if (!componentPackage.isEmpty()) {
      htmlStringBuilder.append("<style>\n");
      for (String[] component : componentPackage) {
        htmlStringBuilder.append(component[1] + "\n");
      }
      htmlStringBuilder.append("</style>\n");
      htmlStringBuilder.append("\n");
    }

    // inject javascript from blockly
    htmlStringBuilder.append("<script>\n");
    htmlStringBuilder.append(blocklyJavascript);
    htmlStringBuilder.append("</script>\n");
    
    // inject live edit javascript src tag
    if (isLiveWebAppBuild) {
      htmlStringBuilder.append("<script type=\"text/javascript\" src=\"/livewebapp/livewebapp.js\"></script>\n");
      htmlStringBuilder.append("<script type=\"text/javascript\">\n");
      htmlStringBuilder.append("liveWebApp.addClientListener(receiveMessage);\n");
      htmlStringBuilder.append("function receiveMessage(event){ eval(event.data); }\n");
      htmlStringBuilder.append("</script>\n");
    }

    htmlStringBuilder.append("</head>\n");
    htmlStringBuilder.append("<body>\n");

    // inject html from the components
    if (!componentPackage.isEmpty()) {
      for (String[] component : componentPackage) {
        htmlStringBuilder.append("<div>");
        htmlStringBuilder.append(component[0] + "\n");
        htmlStringBuilder.append("</div>\n");
               
        // While we are at it, collect any image asset file ids
        if ((component.length > 2) && (component[2] != null) && (component[2] != ""))
        {
          // Collect the unique set of referenced assets (no dupes)
          if (!retVal.assetFiles.contains(component[2])) {
            retVal.assetFiles.add(component[2]);
          }
        }        
      }
    }

    htmlStringBuilder.append("</body>\n");
    htmlStringBuilder.append("</html>");    // end of page building
    
    retVal.html = htmlStringBuilder.toString();  
    
    return retVal;
  }
}
