package com.google.appinventor.server.project.youngandroid;

import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONValue;


public class Player extends SourceComponent{

  public Player(String assetPrefix) {
    super(assetPrefix);
  }

  String loop = "false";
  String source = "";
  String volume = "0";

  String name = "";
  String type = "Player";
  public String getLoop() {
    return loop;
  }
  public void setLoop(String loop) {
    this.loop = loop;
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
    return "";
  }

  private String generateHTMLforComponent(Boolean hasParent)
  {
    StringBuilder sb = new StringBuilder();
    sb.append("<div id=\"div_"+this.getName()+"\" >");
    sb.append("<audio");
    sb.append(" id = "+"\""+this.getName()+"\"");
    sb.append(" type = "+"\""+this.getType()+"\"");
    sb.append(" src = "+"\""+this.getPrefixedSrc(this.getSource())+"\"");
    if(this.getLoop().equalsIgnoreCase("True"))
      sb.append(" loop");
    sb.append(">");
    sb.append("Your browser does not support HTML5 audio.");
    sb.append("</audio>");
    sb.append("</div>");
    return sb.toString().valueOf(sb);
  }

  public ParseResult getComponentString(Map<String,JSONValue> properties,Boolean hasParent)
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
      case "Loop":
        this.setLoop(value);
        break;
      case "Source":
        this.setSource(value);
        break;
      case "Volume":
        this.setVolume(value);
        break;
      case "PlayOnlyInForeground":
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
    componentInfo.css.add(generateCSSforComponent());
    componentInfo.assetFiles.add(this.getPrefixedSrc(this.getSource())); 
    return componentInfo;

  }



}
