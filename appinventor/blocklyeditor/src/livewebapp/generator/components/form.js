

'use strict';

goog.provide('Blockly.FormJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.FormJsGenerator.generateJSForAddingComponent = function(component){
    return  "";
};


Blockly.FormJsGenerator.generateJSForRemovingComponent = function(component){
    return  "";
};

Blockly.FormJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End


Blockly.FormJsGenerator.setProperties = function(component, propName, propValue) {
    switch(propName) {
        case "BackgroundColor":
            return "document.body.style.backgroundColor = \"#" +
                propValue.substring(4) + "\";";
        case "Title":
            return "document.title =\"" +propValue+ "\";";
        case "BackgroundImage":
            return "document.body.style.backgroundImage = \"url(assets/" +
                (propValue) + ")\";";
        default:
            return "";
    }
};

Blockly.FormJsGenerator.getSizeVal = function(index) {
    if(index == "Automatic")
        return "auto";
    else if(index == "Fill Parent")
        return "100%";
    else if(index.indexOf("-")<0)
        return index+"px";
    else
        return index.substring(3)+"%";
};


Blockly.FormJsGenerator.getVisibility = function(index) {
    if (index == "True" ) {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.FormJsGenerator.getEnabled = function(index) {
    if (index == "True") {
        return "False";
    } else {
        return "True";
    }
};

Blockly.FormJsGenerator.getFontType = function(index) {
    switch(index) {
        case "0": return "courier";
        case "1": return "sans-serif";
        case "2": return "serif";
        case "3": return "monospace";
        default:  return "";
    }
};

Blockly.FormJsGenerator.getTextAlignment = function(index) {
    switch (index) {
        case "0":
            return "left";
        case "1":
            return "center";
        case "2":
            return "right";
        default:
            return "";
    }
};
Blockly.FormJsGenerator.getShape = function(index) {
        switch(index) {
            case "0":
            case "2":
                return "default";
            case "1": return "rounded";
            default:  return "oval";
        }
};
