

'use strict';

goog.provide('Blockly.DatePickerJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.DatePickerJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload();" +
        "}else {"+
         "var div = document.createElement(\"div\");" +
        "div.setAttribute(\"id\",\"div_" + component.$Name + "\");" +
            "var datefield = document.createElement(\"input\");" +
            "datefield.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "datefield.setAttribute(\"type\", \"date\");" +
            "var label = document.createElement(\"Label\");" +
            "label.setAttribute(\"htmlFor\",\"" + component.$Name + "\");" +
            "label.appendChild(document.createTextNode(\"" + component.Text + "\"));" +
            "div.appendChild(label);" +
            "div.appendChild(datefield);" +
            "document.body.appendChild(div);}"+
        "document.getElementById(\"div_"+ component.$Name + "\").style.cssFloat = \"left\"";
    };

Blockly.DatePickerJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var previous =document.getElementById(\"" + component.$Name + "\").previousElementSibling;"+
            "previous.remove();"+
                "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.DatePickerJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){
        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.DatePickerJsGenerator.setProperties = function(component, propName, propValue) {
     switch(propName) {
         case "FontBold":
             if(propValue == "False"){
               return "document.getElementById(\"div_" + component.$Name + "\").style.fontWeight = \"normal\";";
             }else{
               return "document.getElementById(\"div_" + component.$Name + "\").style.fontWeight = \"bold\";";
             }
         case "FontItalic":
             if(propValue == "False"){
               return "document.getElementById(\"div_" + component.$Name + "\").style.fontStyle = \"normal\";";
             }else{
               return "document.getElementById(\"div_" + component.$Name + "\").style.fontStyle = \"italic\";";
             }
         case "FontSize":
             return "document.getElementById(\"div_" + component.$Name + "\").style.fontSize = \"" +
             Math.round(propValue) +"pt\";";
         case "FontTypeface":
             return "document.getElementById(\"div_" + component.$Name + "\").style.fontFamily = \"" +
                    this.getFontType(propValue) + "\";";
         case "Text":
             return "document.getElementById(\"div_" + component.$Name + "\").textContent=\""
                 + propValue + "\";";
         case "TextColor":
             return "document.getElementById(\"div_" + component.$Name + "\").style.color = \"#" +
                    propValue.substring(4) + "\";";
         case "TextAlignment":
             return "document.getElementById(\"div_" + component.$Name + "\").style.textAlign = \"" +
                                  this.getTextAlignment(propValue) + "\";";
         case "Width":
             return this.getWidthSizeVal(propValue, component);
         case "Height":
             return this.getHeightSizeVal(propValue, component);
         case "BackgroundColor":
             return "document.getElementById(\"div_" + component.$Name + "\").style.backgroundColor = \"#" +
                 propValue.substring(4) + "\";";
         case "Shape":
             return "document.getElementById(\"div_" + component.$Name + "\").style.Shape = \"" +
                 this.getShape(propValue) + "\";";
         case "Visible":
             return "document.getElementById(\"div_" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";"+
              "document.getElementById(\"div_" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";";
         case "Enabled":
             return "document.getElementById(\"div_" + component.$Name + "\").disabled = \"" +
                 this.getEnabled(propValue) + "\";";
         case "Image":
             return "document.getElementById(\"div_" + component.$Name + "\").style.backgroundImage = \"url(assets/" +
                 (propValue) + ")\";";
         default:
             return "";
     }
    };

Blockly.DatePickerJsGenerator.getWidthSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"div_" + component.$Name + "\").style.width = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"div_" + component.$Name + "\").style.width = \"100%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"div_" + component.$Name + "\").style.width =\""+ index+"px\";";
    else
        return "document.getElementById(\"div_" + component.$Name + "\").style.width =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
};

Blockly.DatePickerJsGenerator.getHeightSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"div_" + component.$Name + "\").style.height = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"div_" + component.$Name + "\").style.height = \"100%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"div_" + component.$Name + "\").style.height =\""+ index+"px\";";
    else
        return "document.getElementById(\"div_" + component.$Name + "\").style.height =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
};


Blockly.DatePickerJsGenerator.getVisibility = function(index) {
    if (index == "True") {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.DatePickerJsGenerator.getEnabled = function(index) {
    if (index == "True") {
       return "False";
    } else {
        return "True";
    }
};

Blockly.DatePickerJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
};

Blockly.DatePickerJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
};

Blockly.DatePickerJsGenerator.getShape = function(index) {
    switch(index) {
        case "0":
        case "2":
            return "default";
        case "1": return "rounded";
        default:  return "oval";
    }
};