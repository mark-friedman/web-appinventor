package com.google.appinventor.server.project.youngandroid;

import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONValue;

/**
 * TextBox takes JSON string of TextBox component and return 
 * HTML and CSS equivalent for TextBox
 * Creation date: 03/13/15
 * 
 * @author veluru.k@husky.neu.edu (Veluru Kaushik)
 */


public class TextBox extends Component{

  String backgroundColor = "";
  String fontSize = "14";
  String fontBold = "none";
  String fontItalic = "none";
  String enabled = "true";
  String fontTypeface = "sans-serif";
  String text = "";
  String textAlign = "left";
  String textColor = "#000000";
  String visible = "true";
  String width = "160px";
  String height = "auto";	
  String hint = "hint";
  String multiline = "false";
  String numbersOnly = "false";

  String name = "";
  String type = "TextBox";
  
  public String getNumbersOnly() {
    return numbersOnly;
  }
  public void setNumbersOnly(String numbersOnly) {
    this.numbersOnly = numbersOnly;
  }
  public String getBackgroundColor() {
    return backgroundColor;
  }
  public void setBackgroundColor(String backgroundColor) {
    this.backgroundColor  =  backgroundColor;
  }
  public String getFontSize() {
    return fontSize;
  }
  public void setFontSize(String fontSize) {
    this.fontSize  =  fontSize;
  }
  public String getFontBold() {
    return fontBold;
  }
  public void setFontBold(String fontBold) {
    this.fontBold  =  fontBold;
  }
  public String getFontItalic() {
    return fontItalic;
  }
  public void setFontItalic(String fontItalic) {
    this.fontItalic  =  fontItalic;
  }
  public String getEnabled() {
    return enabled;
  }
  public void setEnabled(String enabled) {
    this.enabled  =  enabled;
  }
  public String getFontTypeface() {
    return fontTypeface;
  }
  public void setFontTypeface(String fontTypeface) {
    this.fontTypeface  =  fontTypeface;
  }
  public String getText() {
    return text;
  }
  public void setText(String text) {
    this.text  =  text;
  }
  public String getTextAlign() {
    return textAlign;
  }
  public void setTextAlign(String textAlign) {
    this.textAlign  =  textAlign;
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
  public String getHint() {
    return hint;
  }
  public void setHint(String hint) {
    this.hint  =  hint;
  }
  public String getMultiline() {
    return multiline;
  }
  public void setMultiline(String multiline) {
    this.multiline  =  multiline;
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
    sb.append(" font-size : "+this.getFontSize()+"px;\n");
    sb.append(" font-weight : "+this.getFontBold()+";\n");
    sb.append(" font-style : "+this.getFontItalic()+";\n");
    sb.append(" font-family : "+this.getFontTypeface()+";\n");
    sb.append(" text-align : "+this.getTextAlign()+";\n");
    sb.append(" color : "+this.getTextColor()+";\n");
    //sb.append(" width : "+this.getWidth()+";\n");
    //sb.append(" height : "+this.getHeight()+";\n");

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
    if(this.getMultiline().equalsIgnoreCase("True"))
      sb.append("<textarea");
    else
      sb.append("<input"); 

    sb.append(" class=\"default-component-size\" id = "+"\""+this.getName()+"\"");
    sb.append(" type = "+"\""+"text"+"\"");

    if(this.getEnabled().equals("False"))
      sb.append(" disabled");
    if(this.getVisible().equals("False"))
      sb.append(" hidden");

    sb.append(" title =  "+"\""+this.getHint()+"\"");
    sb.append(" value =  "+"\""+this.getText()+"\"");
    sb.append(">");
    if(this.getMultiline().equalsIgnoreCase("True"))
      sb.append("</textarea>");
    else
      sb.append("</input>"); 
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
      case "FontSize":
        this.setFontSize(value);
        break;
      case "FontBold":
        if(value.equalsIgnoreCase("True"))
          this.setFontBold("bold");
        break;
      case "FontItalic":
        if(value.equalsIgnoreCase("True"))
          this.setFontItalic("italic");
        break;
      case "FontTypeface":
        if(value.equals("0")||value.equals("1"))
          this.setFontTypeface("sans-serif");
        else if(value.equals("2"))
          this.setFontTypeface("serif");
        else 
          this.setFontTypeface("monospace");
        break;
      case "$Name":
        this.setName(value);
        break;
      case "Text":
        this.setText(value);
        break;
      case "TextAlignment":
        if(value.equals("0"))
          this.setTextAlign("left");  
        if(value.equals("1"))
          this.setTextAlign("center");
        if(value.equals("2"))
          this.setTextAlign("right"); 
        break;
      case "$Type":
        this.setType(value);		
        break;
      case "TextColor":
        StringBuilder textColor = new StringBuilder(value);
        textColor.replace(0, 4, "#");			    	 		
        this.setTextColor(textColor.toString().valueOf(textColor));
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
      case "Hint":
        this.setHint(value);
        break;
      case "MultiLine":
        this.setMultiline(value);
        break;
      case "Enabled":
        this.setEnabled(value);		 
        break;
      case "NumbersOnly":
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
