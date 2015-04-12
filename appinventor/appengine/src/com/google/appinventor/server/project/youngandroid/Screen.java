package com.google.appinventor.server.project.youngandroid;

import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONValue;

/**
 * Button takes JSON string of Button component and return 
 * HTML and CSS equivalent for Button
 * Creation date: 03/13/15
 * 
 * @author veluru.k@husky.neu.edu (Veluru Kaushik)
 */

public class Screen extends ImageComponent{

  String backgroundColor = "";
  String backgroundImage = "";
  String textAlign = "left";
  String vertAlign="0%";
  String scrollable="";
  String name = "";
  String title= "";
  String type = "Form";



  public String getVertAlign() {
	return vertAlign;
}

public void setVertAlign(String vertAlign) {
	this.vertAlign = vertAlign;
}

public String getScrollable() {
	return scrollable;
}

public void setScrollable(String scrollable) {
	this.scrollable = scrollable;
}

public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
}

public String getBackgroundColor() {
    return backgroundColor;
  }

  public void setBackgroundColor(String backgroundColor) {
    this.backgroundColor  =  backgroundColor;
  }


  public String getBackgroundImage() {
    return backgroundImage;
  }

  public void setBackgroundImage(String image) {
    this.backgroundImage  =  image;
  }



  public String getTextAlign() {
    return textAlign;
  }

  public void setTextAlign(String textAlign) {
    this.textAlign  =  textAlign;
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
    
    sb.append(" background-image : url("+this.getPrefixedSrc(this.getBackgroundImage())+");\n");
    sb.append(" text-align : "+this.getTextAlign()+";\n");
    sb.append(" position : absolute;\n");
    sb.append(" top : "+this.getVertAlign()+";\n");
      
    sb.append("}\n");

    return sb.toString().valueOf(sb);
  }

  private String generateHTMLforComponent()
  {
    StringBuilder sb = new StringBuilder();
    sb.append("<body");
    sb.append(" id = "+"\""+this.getName()+"\"");
    sb.append(">");


    return sb.toString().valueOf(sb);
  }

  public String[] getComponentString(Map<String,JSONValue> properties)
  {
    String componentInfo[] = new String[3];
    for(String property:properties.keySet())
    {
      if(!property.equals("$Components")){
      String value = properties.get(property).asString().getString();
      switch(property)
      {
      case "BackgroundColor": 
        StringBuilder color = new StringBuilder(value);
        color.replace(0, 4, "#");			    	 		
        this.setBackgroundColor(color.toString().valueOf(color));
        break;
      case "AlignHorizontal":
        if(value.equals("0"))
          this.setTextAlign("left");
        if(value.equals("1"))
          this.setTextAlign("center");
        if(value.equals("2"))
          this.setTextAlign("right");
        break;
      case "AlignVertical":
          if(value.equals("0"))
              this.setVertAlign("0%");
          if(value.equals("1"))
              this.setVertAlign("50%");
          if(value.equals("2"))
              this.setVertAlign("100%");
          break;
      case "BackgroundImage":
          this.setBackgroundImage(value);
          break;
      case "AboutScreen":
    	  break;
      case "AppName":
    	  break;
      case "Scrollable":
    	  break;
      case "OpenScreenAnimation":
    	  break;
      case "CloseScreenAnimation":
    	  break;
      case "Icon":
    	  break;
      case "ScreenOrientation":
    	  break;
      case "$Name":
        this.setName(value);
        break;
      case "Title":
          this.setTitle(value);
          break;
      case "$Type":
        this.setType(value);		
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
    componentInfo[0] = "";//generateHTMLforComponent();
    componentInfo[1] = generateCSSforComponent();
    componentInfo[2] = this.getPrefixedSrc(this.getBackgroundImage()); 
    return componentInfo;

  }


}