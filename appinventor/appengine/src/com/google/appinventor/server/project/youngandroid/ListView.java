package com.google.appinventor.server.project.youngandroid;

import java.util.Map;
import java.util.StringTokenizer;

import com.google.appinventor.shared.properties.json.JSONValue;

public class ListView extends Component{

  String backgroundColor = "";
  String elementsFromString = "";
  String textSize = "14";
  String textColor = "#000000";
  String visible = "true";
  String width = "160px";
  String height = "auto";
  String name = "";
  String type = "ListView";

  public String getBackgroundColor() {
    return backgroundColor;
  }
  public void setBackgroundColor(String backgroundColor) {
    this.backgroundColor  =  backgroundColor;
  }
  public String getElementsFromString() {
    return elementsFromString;
  }
  public void setElementsFromString(String elementsFromString) {
    this.elementsFromString  =  elementsFromString;
  }
  public String getTextSize() {
    return textSize;
  }
  public void setTextSize(String textSize) {
    this.textSize  =  textSize;
  }
  public String getTextColor() {
    return textColor;
  }
  public void setTextColor(String textColor) {
    this.textColor  =  textColor;
  }
  public String getVisible() {
    return visible;
  }
  public void setVisible(String visible) {
    this.visible  =  visible;
  }
  public String getWidth() {
    return width;
  }
  public void setWidth(String width) {
    this.width  =  width;
  }
  public String getHeight() {
    return height;
  }
  public void setHeight(String height) {
    this.height  =  height;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name  =  name;
  }
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type  =  type;
  }

  private String generateCSSforComponent(Boolean hasParent)
  {
    StringBuilder sb = new StringBuilder();
    sb.append("#"+this.getName()+"\n");
    sb.append("{\n");

    if(!this.getBackgroundColor().equals(""))
      sb.append(" background : "+this.getBackgroundColor()+";\n");
    sb.append(" font-size :"+this.getTextSize()+"px;\n");
    sb.append(" color : "+this.getTextColor()+";\n");
    //sb.append(" width : "+this.getWidth()+";\n");
    //sb.append(" height : "+this.getHeight()+";\n");
    sb.append("}\n");



    return sb.toString().valueOf(sb);
  }

  private String generateHTMLforComponent(Boolean hasParent)
  {
    StringBuilder sb = new StringBuilder();
    if(hasParent==null)
    	sb.append("<div id=\"div_"+this.getName()+"\" style=\"width: "+this.getWidth()+"; height: "+this.getHeight()+";\">\n");
    else if(hasParent)
    {
    	sb.append("<div id=\"div_"+this.getName()+"\" class=\"col-md-10\"");
    	sb.append(" style=\"padding-left:0px; padding-right:0px;");
    	sb.append(" width: "+this.getWidth()+"; height: "+this.getHeight()+";\">\n");
    }
    else
    {
    	sb.append("<div id=\"div_"+this.getName()+"\" class=\"row-md-10\"");
    	sb.append(" style=\"padding-left:0px; padding-right:0px;");
    	sb.append(" width: "+this.getWidth()+"; height: "+this.getHeight()+";\">\n");
    }
    sb.append("<ul");
    sb.append(" id = "+"\""+this.getName()+"\"");
    sb.append(">");

    StringTokenizer tokens = new StringTokenizer(this.getElementsFromString(), ",");
    while(tokens.hasMoreTokens())
    {
      sb.append("<li>");
      sb.append(tokens.nextToken());
      sb.append("</li>");
    }
    if(this.getVisible().equalsIgnoreCase("False"))
      sb.append(" hidden");

    sb.append("</ul>"); 
    sb.append("</div>");
    //System.out.println("HTML equivalent for button: "+sb.toString().valueOf(sb));
    return sb.toString().valueOf(sb);
  }

  public ParseResult getComponentString(Map<String,JSONValue> properties, Boolean hasParent)
  {
    ParseResult componentInfo = new ParseResult();
    for(String property:properties.keySet())
    {
      String value = properties.get(property).asString().getString();
      switch(property)
      {
      case "BackgroundColor": 
        StringBuilder color = new StringBuilder(value);
        color.replace(0, 4, "#");			    	 		
        this.setBackgroundColor(color.toString().valueOf(color));
        break;
      case "ElementsFromString":
        this.setElementsFromString(value);
        break;
      case "$Name":
        this.setName(value);
        break;
      case "$Type":
        this.setType(value);		
        break;
      case "TextColor":
        StringBuilder textColor = new StringBuilder(value);
        textColor.replace(0, 4, "#");			    	 		
        this.setTextColor(textColor.toString().valueOf(textColor));
        break;
      case "TextSize":
        this.setTextSize(value);
        break;
      case "Visible":
        this.setVisible(value);
        break;
      case "Width":
       if(value.equalsIgnoreCase("-2"))
          this.setWidth("100%");
        else if(value.charAt(0)=='-')
            this.setWidth(value.substring(2)+"%");
        else
          this.setWidth(value+"px");
        break;
      case "Height":
        if(value.equalsIgnoreCase("-2"))
          this.setHeight("100%");
        else if(value.charAt(0)=='-')
            this.setHeight(value.substring(2)+"%");
        else
          this.setHeight(value+"px");
        break;
      case "Selection":
        break;
      case "ShowFilterBar":
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
    componentInfo.bodyHtml.add(generateHTMLforComponent(hasParent));
    componentInfo.css.add(generateCSSforComponent(hasParent));

    return componentInfo;

  }	

}
