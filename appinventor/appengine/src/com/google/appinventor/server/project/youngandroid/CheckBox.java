package com.google.appinventor.server.project.youngandroid;

import java.util.Map;
import com.google.appinventor.shared.properties.json.JSONValue;

/**
 * CheckBox takes JSON string of CheckBox component and return 
 * HTML and CSS equivalent for CheckBox
 * Creation date: 03/13/15
 * 
 * @author veluru.k@husky.neu.edu (Veluru Kaushik)
 */

public class CheckBox extends Component{

  String backgroundColor = "";
  String checked = "false";
  String fontSize = "14";
  String fontBold = "none";
  String fontItalic = "none";
  String enabled = "true";
  String fontTypeface = "sans-serif";
  String text = "";
  String textColor = "#000000";
  String visible = "true";
  String width = "auto";
  String height = "auto";	

  String name = "";
  String type = "CheckBox";


  public String getBackgroundColor() {
    return backgroundColor;
  }
  public void setBackgroundColor(String backgroundColor) {
    this.backgroundColor  =  backgroundColor;
  }
  public String getChecked() {
    return checked;
  }
  public void setChecked(String checked) {
    this.checked  =  checked;
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
	{
      sb.append(" background : "+this.getBackgroundColor()+";\n");
	}
     
    sb.append(" font-size : "+this.getFontSize()+"px;\n");
    sb.append(" font-weight : "+this.getFontBold()+";\n");
    sb.append(" font-style : "+this.getFontItalic()+";\n");
    sb.append(" font-family : "+this.getFontTypeface()+";\n");
    sb.append(" color : "+this.getTextColor()+";\n");
    sb.append(" width : "+this.getWidth()+";\n");
    sb.append(" height : "+this.getHeight()+";\n");

    sb.append("}\n");
    
    sb.append("label[for="+this.getName()+"]\n");
    sb.append("{\n");

    if(!this.getBackgroundColor().equals(""))
    {
      sb.append(" background : "+this.getBackgroundColor()+";\n");
    }
     
    sb.append(" font-size : "+this.getFontSize()+"px;\n");
    sb.append(" font-weight : "+this.getFontBold()+";\n");
    sb.append(" font-style : "+this.getFontItalic()+";\n");
    sb.append(" font-family : "+this.getFontTypeface()+";\n");
    sb.append(" color : "+this.getTextColor()+";\n");
    sb.append(" width : "+this.getWidth()+";\n");
    sb.append(" height : "+this.getHeight()+";\n");

    sb.append("}\n");
    
    
    

    // System.out.println(sb.toString().valueOf(sb));

    return sb.toString().valueOf(sb);
  }

  private String generateHTMLforComponent()
  {
    StringBuilder sb = new StringBuilder();
    sb.append("<input"); 
    sb.append(" id = "+"\""+this.getName()+"\"");
    sb.append(" type = \"checkbox\"");

    if(this.getChecked().equals("True"))
      sb.append(" checked");
    if(this.getEnabled().equals("False"))
      sb.append(" disabled");
    if(this.getVisible().equals("False"))
      sb.append(" hidden");

    sb.append(">");
    
    sb.append("<label");
    sb.append(" for=\""+this.getName()+"\"");
    sb.append(">");
    sb.append(this.getText());
    sb.append("</label>");
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
      case "BackgroundColor":
        StringBuilder color = new StringBuilder(value);
        color.replace(0, 4, "#");			    	 		
        this.setBackgroundColor(color.toString().valueOf(color));
        break;
      case "Checked":
        this.setChecked(value);
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
        if(value.equals("1")||value.equals("2"))
          this.setFontTypeface("sans-serif");
        else if(value.equals("3"))
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
      case "Enabled":
        this.setEnabled(value);
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
