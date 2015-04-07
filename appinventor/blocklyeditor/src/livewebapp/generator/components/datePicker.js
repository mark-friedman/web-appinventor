

'use strict';

goog.provide('Blockly.DatePickerJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.DatePickerJsGenerator.generateJSForAddingComponent = function(component){
                                  return   "var div = document.createElement(\"div\");" +
                                           "var datefield = document.createElement(\"input\");" +
                                           "datefield.setAttribute(\"id\",\"" + component.$Name + "\");" +
                                           "datefield.setAttribute(\"type\", \"date\");"+
                                            "var label = document.createElement(\"Label\");" +
                                        "label.setAttribute(\"htmlFor\",\"" + component.$Name + "\");" +
                                        "label.appendChild(document.createTextNode(\"" + component.Text + "\"));"+
                                        "div.appendChild(label);" +
                                           "div.appendChild(datefield);" +
                                           "document.body.appendChild(div);";
                              };

Blockly.DatePickerJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
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
               return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.fontWeight = \"normal\";";
             }else{
               return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.fontWeight = \"bold\";";
             }
         case "FontItalic":
             if(propValue == "False"){
               return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.fontStyle = \"normal\";";
             }else{
               return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.fontStyle = \"italic\";";
             }
         case "FontSize":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.fontSize = \"" +
             Math.round(propValue) +"pt\";";
         case "FontTypeface":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.fontFamily = \"" +
                    this.getFontType(propValue) + "\";";
         case "Text":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.textContent=\""
                 + propValue + "\";";
         case "TextColor":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.color = \"#" +
                    propValue.substring(4) + "\";";
         case "TextAlignment":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.textAlign = \"" +
                                  this.getTextAlignment(propValue) + "\";";
         case "Width":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.width = \""
                 + this.getSizeVal(propValue) + "\";";
         case "Height":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.height = \""
                 + this.getSizeVal(propValue) + "\";";
         case "BackgroundColor":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.backgroundColor = \"#" +
                 propValue.substring(4) + "\";";
         case "Image":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.backgroundImage = \"" + propValue + "\";";
         case "Shape":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.Shape = \"" +
                 this.getShape(propValue) + "\";";
         case "Visible":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.visibility = \"" +
                 this.getVisibility(propValue) + "\";"+
              "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";";
         case "Enabled":
             return "document.getElementById(\"" + component.$Name + "\").disabled = \"" +
                 this.getEnabled(propValue) + "\";";
         case "Image":
             return "document.getElementById(\"" + component.$Name + "\").previousElementSibling.style.backgroundImage = \"url(assets/" +
                 (propValue) + ")\";";
         default:
             return "";
     }
    };

Blockly.DatePickerJsGenerator.getSizeVal = function(index) {
    if(index == "Automatic")
        return "auto";
    else if(index == "Fill Parent")
        return "100%";
    else
        return index+"px";
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