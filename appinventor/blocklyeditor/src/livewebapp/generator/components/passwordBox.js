

'use strict';

goog.provide('Blockly.PasswordBoxJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.PasswordBoxJsGenerator.generateJSForAddingComponent = function(component){
                                  return     "var div = document.createElement(\"div\");" +
                                      "var passwrd = document.createElement(\"input\");" +
                                      "passwrd.setAttribute(\"type\",\"password\");" +
                                      "passwrd.setAttribute(\"id\",\"" + component.$Name + "\");" +
                                      "div.appendChild(passwrd);" +
                                      "document.body.appendChild(div);";
                              };



Blockly.PasswordBoxJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.PasswordBoxJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.PasswordBoxJsGenerator.setProperties = function(component, propName, propValue) {
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
         default:
             return "";
     }
    };

Blockly.PasswordBoxJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
    };

Blockly.PasswordBoxJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
    };

