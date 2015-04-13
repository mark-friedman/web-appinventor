package com.google.appinventor.server.project.youngandroid;

import java.util.Map;
import com.google.appinventor.shared.properties.json.JSONValue;


public class Slider extends Component{

  String maxValue = "300";
  String minValue = "100";
  String thumbEnabled = "True";
  String thumbPosition = "150";
  String visible = "true";
  String width = "auto";
  
  String name = "";
  String type = "Slider";
  
  
  public String getThumbEnabled() {
    return thumbEnabled;
  }
  public void setThumbEnabled(String thumbEnabled) {
    this.thumbEnabled = thumbEnabled;
  }
  public String getMaxValue() {
    return maxValue;
  }
  public void setMaxValue(String maxValue) {
    this.maxValue = maxValue;
  }
  public String getMinValue() {
    return minValue;
  }
  public void setMinValue(String minValue) {
    this.minValue = minValue;
  }
  public String getThumbPosition() {
    return thumbPosition;
  }
  public void setThumbPosition(String thumbPosition) {
    this.thumbPosition = thumbPosition;
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

  private String generateCSSforComponent()
  {
    StringBuilder sb = new StringBuilder();
    sb.append("#"+this.getName()+"\n");
    sb.append("{\n");
    sb.append(" width : "+this.getWidth()+";\n");
    sb.append("}\n");

    // System.out.println(sb.toString().valueOf(sb));

    return sb.toString().valueOf(sb);
  }

  private String generateHTMLforComponent()
  {
    StringBuilder sb = new StringBuilder();

    sb.append("<input"); 

    sb.append(" id = "+"\""+this.getName()+"\"");
    sb.append(" type = \"range\"");

    if(this.getVisible().equalsIgnoreCase("False"))
      sb.append(" hidden");
    
    if(!this.getThumbEnabled().equalsIgnoreCase("true"))
      sb.append(" disabled");
    
    sb.append(" min = "+this.getMinValue());
    sb.append(" max = "+this.getMaxValue());
    sb.append(" value = "+this.getThumbPosition());
    sb.append(">");
    sb.append("</input>"); 

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
      case "MaxValue":
        this.setMaxValue(value);
        break;
      case "MinValue":
        this.setMinValue(value);
        break;
      case "ThumbEnabled":
        this.setThumbEnabled(value);
        break;
      case "ThumbPosition":
        this.setThumbPosition(value);
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
      case "$Type":
        this.setType(value);
        break;
      case "$Name":
        this.setName(value);
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
