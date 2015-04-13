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
  String width = "auto";
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

  private String generateCSSforComponent()
  {
    StringBuilder sb = new StringBuilder();
    sb.append("#"+this.getName()+"\n");
    sb.append("{\n");

    if(!this.getBackgroundColor().equals(""))
      sb.append(" background : "+this.getBackgroundColor()+";\n");
    sb.append(" font-size :"+this.getTextSize()+"px;\n");
    sb.append(" color : "+this.getTextColor()+";\n");
    sb.append(" width : "+this.getWidth()+";\n");
    sb.append(" height : "+this.getHeight()+";\n");
    sb.append("}\n");



    return sb.toString().valueOf(sb);
  }

  private String generateHTMLforComponent()
  {
    StringBuilder sb = new StringBuilder();

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

    //System.out.println("HTML equivalent for button: "+sb.toString().valueOf(sb));
    return sb.toString().valueOf(sb);
  }

  public String[] getComponentString(Map<String,JSONValue> properties)
  {
    String componentInfo[] = new String[3];
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
        if(value.equalsIgnoreCase("Automatic"))
          this.setWidth("auto");
        else if(value.equalsIgnoreCase("Fill Parent"))
          this.setWidth("100%");
        else if(value.charAt(0)=='-')
            this.setWidth(value.substring(2)+"%");
        else
          this.setWidth(value+"px");
        break;
      case "Height":
        if(value.equalsIgnoreCase("Automatic"))
          this.setHeight("auto");
        else if(value.equalsIgnoreCase("Fill Parent"))
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
    componentInfo[0] = generateHTMLforComponent();
    componentInfo[1] = generateCSSforComponent();
    componentInfo[2] = null;

    return componentInfo;

  }	

}
