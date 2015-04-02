package com.google.appinventor.server.project.youngandroid;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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

  public static ArrayList<String[]> parseJsonString(String jsonString, String assetSrcPrefix)  {

    ArrayList<String[]> arrayList= new ArrayList<String[]>();

    if(jsonString == null||jsonString.equals(""))
      //return an empty arrayList if the jsonString is empty or null
      return arrayList;

    if(!jsonString.contains("$Components"))
    {
      //return an empty arrayList if there are no components in the jsonString
      return arrayList;
    }


    Component componentTypeObj = null;

    try
    {

      Map<String,JSONValue> screenProperties = YoungAndroidSourceAnalyzer.parseSourceFile(
          jsonString,new ServerJsonParser()).getProperties();
      JSONObject propObj = screenProperties.get("Properties").asObject();
      Map<String,JSONValue> componentObj = propObj.getProperties();
      JSONArray componentsArray = componentObj.get("$Components").asArray();
      List<JSONValue> componentsList = componentsArray.getElements();

      for(JSONValue component: componentsList)
      {	
        String[] componentInfo=null;
        Map<String,JSONValue> pairs = component.asObject().getProperties();
        String str = pairs.get("$Type").asString().getString();
        switch(str)
        {
        case "Button":
          componentTypeObj = new Button();
          ((Button)componentTypeObj).setImageSrcPrefix(assetSrcPrefix);
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
          componentTypeObj = new Image();
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
        
        default: 
          System.out.println("Component type "+str+" not available!");
          break;
        }

        if(componentTypeObj!= null)
          componentInfo = componentTypeObj.getComponentString(pairs);

        arrayList.add(componentInfo);
      }
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
    return arrayList;	
  }


  //testing
  public static void main(String args[]) 
  {
    try
    {


      String jsonData="#|\n"
      + "$JSON\n"
      + "{\"YaVersion\":\"119\",\"Source\":\"Form\",\"Properties\":{\"$Name\":\"Register\",\"$Type\":\"Form\",\"$Version\":\"14\",\"Uuid\":\"0\",\"AppName\":\"test1\",\"Title\":\"Register\",\"$Components\":[{\"$Name\":\"Label1\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-177394367\",\"FontItalic\":\"True\",\"FontSize\":\"16.0\",\"Text\":\"Name\"},{\"$Name\":\"TextBox1\",\"$Type\":\"TextBox\",\"$Version\":\"5\",\"Uuid\":\"1682030922\",\"FontItalic\":\"True\",\"Hint\":\"Hint for TextBox1\",\"Width\":\"200\",\"Height\":\"18\"},{\"$Name\":\"Label2\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"1530066703\",\"FontItalic\":\"True\",\"FontSize\":\"16.0\",\"Text\":\"Last name\"},{\"$Name\":\"TextBox2\",\"$Type\":\"TextBox\",\"$Version\":\"5\",\"Uuid\":\"-1239624196\",\"FontItalic\":\"True\",\"Hint\":\"Hint for TextBox2\",\"Width\":\"200\",\"Height\":\"18\"},{\"$Name\":\"Label3\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-1322055572\",\"FontItalic\":\"True\",\"FontSize\":\"16.0\",\"Text\":\"Username\"},{\"$Name\":\"TextBox3\",\"$Type\":\"TextBox\",\"$Version\":\"5\",\"Uuid\":\"-677506353\",\"FontItalic\":\"True\",\"Hint\":\"Hint for TextBox3\",\"Width\":\"200\",\"Height\":\"18\"},{\"$Name\":\"Label4\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-926576561\",\"FontItalic\":\"True\",\"FontSize\":\"16.0\",\"Text\":\"Password\"},{\"$Name\":\"PasswordTextBox1\",\"$Type\":\"PasswordTextBox\",\"$Version\":\"2\",\"Uuid\":\"946815680\",\"FontItalic\":\"True\",\"Width\":\"200\",\"Height\":\"18\"},{\"$Name\":\"Label5\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-560491837\",\"FontItalic\":\"True\",\"FontSize\":\"16.0\",\"Text\":\"Gender\"},{\"$Name\":\"ListPicker1\",\"$Type\":\"ListPicker\",\"$Version\":\"9\",\"Uuid\":\"-431529176\",\"ElementsFromString\":\"Male,Female\",\"FontItalic\":\"True\",\"Selection\":\"Male\",\"Text\":\"-- Select one --\",\"Height\":\"18\"},{\"$Name\":\"Label6\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-947567036\",\"FontItalic\":\"True\",\"FontSize\":\"16.0\",\"Text\":\"Image\"},{\"$Name\":\"ImagePicker1\",\"$Type\":\"ImagePicker\",\"$Version\":\"5\",\"Uuid\":\"1053366843\",\"FontItalic\":\"True\",\"Text\":\"Browse an image\"},{\"$Name\":\"Label7\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-2004923596\",\"FontSize\":\"16.0\",\"Text\":\"Data of birth\"},{\"$Name\":\"DatePicker1\",\"$Type\":\"DatePicker\",\"$Version\":\"2\",\"Uuid\":\"-1683918933\",\"FontItalic\":\"True\",\"Text\":\"Pick a date\"},{\"$Name\":\"Label8\",\"$Type\":\"Label\",\"$Version\":\"3\",\"Uuid\":\"-515319584\",\"FontSize\":\"16.0\",\"Text\":\"Weight\"},{\"$Name\":\"Slider1\",\"$Type\":\"Slider\",\"$Version\":\"1\",\"Uuid\":\"787616690\",\"Width\":\"300\"},{\"$Name\":\"Button1\",\"$Type\":\"Button\",\"$Version\":\"6\",\"Uuid\":\"665942090\",\"FontBold\":\"True\",\"FontItalic\":\"True\",\"FontSize\":\"18.0\",\"Shape\":\"1\",\"Text\":\"Register\"}]}}"
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
