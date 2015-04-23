

'use strict';

goog.provide('Blockly.LabelJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.LabelJsGenerator.generateJSForAddingComponent = function(component){
	if(component.Changed == "true"){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload(true);" +
        "}else {"+
        "var div = document.createElement(\"div\");" +
        "var btn = document.createElement(\"Lable\");" +
        "btn.setAttribute(\"id\",\"" + component.$Name + "\");" +
        "var txt = document.createTextNode(\"" + component.Text + "\");" +
        "btn.appendChild(txt);" +
        "div.appendChild(btn);" +
        "document.body.appendChild(div);"+
        "}"+
        this.getWidthSizeVal("-1", component) +  this.getHeightSizeVal("-1", component)+
     this.getBorder(component, "True");
	}
};



Blockly.LabelJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.LabelJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.LabelJsGenerator.setProperties = function(component, propName, propValue) {
     switch(propName) {
         case "FontBold":
             if(propValue == "False"){
               return "document.getElementById(\"" + component.$Name + "\").style.fontWeight = \"normal\";";
             }else{
               return "document.getElementById(\"" + component.$Name + "\").style.fontWeight = \"bold\";";
             }
         case "FontItalic":
             if(propValue == "False"){
               return "document.getElementById(\"" + component.$Name + "\").style.fontStyle = \"normal\";";
             }else{
               return "document.getElementById(\"" + component.$Name + "\").style.fontStyle = \"italic\";";
             }
         case "FontSize":
             return "document.getElementById(\"" + component.$Name + "\").style.fontSize = \"" +
             Math.round(propValue) +"px\";";
         case "FontTypeface":
             return "document.getElementById(\"" + component.$Name + "\").style.fontFamily = \"" +
                   this.getFontType(propValue) + "\";";
         case "Text":
             return "document.getElementById(\"" + component.$Name + "\").innerHTML = \"" + propValue + "\";";
         case "TextColor":
             return "document.getElementById(\"" + component.$Name + "\").style.color = \"#" +
                    propValue.substring(4) + "\";";
         case "TextAlignment":
             return "document.getElementById(\"" + component.$Name + "\").style.textAlign = \"" +
                                  this.getTextAlignment(propValue) + "\";";
         case "Width":
             return this.getWidthSizeVal(propValue, component);
         case "Height":
             return this.getHeightSizeVal(propValue, component);
         case "BackgroundColor":
             return "document.getElementById(\"" + component.$Name + "\").style.backgroundColor = \"#" +
                 propValue.substring(4) + "\";";
         case "Image":
             return "document.getElementById(\"" + component.$Name + "\").style.backgroundImage = \"" + propValue + "\";";
         case "Shape":
             return "document.getElementById(\"" + component.$Name + "\").style.Shape = \"" +
                 this.getShape(propValue) + "\";";
         case "Visible":
             return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";";
         case "Enabled":
             return "document.getElementById(\"" + component.$Name + "\").disabled = \"" +
                 this.getVisibility(propValue) + "\";";
         case "HasMargins":
             return this.getBorder(component, propValue);
         default:
             return "";
     }
    };

Blockly.LabelJsGenerator.getBorder = function(component, propValue) {
    if (propValue == "False") {
        return "document.getElementById(\"" + component.$Name + "\").style.margin = \"none\";";
    } else {
        return "document.getElementById(\"" + component.$Name + "\").style.margin = \"1px\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"inline-block\";";
    }
};

Blockly.LabelJsGenerator.getWidthSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"" + component.$Name + "\").style.width = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"" + component.$Name + "\").style.width = \"100%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"" + component.$Name + "\").style.width =\""+ index+"px\";";
    else
        return "document.getElementById(\"" + component.$Name + "\").style.width =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
};

Blockly.LabelJsGenerator.getHeightSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"" + component.$Name + "\").style.height = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"" + component.$Name + "\").style.height = \"100%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"" + component.$Name + "\").style.height =\""+ index+"px\";";
    else
        return "document.getElementById(\"" + component.$Name + "\").style.height =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
};

Blockly.LabelJsGenerator.getMargins = function(index) {
    if (index == "True") {
        return "solid 1px";
    }else{
        return "";
    }
};

Blockly.LabelJsGenerator.getVisibility = function(index) {
    if (index == "True") {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.LabelJsGenerator.getEnabled = function(index) {
    if (index == "True") {
       return "False";
    } else {
        return "True";
    }
};

Blockly.LabelJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
    };

Blockly.LabelJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
    };

Blockly.LabelJsGenerator.getShape = function(index) {
    switch(index) {
        case "0":
        case "2":
            return "default";
        case "1": return "rounded";
        default:  return "oval";
    }
};