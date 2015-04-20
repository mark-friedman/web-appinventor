// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2011-2013 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.server.project.youngandroid;
import java.util.ArrayList;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONException;

import com.google.appinventor.server.properties.json.ServerJsonParser;
import com.google.appinventor.shared.properties.json.JSONObject;
import com.google.appinventor.shared.properties.json.JSONValue;
import com.google.appinventor.shared.youngandroid.YoungAndroidSourceAnalyzer;

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
    StringBuilder htmlStringBuilder = new StringBuilder();    // StringBuilder for building the page line-by-line
    StitchResult retVal = new StitchResult();

    
    // sends component JSON for parsing into HTML and CSS
    ParseResult componentPackage = Parse.parseJsonString(componentJSON, assetSrcPrefix);

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
    
    // Including Bootstrap Library - Sudeep
    htmlStringBuilder.append("<link rel=\"stylesheet\" href=\"/bootstrap/bootstrap.min.css\">\n");
      

    // inject css from the components
    /*if (!componentPackage.isEmpty()) {
      htmlStringBuilder.append("<style>\n");
      for (String[] component : componentPackage) {
        htmlStringBuilder.append(component[1] + "\n");
      }
      htmlStringBuilder.append("</style>\n");
      htmlStringBuilder.append("\n");
    }*/
    
      // inject css for bootstrap and components
      htmlStringBuilder.append("<style>\n");
      htmlStringBuilder.append("html,body\n");
      htmlStringBuilder.append("{\n");
      htmlStringBuilder.append("height : 100%;\n");
      htmlStringBuilder.append("margin : 0px;\n");
      htmlStringBuilder.append("}\n");
      htmlStringBuilder.append(".container-fluid\n");
      htmlStringBuilder.append("{\n");
      htmlStringBuilder.append("padding-left : 0px;\n");
      htmlStringBuilder.append("padding-right : 0px;\n");
      htmlStringBuilder.append("margin-right : 0px;\n");
      htmlStringBuilder.append("margin-left : 0px;\n");
      htmlStringBuilder.append("width : 100%;\n");
      htmlStringBuilder.append("height : 100%;\n");
      htmlStringBuilder.append("}\n");
      
      for (String css : componentPackage.css) {
        htmlStringBuilder.append(css + "\n");
      }
      
      htmlStringBuilder.append("</style>\n");
      htmlStringBuilder.append("\n");
    
    
    

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
    //including id for body - Sudeep
    htmlStringBuilder.append("<body id = \""+ screenName+" class=\"container-fluid\""+"\">\n");
    
    // inject html from the components

    for (String html : componentPackage.bodyHtml) {
      htmlStringBuilder.append(html + "\n");
    }     
 
    htmlStringBuilder.append("</body>\n");
    htmlStringBuilder.append("</html>");    // end of page building
    
    retVal.html = htmlStringBuilder.toString();  
    
    retVal.assetFiles = componentPackage.assetFiles;
    
    return retVal;
  }
  
  //testing
  public static void main(String args[]) 
  {
     // For debugging, mock up input for the scm and bky files for a project
     // Set to the contents of a screen bky file
     
    String blocklyJS = "";     
     //window.onload =
     //    function() {
     //    document.getElementById("Button1").onclick = function() {  if (((document.getElementById("TextBox1").value).length === 0 ? true : false)) {
     //        document.getElementById("Label2").style.visibility = (true ? "visible" : "hidden");document.getElementById("Label1").style.color = "#FF0000";}
     //      if (((document.getElementById("PasswordTextBox1").value).length === 0 ? true : false)) {
     //        document.getElementById("Label4").style.visibility = (true ? "visible" : "hidden");document.getElementById("Label11").style.color = "#FF0000";}
     //      if (((0<(document.getElementById("TextBox1").value).length)&&(0<(document.getElementById("PasswordTextBox1").value).length))) {
     //        (function() { (document.getElementById("Player1").play());})();document.location.href = "Pizza.html"}
     //    };
     //    document.getElementById("Button2").onclick = function() {  (function() { (document.getElementById("Player1").play());})();document.location.href = "Register.html"};
     //    };
     
     // Set to the contents of a screen scm file for testing
     String componentJSON = "#|\n" +
     "$JSON\n" +
     "{\"YaVersion\":\"123\",\"Source\":\"Form\",\"Properties\":{\"$Name\":\"Screen1\",\"$Type\":\"Form\",\"$Version\":\"14\",\"Uuid\":\"0\",\"BackgroundImage\":\"blur2.jpeg\",\"ScreenOrientation\":\"portrait\",\"Title\":\"Screen1\",\"$Components\":[{\"$Name\":\"Label12\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"1848186139\",\"FontBold\":\"True\",\"FontItalic\":\"True\",\"FontSize\":\"30.0\",\"Text\":\"Login\"},{\"$Name\":\"Spacer1\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-581484512\",\"Text\":\"Text for Label13\",\"Visible\":\"False\"},{\"$Name\":\"HorizontalArrangement1\",\"$Type\":\"HorizontalArrangement\",\"$Version\":\"2\",\"Uuid\":\"-1539775014\",\"$Components\":[{\"$Name\":\"VerticalArrangement2\",\"$Type\":\"VerticalArrangement\",\"$Version\":\"2\",\"Uuid\":\"-1662128288\",\"$Components\":[{\"$Name\":\"HorizontalArrangement2\",\"$Type\":\"HorizontalArrangement\",\"$Version\":\"2\",\"Uuid\":\"-1476596348\",\"$Components\":[{\"$Name\":\"Label1\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-599138246\",\"FontBold\":\"True\",\"FontSize\":\"20.0\",\"FontTypeface\":\"2\",\"HasMargins\":\"False\",\"Text\":\"Username\"},{\"$Name\":\"TextBox1\",\"$Type\":\"TextBox\",\"$Version\":\"5\",\"Uuid\":\"-1902637944\",\"FontSize\":\"18.0\",\"Hint\":\"Enter username\",\"Width\":\"300\"}]},{\"$Name\":\"Label2\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-1712769354\",\"FontItalic\":\"True\",\"HasMargins\":\"False\",\"Text\":\"*Enter username\",\"TextColor\":\"&HFFFF0000\",\"Visible\":\"False\"},{\"$Name\":\"Spacer2\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"244522724\",\"HasMargins\":\"False\",\"Text\":\"dscx\",\"TextColor\":\"&H00FFFFFF\",\"Height\":\"15\"},{\"$Name\":\"HorizontalArrangement3\",\"$Type\":\"HorizontalArrangement\",\"$Version\":\"2\",\"Uuid\":\"-368296258\",\"$Components\":[{\"$Name\":\"Label11\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"50548192\",\"FontBold\":\"True\",\"FontSize\":\"20.0\",\"Text\":\"Password\"},{\"$Name\":\"PasswordTextBox1\",\"$Type\":\"PasswordTextBox\",\"$Version\":\"3\",\"Uuid\":\"-1653887431\",\"FontSize\":\"18.0\",\"Text\":\"Enter password\",\"Width\":\"300\"}]},{\"$Name\":\"Label4\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-1601909974\",\"FontItalic\":\"True\",\"HasMargins\":\"False\",\"Text\":\"*Enter password\",\"TextColor\":\"&HFFFF0000\",\"Visible\":\"False\"},{\"$Name\":\"Spacer3\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-704696507\",\"HasMargins\":\"False\",\"Text\":\"dsx\",\"TextColor\":\"&H00FFFFFF\",\"Height\":\"15\"},{\"$Name\":\"CheckBox2\",\"$Type\":\"CheckBox\",\"$Version\":\"2\",\"Uuid\":\"933677172\",\"Text\":\"Remember me\"},{\"$Name\":\"Spacer4\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"1666097540\",\"HasMargins\":\"False\",\"Text\":\"xc\",\"TextColor\":\"&H00FFFFFF\",\"Height\":\"15\"},{\"$Name\":\"Button1\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"2059963512\",\"BackgroundColor\":\"&H00FFFFFF\",\"FontBold\":\"True\",\"FontItalic\":\"True\",\"FontSize\":\"18.0\",\"Image\":\"member-login-button.png\",\"Shape\":\"1\",\"Text\":\" \",\"Width\":\"324\",\"Height\":\"83\"}]},{\"$Name\":\"VerticalArrangement1\",\"$Type\":\"VerticalArrangement\",\"$Version\":\"2\",\"Uuid\":\"-798872588\",\"$Components\":[{\"$Name\":\"Label5\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"1884075851\",\"FontItalic\":\"True\",\"FontSize\":\"18.0\",\"FontTypeface\":\"2\",\"HasMargins\":\"False\",\"Text\":\"Not a member yet?\"},{\"$Name\":\"Spacer6\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-1612043168\",\"Text\":\"Text for Label13\",\"Visible\":\"False\"},{\"$Name\":\"Button2\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"231739164\",\"BackgroundColor\":\"&H00FFFFFF\",\"FontBold\":\"True\",\"FontItalic\":\"True\",\"FontSize\":\"18.0\",\"Image\":\"register_now1.png\",\"Shape\":\"1\",\"Text\":\" \",\"TextColor\":\"&H00FFFFFF\",\"Width\":\"250\",\"Height\":\"240\"}]}]},{\"$Name\":\"Spacer5\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-338471383\",\"HasMargins\":\"False\",\"Text\":\"dfvv\",\"TextColor\":\"&H00FFFFFF\",\"Height\":\"15\"},{\"$Name\":\"Player1\",\"$Type\":\"Player\",\"$Version\":\"6\",\"Uuid\":\"-1094937265\",\"Source\":\"app_game_interactive_alert_tone_016.mp3\"}]}}" +
     "\n|#";
     
     Boolean isLiveWebAppBuild = false;
     String assetSrcPrefix = "assets/";
     try {
      StitchResult testResult = Shell.stitchBuildHTML("test", "test", blocklyJS, componentJSON, isLiveWebAppBuild, assetSrcPrefix);
      System.out.println("Html:");
      System.out.println(testResult.html);
      System.out.println("Asset files: ");
      System.out.println(testResult.assetFiles);
    } catch (JSONException e) {
      System.out.println("Caught exception");
      e.printStackTrace();
    }     
  }     
}
