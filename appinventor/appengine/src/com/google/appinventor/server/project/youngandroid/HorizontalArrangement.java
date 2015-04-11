package com.google.appinventor.server.project.youngandroid;

import java.util.ArrayList;
import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONArray;
import com.google.appinventor.shared.properties.json.JSONValue;

public class HorizontalArrangement extends Component{

  Component[] components;
  
  String name = "";
  String type = "Label";
  
  
  public String[] getComponentString(Map<String,JSONValue> properties)
  {
 
    
    String[] strArray=new String[3];
    JSONArray componentsArray= properties.get("$Components").asArray();
    
    ArrayList<String[]> arrayList=new Parse().parseComponents(componentsArray);
    int span=12/arrayList.size();
    StringBuffer htmlBuffer=new StringBuffer();
    StringBuffer cssBuffer=new StringBuffer();
    StringBuffer assetsBuffer=new StringBuffer();
    htmlBuffer.append("<div class=\"row\">\n");
    for(String[] str:arrayList)
    {
      htmlBuffer.append("<div class=\"col-md-"+span+"\">\n");
      htmlBuffer.append(str[0]);
      htmlBuffer.append("</div>\n");
      cssBuffer.append(str[1]);
      assetsBuffer.append(str[2]);
    }
    htmlBuffer.append("</div>");
    strArray[0]=htmlBuffer.toString().valueOf(htmlBuffer);
    strArray[1]=cssBuffer.toString().valueOf(cssBuffer);
    strArray[2]=assetsBuffer.toString().valueOf(assetsBuffer);
    
    return strArray;
    
  }  
    
  

}
