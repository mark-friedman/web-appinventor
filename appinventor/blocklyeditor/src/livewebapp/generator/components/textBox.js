

'use strict';

goog.provide('Blockly.TextBoxJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.TextBoxJsGenerator.generateJSForAddingComponent = function(component){
                                  return      "var div = document.createElement(\"div\");" +
                                      "var txt = document.createElement(\"input\");" +
                                      "txt.setAttribute(\"id\",\"" + component.$Name + "\");" +
                                      "div.appendChild(txt);" +
                                      "document.body.appendChild(div);";
                              };


Blockly.TextBoxJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.TextBoxJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.TextBoxJsGenerator.setProperties = function(component, propName, propValue) {
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
             return "document.getElementById(\"" + component.$Name + "\").innerHTML = \"" + propValue + "\";";
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
         case "Hint":
             return "document.getElementById(\"" + component.$Name + "\").style.title = \"" + propValue + "\";";
         case "MultiLine":
             if(propValue.equals("True"))
             return "document.getElementById(\"" + component.$Name + "\").style.rows = \"4\";"
                 + "document.getElementById(\"" + component.$Name + "\").style.cols = \" +50\";";
         default:
             return "";
     }
    };

Blockly.TextBoxJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
    };

Blockly.TextBoxJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
    };

