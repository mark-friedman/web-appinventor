package com.google.appinventor.server.project.youngandroid;

import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONValue;

public class VideoPlayer extends SourceComponent{

  public VideoPlayer(String assetPrefix) {
    super(assetPrefix);
 }

  String visible = "true";
  String source = "";
  String volume = "0";
  String width = "auto";
  String height = "auto";
  
  String name = "";
  String type = "VideoPlayer";
  public String getVisible() {
    return visible;
  }
  public void setVisible(String visible) {
    this.visible = visible;
  }
  public String getSource() {
    return source;
  }
  public void setSource(String source) {
    this.source = source;
  }
  public String getVolume() {
    return volume;
  }
  public void setVolume(String volume) {
    this.volume = volume;
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
    sb.append(" height : "+this.getHeight()+";\n");
    sb.append("}\n");

    // System.out.println(sb.toString().valueOf(sb));

    return sb.toString().valueOf(sb);
  }

  private String generateHTMLforComponent()
  {
    StringBuilder sb = new StringBuilder();
    sb.append("<div>");
    sb.append("<video controls");
    sb.append(" id = "+"\""+this.getName()+"\"");
    sb.append(" src = "+"\""+this.getPrefixedSrc(this.getSource())+"\"");

    if(this.getVisible().equalsIgnoreCase("False"))
      sb.append(" hidden");
    
    sb.append(">");
    sb.append("Your browser does not support HTML5 video.");
    sb.append("</video>");
    sb.append("</div>");
    return sb.toString().valueOf(sb);
  }

  public ParseResult getComponentString(Map<String,JSONValue> properties)
  {
    ParseResult componentInfo = new ParseResult();
    for(String property:properties.keySet())
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
      case "Source":
        this.setSource(value);
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
      case "Volume":
        this.setVolume(value);
        break;
      case "Visible":
        this.setVisible(value);
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
    componentInfo.bodyHtml.add(generateHTMLforComponent());
    componentInfo.css.add(generateCSSforComponent());
    componentInfo.assetFiles.add(this.getPrefixedSrc(this.getSource())); 
    return componentInfo;

  }
  
}
