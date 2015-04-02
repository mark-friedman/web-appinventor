

'use strict';

goog.provide('Blockly.ImageJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.ImageJsGenerator.generateJSForAddingComponent = function(component){
    return     "var div = document.createElement(\"div\");" +
                "var img = document.createElement(\"img\");" +
                "img.setAttribute(\"id\",\"" + component.$Name + "\");" +
                "div.appendChild(img);"+
                "document.body.appendChild(div);";
};


Blockly.ImageJsGenerator.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\"" + component.$Name + "\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}";
};

Blockly.ImageJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End


Blockly.ImageJsGenerator.setProperties = function(component, propName, propValue) {
    switch(propName) {

        case "Width":
            return "document.getElementById(\"" + component.$Name + "\").style.width = \"" + propValue + "px\";";
        case "Height":
            return "document.getElementById(\"" + component.$Name + "\").style.height = \"" + propValue + "px\";";
        case "Visible":
            return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Picture":
            return this.getAddImageJS(component.$Name, propValue);
        default:
            return "";
    }
};


Blockly.ImageJsGenerator.getAddImageJS = function(componentName, propVal) {
    return "var imageID=document.getElementById(\""+componentName+"\");"+
        "imageID.src = \"assets/" + (propVal) + "\";";
};

Blockly.ImageJsGenerator.getVisibility = function(index) {
    if (index == "True" ) {
        return "";
    } else {
        return "hidden";
    }
};
