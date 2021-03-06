package com.google.appinventor.server.project.youngandroid;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.google.appengine.repackaged.com.google.gson.JsonArray;
import com.google.appinventor.server.project.youngandroid.Button;
import com.google.appinventor.server.project.youngandroid.CheckBox;
import com.google.appinventor.server.project.youngandroid.Component;
import com.google.appinventor.server.project.youngandroid.DatePicker;
import com.google.appinventor.server.project.youngandroid.Label;
import com.google.appinventor.server.project.youngandroid.ListView;
import com.google.appinventor.server.project.youngandroid.PasswordTextBox;
import com.google.appinventor.server.project.youngandroid.TextBox;
import com.google.appinventor.server.properties.json.ServerJsonParser;
import com.google.appinventor.shared.youngandroid.YoungAndroidSourceAnalyzer;
import com.google.appinventor.shared.properties.json.*;

/**
 * Parse takes JSON string of a screen and creates an HTML and CSS strings
 * for each component and returns them as an array list
 * 
 * Creation date: 03/07/15
 * 
 * @author veluru.k@husky.neu.edu (Kaushik Veluru)
 */

public class Parse {

  private static final String FORM_PROPERTIES_PREFIX  =  "#|\n";
  private static final String FORM_PROPERTIES_SUFFIX  =  "\n|#";

  public static ParseResult parseJsonString(String jsonString, String assetSrcPrefix)  {

    ParseResult screenResult = new ParseResult();
    
    if(jsonString == null||jsonString.equals(""))
      //return an empty result set if the jsonString is empty or null
      return screenResult;

    if(!jsonString.contains("$Components"))
    {
      //return an empty result set if there are no components in the jsonString
      return screenResult;
    }

    try
    {

      Map<String,JSONValue> screenProperties = YoungAndroidSourceAnalyzer.parseSourceFile(
          jsonString,new ServerJsonParser()).getProperties();     
      
      
      JSONObject propObj = screenProperties.get("Properties").asObject();
      Map<String,JSONValue> componentObj = propObj.getProperties();      
      JSONArray componentsArray = componentObj.get("$Components").asArray();
      
      //hasParent - null by default i.e. no parent components
      screenResult = new Parse().parseComponents(componentsArray, assetSrcPrefix,null);
      
      //Adding Screen Component
      Screen screen = new Screen(assetSrcPrefix);      
      ParseResult pageProperties= screen.getComponentString(componentObj,null);
      
      if (pageProperties != null)
      {
        // Fold component results into the overall result collections
        screenResult.css.addAll(pageProperties.css); 
        screenResult.bodyHtml.addAll(pageProperties.bodyHtml);         
        screenResult.assetFiles.addAll(pageProperties.assetFiles);
      }
   
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
    return screenResult;	
  }

//hasParent - null (no parent component)
//hasParent - false VerticalArrangement
//hasParent - true HorizontalArrangement
 public ParseResult parseComponents(JSONArray componentsArray, String assetSrcPrefix, Boolean hasParent)
 {
   ParseResult overallResult = new ParseResult();
   
   List<JSONValue> componentsList = componentsArray.getElements();
   
   for(JSONValue component: componentsList)
   { 
     Component componentTypeObj = null;
     Map<String,JSONValue> pairs = component.asObject().getProperties();
     String str = pairs.get("$Type").asString().getString();
     switch(str)
     {
     case "Button":
       componentTypeObj = new Button(assetSrcPrefix);
       break;

     case "Label":
       componentTypeObj = new Label();
       break;

     case "TextBox":
       componentTypeObj = new TextBox();
       break;

     case "PasswordTextBox":
       componentTypeObj = new PasswordTextBox();
       break;

     case "CheckBox":
       componentTypeObj = new CheckBox();
       break;

     case "DatePicker":
       componentTypeObj = new DatePicker();
       break;

     case "ListView":
       componentTypeObj = new ListView();
       break;

     case "Image":
       componentTypeObj = new Image(assetSrcPrefix);
       break;

     case "TimePicker":
       componentTypeObj = new TimePicker(assetSrcPrefix);
       break;
       
     case "Player":
     componentTypeObj = new Player(assetSrcPrefix);
     break;
     
     case "Slider":
       componentTypeObj = new Slider();
       break;
       
     case "VideoPlayer":
     componentTypeObj = new VideoPlayer(assetSrcPrefix);
     break;
     
     case "ListPicker":
       componentTypeObj = new ListPicker(assetSrcPrefix);
       break;
       
     case "ImagePicker":
       componentTypeObj =  new ImagePicker(assetSrcPrefix);
       break;
       
     case "Notifier":
       break;
     
     case "HorizontalArrangement":
       componentTypeObj =  new HorizontalArrangement(assetSrcPrefix);
       break;
     
     case "VerticalArrangement":
       componentTypeObj =  new VerticalArrangement(assetSrcPrefix);
       break;
     
     default: 
       System.out.println("Component type "+str+" not available!");
       break;
     }

     if(componentTypeObj!= null)
     {
       ParseResult componentInfo = componentTypeObj.getComponentString(pairs,hasParent);
       if (componentInfo != null)
       {
         // Fold component results into the overall result collections
         overallResult.css.addAll(componentInfo.css); 
         overallResult.bodyHtml.addAll(componentInfo.bodyHtml);         
         overallResult.assetFiles.addAll(componentInfo.assetFiles);
       }

     }
   
   }
   return overallResult;
 }
  //testing
  public static void main(String args[]) 
  {
    try
    {

      String jsonData="#|\n"+
    		  "$JSON\n"+
    		  "{\"YaVersion\":\"123\",\"Source\":\"Form\",\"Properties\":{\"$Name\":\"Screen1\",\"$Type\":\"Form\",\"$Version\":\"14\",\"Uuid\":\"0\",\"Title\":\"Screen1\",\"$Components\":[{\"$Name\":\"Button1\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"-2122937867\",\"Text\":\"Text for Button1\"},{\"$Name\":\"HorizontalArrangement1\",\"$Type\":\"HorizontalArrangement\",\"$Version\":\"2\",\"Uuid\":\"1127460800\",\"Width\":\"-2\",\"$Components\":[{\"$Name\":\"Button2\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"910403406\",\"Text\":\"Text for Button2\",\"Width\":\"-1030\"},{\"$Name\":\"VerticalArrangement1\",\"$Type\":\"VerticalArrangement\",\"$Version\":\"2\",\"Uuid\":\"-688019623\",\"Width\":\"-1040\",\"$Components\":[{\"$Name\":\"Button3\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"1117809389\",\"Text\":\"Text for Button3\"},{\"$Name\":\"Button4\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"218831372\",\"Text\":\"Text for Button4\"}]},{\"$Name\":\"Button5\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"-1937641274\",\"Text\":\"Text for Button5\",\"Width\":\"-1030\"}]},{\"$Name\":\"VerticalArrangement2\",\"$Type\":\"VerticalArrangement\",\"$Version\":\"2\",\"Uuid\":\"357884109\",\"$Components\":[{\"$Name\":\"Button6\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"392138104\",\"Text\":\"Text for Button6\"}]}]}}"+
    		  "\n|#";
      
      Parse parseObj = new Parse();
      ParseResult results = new ParseResult();
      String jsonSectionPrefix  =  FORM_PROPERTIES_PREFIX + "$JSON\n";
      int beginningOfJsonSection  =  jsonData.lastIndexOf(jsonSectionPrefix);

      if (beginningOfJsonSection  ==  -1) {
        throw new IllegalArgumentException(
            "Unable to parse file - cannot locate beginning of $JSON section");
      }
      else
      {
        results = parseObj.parseJsonString(jsonData,"Test-prefix/");
      }
      //display HTML contents
      Iterator<String> itr1=results.bodyHtml.iterator();
      while(itr1.hasNext())
      {
        System.out.println(itr1.next());
      }

      //	display CSS contents

      Iterator<String> itr2=results.css.iterator();
      while(itr2.hasNext())
      {
        System.out.println(itr2.next());
      }

      //  display assets
      Iterator<String> itr3=results.assetFiles.iterator();
      while(itr3.hasNext())
      {
        String asset = itr3.next();
        if ((asset != null) && !asset.isEmpty())
        {
          System.out.println("asset = " + asset);
        }
        else {
          System.out.println("No asset for component");         
        }
      }  
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }

}
