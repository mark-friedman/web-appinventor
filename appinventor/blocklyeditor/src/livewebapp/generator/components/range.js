

'use strict';

goog.provide('Blockly.RangeJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.RangeJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload();" +
        "}else {"+ "var div = document.createElement(\"div\");" +
            "var rangefield = document.createElement(\"input\");" +
            "rangefield.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "rangefield.setAttribute(\"type\", \"range\");" +
            "div.appendChild(rangefield);" +
            "document.body.appendChild(div);}";
};

Blockly.RangeJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.RangeJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){
        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.RangeJsGenerator.setProperties = function(component, propName, propValue) {
     switch(propName) {
         case "MaxValue":
             return "document.getElementById(\"" + component.$Name + "\").max = \"" + propValue + "px\";";
         case "MinValue":
             return "document.getElementById(\"" + component.$Name + "\").min = \"" + propValue + "px\";";
         case "ThumbPosition":
             return "document.getElementById(\"" + component.$Name + "\").value = \"" + propValue + "\";";
         case "Width":
             return this.getWidthSizeVal(propValue, component);
         case "Visible":
             return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";";
         case "ThumbEnabled":
             return "document.getElementById(\"" + component.$Name + "\").style.disabled = \"" +
                 this.getEnabled(propValue) + "\";";
         default:
             return "";
     }
    };


Blockly.RangeJsGenerator.getWidthSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"" + component.$Name + "\").style.width = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"" + component.$Name + "\").style.width = \"100%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\"";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"" + component.$Name + "\").style.width =\""+ index+"px\";";
    else
        return "document.getElementById(\"" + component.$Name + "\").style.width =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\"";
};


Blockly.RangeJsGenerator.getVisibility = function(index) {
    if (index == "True") {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.CheckBoxJsGenerator.getEnabled = function(index) {
    if (index == "True") {
        return "False";
    } else {
        return "True";
    }
};