

'use strict';

goog.provide('Blockly.TimePickerJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.TimePickerJsGenerator.generateJSForAddingComponent = function(component){
                                  return   "var div = document.createElement(\"div\");" +
                                           "var timefield = document.createElement(\"input\");" +
                                           "timefield.setAttribute(\"id\",\"" + component.$Name + "\");" +
                                           "timefield.setAttribute(\"type\", \"time\");"+
                                            "var label = document.createElement(\"Label\");" +
                                            "label.setAttribute(\"htmlFor\",\"" + component.$Name + "\");" +
                                      "label.appendChild(document.createTextNode(\"" + component.Text + "\"));"+
                                      "div.appendChild(label);" +
                                           "div.appendChild(timefield);" +
                                           "document.body.appendChild(div);";
                              };

Blockly.TimePickerJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.TimePickerJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){
        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.TimePickerJsGenerator.setProperties = function(component, propName, propValue) {
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
             Math.round(propValue) +"pt\";";
         case "FontTypeface":
             return "document.getElementById(\"" + component.$Name + "\").style.fontFamily = \"" +
                    this.getFontType(propValue) + "\";";
         case "Text":
             return "";
             //return "document.getElementById(\"" + component.$Name + "\").innerHTML = \"" + propValue + "\";";
         case "TextColor":
             return "document.getElementById(\"" + component.$Name + "\").style.color = \"#" +
                    propValue.substring(4) + "\";";
         case "TextAlignment":
             return "document.getElementById(\"" + component.$Name + "\").style.textAlign = \"" +
                                  this.getTextAlignment(propValue) + "\";";
         case "Width":
             return "document.getElementById(\"" + component.$Name + "\").style.width = \"" + propValue + "px\";";
         case "Height":
             return "document.getElementById(\"" + component.$Name + "\").style.height = \"" + propValue + "px\";";
         case "BackgroundColor":
             return "document.getElementById(\"" + component.$Name + "\").style.backgroundColor = \"" +
                 this.getColor(propValue) + "\";";
         case "Image":
             return "document.getElementById(\"" + component.$Name + "\").style.backgroundImage = \"" + propValue + "\";";
         case "Shape":
             return "document.getElementById(\"" + component.$Name + "\").style.Shape = \"" +
                 this.getShape(propValue) + "\";";
         case "Visible":
             return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";";
         case "Enabled":
             return "document.getElementById(\"" + component.$Name + "\").style.disabled = \"" +
                 this.getEnabled(propValue) + "\";";
         default:
             return "";
     }
    };

Blockly.TimePickerJsGenerator.getColor = function(index) {
    return index.replace(0, 4, "#");
};

Blockly.TimePickerJsGenerator.getVisibility = function(index) {
    if (index == "True") {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.TimePickerJsGenerator.getEnabled = function(index) {
    if (index == "True") {
       return "False";
    } else {
        return "True";
    }
};

Blockly.TimePickerJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
};

Blockly.TimePickerJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
};

Blockly.TimePickerJsGenerator.getShape = function(index) {
    switch(index) {
        case "0":
        case "2":
            return "default";
        case "1": return "rounded";
        default:  return "oval";
    }
};