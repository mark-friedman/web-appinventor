package com.google.appinventor.server.project.youngandroid;

import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONValue;

/**
 * Image takes JSON string of Image component and return 
 * HTML and CSS equivalent for Image
 * Creation date: 03/13/15
 * 
 * @author veluru.k@husky.neu.edu (Veluru Kaushik)
 */
public class Image extends ImageComponent{

  public Image(String assetPrefix) {
    super(assetPrefix);
  }

  String source = "";
  String visible = "true";
  String width = "auto";
  String height = "auto";

  String type = "Image";
  String name = "";
  
  public String getSource() {
    return source;
  }
  public void setSource(String source) {
    this.source = source;
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
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  private String generateCSSforComponent(Boolean hasParent)
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
    sb.append("<img");
    sb.append(" id = "+"\""+this.getName()+"\"");
    sb.append(" src = "+"\""+this.getPrefixedSrc(this.getSource())+"\"");
  

    if(this.getVisible().equals("False"))
      sb.append(" hidden");

    sb.append(">");

    sb.append("</img>"); 
    sb.append("</div>");
    //System.out.println("HTML equivalent for button: "+sb.toString().valueOf(sb));
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
      case "Picture":
        this.setSource(value);
        break;
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
    componentInfo.assetFiles.add(this.getPrefixedSrc(this.getSource())); 

    return componentInfo;

  }
}
