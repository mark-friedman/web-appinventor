package com.google.appinventor.server.project.youngandroid;

import java.util.ArrayList;
import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONArray;
import com.google.appinventor.shared.properties.json.JSONValue;

/**
 * VerticalArrangement takes JSON string for the Vertical Layout and returns 
 * HTML and CSS equivalent for itself and all the components present inside it
 * Creation date: 04/10/15
 * 
 * @author vaka.s@husky.neu.edu (Sudeep Vaka)
 */

public class VerticalArrangement extends Component{

 String assetSrcPrefix;
  
  private VerticalArrangement()
  {
    super();
  }
  
  public VerticalArrangement(String assetPrefix)
  {
    this.assetSrcPrefix = assetPrefix;
  }  
  
  Component[] components;
  
  String name = "";
  String type = "VerticalArrangement";
  String visible = "true";
  String width = "auto";
  String height = "auto";	
  String horizontalAlign = "left";
  String verticalAlign = "0%";
  
  
  public String getName() {
	return name;
}


public void setName(String name) {
	this.name = name;
}


public String getType() {
	return type;
}


public void setType(String type) {
	this.type = type;
}


public String getVisible() {
	return visible;
}


public void setVisible(String visible) {
	this.visible = visible;
}


public String getWidth() {
	return width;
}


public void setWidth(String width) {
	this.width = width;
}


public String getHeight() {
	return height;
}


public void setHeight(String height) {
	this.height = height;
}


public String getHorizontalAlign() {
	return horizontalAlign;
}


public void setHorizontalAlign(String horizontalAlign) {
	this.horizontalAlign = horizontalAlign;
}


public String getVerticalAlign() {
	return verticalAlign;
}


public void setVerticalAlign(String verticalAlign) {
	this.verticalAlign = verticalAlign;
}

private String generateCSSforComponent(ArrayList<String> arrayList,Boolean hasParent)
{
  StringBuilder sb = new StringBuilder();
  sb.append("#"+this.getName()+"\n");
  sb.append("{\n");	
  if(hasParent==null)
	  sb.append(" width : auto;\n");
  else
	  sb.append(" width : 100%;\n");
  sb.append(" height : auto;\n");
  //sb.append(" position : absolute;\n");
  sb.append(" text-align : "+this.getHorizontalAlign()+";\n");
  sb.append(" top : "+this.getVerticalAlign()+";\n");//Will not work for now!
  sb.append("}\n");
  for(String str:arrayList)
  {
	  sb.append(str);
  }
  
  return sb.toString().valueOf(sb);
}

private String generateHTMLforComponent(ArrayList<String> arrayList, Boolean hasParent)
{
  StringBuilder sb = new StringBuilder();
  if(hasParent==null)
  {}
  else if(hasParent==true)
  {
  	sb.append("<div class=\"col-md-10\"");
  	sb.append(" style=\"padding-left:0px; padding-right:0px;");
  	sb.append(" width: "+this.getWidth()+"; height: "+this.getHeight()+";\">\n");
  }
  else
  {
  	sb.append("<div class=\"row-md-10\"");
  	sb.append(" style=\"padding-left:0px; padding-right:0px;");
  	sb.append(" width: "+this.getWidth()+"; height: "+this.getHeight()+";\">\n");
  }
  
  sb.append("<div class=\"col\" id = \""+this.getName()+"\"");
  if(this.getVisible().equals("False")){
    sb.append(" hidden");
  }
  sb.append(">\n");
  if(!arrayList.isEmpty())
  {
  for(String str:arrayList)
  {
    sb.append(str);
  }
  }
  sb.append("</div>");
  if(hasParent!=null)
	  sb.append("</div>");  
  return sb.toString().valueOf(sb);
}


public ParseResult getComponentString(Map<String,JSONValue> properties, Boolean hasParent)
{
  ParseResult componentInfo = new ParseResult();
    for(String property:properties.keySet())
    {
      if(!property.equals("$Components"))
      {
      String value = properties.get(property).asString().getString();
      switch(property)
      {
      case "$Name":
        this.setName(value); 
        break;
      case "$Type":
        this.setType(value);		
        break;
      case "Visible":
        this.setVisible(value);
        break;
      case "Width":
        if(value.equals("-2"))
          this.setWidth("100%");
        else if(value.charAt(0)=='-')
          this.setWidth(value.substring(2)+"%");
        else
          this.setWidth(value+"px");
        break;
      case "Height":
        if(value.equals("-2"))
          this.setHeight("100%");
        else if(value.charAt(0)=='-')
          this.setHeight(value.substring(2)+"%");
        else
          this.setHeight(value+"px");
        break;
      case "AlignHorizontal":
          if(value.equals("0"))
            this.setHorizontalAlign("left");
          if(value.equals("3"))
            this.setHorizontalAlign("center");
          if(value.equals("2"))
            this.setHorizontalAlign("right");
          break;
        case "AlignVertical":
            if(value.equals("0"))
                this.setVerticalAlign("0%");
            if(value.equals("2"))
                this.setVerticalAlign("50%");
            if(value.equals("3"))
                this.setVerticalAlign("100%");
            break;
      case "Uuid":
        break;
      case "$Version":
        break;

      default:
        System.out.println("Invalid property"+ property +" for the component "+this.getType());
        break;
      }
      }
    }
    
    ParseResult childrenResults = new ParseResult();
    if(properties.containsKey("$Components"))
    {
      JSONArray componentsArray= properties.get("$Components").asArray();
      childrenResults=new Parse().parseComponents(componentsArray, this.assetSrcPrefix,false);
    }

    componentInfo.bodyHtml.add(generateHTMLforComponent(childrenResults.bodyHtml,hasParent));
    componentInfo.css.add(generateCSSforComponent(childrenResults.css,hasParent));
    componentInfo.assetFiles =  childrenResults.assetFiles; 

    return componentInfo;
  }  
}
