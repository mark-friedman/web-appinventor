package com.google.appinventor.server.project.youngandroid;

import java.util.Map;

import com.google.appinventor.shared.properties.json.JSONValue;

/**
 * Screen takes JSON string for the whole String and returns 
 * HTML and CSS equivalent for whole page
 * Creation date: 04/09/15
 * 
 * @author vaka.s@husky.neu.edu (Sudeep Vaka)
 */

public class Screen extends ImageComponent{

  String backgroundColor = "";
  String backgroundImage = "";
  String horizontalAlign = "left";
  String verticalAlign = "0%";
  String scrollable = "";
  String name = "";
  String title = "";
  String type = "Form";



  public String getVerticalAlign() {
	return verticalAlign;
}

public void setVerticalAlign(String verticalAlign) {
	this.verticalAlign = verticalAlign;
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



  public String getHorizontalAlign() {
    return horizontalAlign;
  }

  public void setHorizontalAlign(String horizontalAlign) {
    this.horizontalAlign  =  horizontalAlign;
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
    if(!this.getBackgroundColor().equals("")){
      sb.append(" background : "+this.getBackgroundColor()+";\n");
    }
    sb.append(" background-size : cover;\n");
    sb.append(" background-image : url(assets/"+this.getPrefixedSrc(this.getBackgroundImage())+");\n");
    //sb.append(" position : absolute;\n");
    sb.append(" text-align : "+this.getHorizontalAlign()+";\n");
    sb.append(" top : "+this.getVerticalAlign()+";\n");//Will not work for now!
      
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