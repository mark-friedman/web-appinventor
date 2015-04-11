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
  private static String assetSrcPrefix;
  public static ArrayList<String[]> parseJsonString(String jsonString, String assetSrcPrefix)  {

    Parse.assetSrcPrefix=assetSrcPrefix;
    ArrayList<String[]> arrayList= new ArrayList<String[]>();

    if(jsonString == null||jsonString.equals(""))
      //return an empty arrayList if the jsonString is empty or null
      return arrayList;

    if(!jsonString.contains("$Components"))
    {
      //return an empty arrayList if there are no components in the jsonString
      return arrayList;
    }

    try
    {

      Map<String,JSONValue> screenProperties = YoungAndroidSourceAnalyzer.parseSourceFile(
          jsonString,new ServerJsonParser()).getProperties();
      
      
      
      JSONObject propObj = screenProperties.get("Properties").asObject();
      Map<String,JSONValue> componentObj = propObj.getProperties();      
      JSONArray componentsArray = componentObj.get("$Components").asArray();
      
      arrayList=new Parse().parseComponents(componentsArray);
      
      //Adding Screen Component

      String[] pageProperties=new Screen().getComponentString(componentObj);
      
      arrayList.add(pageProperties);
   
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
    return arrayList;	
  }

 public ArrayList<String[]> parseComponents(JSONArray componentsArray )
 {
   ArrayList<String[]> arrayList=new ArrayList<String[]>();
   
   List<JSONValue> componentsList = componentsArray.getElements();
   Component componentTypeObj = null;
   
   for(JSONValue component: componentsList)
   { 
     String[] componentInfo=null;
     Map<String,JSONValue> pairs = component.asObject().getProperties();
     String str = pairs.get("$Type").asString().getString();
     switch(str)
     {
     case "Button":
       componentTypeObj = new Button();
       ((Button)componentTypeObj).setImageSrcPrefix(Parse.assetSrcPrefix);
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
       componentTypeObj = new Image();
       ((Image)componentTypeObj).setImageSrcPrefix(assetSrcPrefix);
       break;

     case "TimePicker":
       componentTypeObj = new TimePicker();
       ((TimePicker)componentTypeObj).setImageSrcPrefix(assetSrcPrefix);
       break;
       
     case "Player":
     componentTypeObj = new Player();
     ((Player)componentTypeObj).setSrcPrefix(assetSrcPrefix);
     break;
     
     case "Slider":
       componentTypeObj = new Slider();
       break;
       
     case "VideoPlayer":
     componentTypeObj = new VideoPlayer();
     ((VideoPlayer)componentTypeObj).setSrcPrefix(assetSrcPrefix);
     break;
     
     case "ListPicker":
       componentTypeObj = new ListPicker();
       ((ListPicker)componentTypeObj).setImageSrcPrefix(assetSrcPrefix);
       break;
       
     case "ImagePicker":
       componentTypeObj =  new ImagePicker();
       ((ImagePicker)componentTypeObj).setImageSrcPrefix(assetSrcPrefix);
       break;
       
     case "Notifier":
       break;
     
     case "HorizontalArrangement":
       componentTypeObj =  new HorizontalArrangement();
       break;
     
     case "VerticalArrangement":
       componentTypeObj =  new VerticalArrangement();
       break;
     
     default: 
       System.out.println("Component type "+str+" not available!");
       break;
     }

     if(componentTypeObj!= null)
       componentInfo = componentTypeObj.getComponentString(pairs);

     arrayList.add(componentInfo);
   
   
   }
   return arrayList;
 }
  //testing
  public static void main(String args[]) 
  {
    try
    {

      String jsonData="#|\n"
    		  +"$JSON\n"
    		  +"{\"YaVersion\":\"123\",\"Source\":\"Form\",\"Properties\":{\"$Name\":\"Screen1\",\"$Type\":\"Form\",\"$Version\":\"14\",\"Uuid\":\"0\",\"AboutScreen\":\"test about\",\"AlignHorizontal\":\"3\",\"AlignVertical\":\"2\",\"AppName\":\"test6\",\"BackgroundColor\":\"&HFF00FFFF\",\"BackgroundImage\":\"kitty.png\",\"CloseScreenAnimation\":\"fade\",\"Icon\":\"kitty.png\",\"OpenScreenAnimation\":\"fade\",\"Scrollable\":\"True\",\"Title\":\"Screen1 title\",\"$Components\":[{\"$Name\":\"HorizontalArrangement1\",\"$Type\":\"HorizontalArrangement\",\"$Version\":\"2\",\"Uuid\":\"-612918430\",\"$Components\":[{\"$Name\":\"Button1\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"111932631\",\"Text\":\"Text for Button1\"},{\"$Name\":\"Button2\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"636384220\",\"Text\":\"Text for Button2\",\"Width\":\"-2\"}]}]}}"
    		  +"\n|#";
      

        

      
      Parse parseObj = new Parse();
      ArrayList<String[]> arr = new ArrayList<String[]>();
      String jsonSectionPrefix  =  FORM_PROPERTIES_PREFIX + "$JSON\n";
      int beginningOfJsonSection  =  jsonData.lastIndexOf(jsonSectionPrefix);

      if (beginningOfJsonSection  ==  -1) {
        throw new IllegalArgumentException(
            "Unable to parse file - cannot locate beginning of $JSON section");
      }
      else
      {
        arr = parseObj.parseJsonString(jsonData,"Test-prefix/");
      }
      //display HTML contents
      Iterator<String[]> itr1=arr.iterator();
      while(itr1.hasNext())
      {
        System.out.println(itr1.next()[0]);
      }

      //	display CSS contents

      Iterator<String[]> itr2=arr.iterator();
      while(itr2.hasNext())
      {
        System.out.println(itr2.next()[1]);
      }

      //  display assets
      Iterator<String[]> itr3=arr.iterator();
      while(itr3.hasNext())
      {
        String asset = itr3.next()[2];
        if (asset != null)
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
