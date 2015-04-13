

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
        case "AlignHorizontal":
            return "document.getElementById(\"" + component.$Name + "\").style.horizontalAlign=\""+
            this.getHorizontalAlignment(propValue)+ "\";";
        case "AlignVertical":
            return "document.getElementById(\"" + component.$Name + "\").style.verticalAlign=\""+
                this.getVerticalAlignment(propValue)+ "\";";
        default:
            return "";
    }
};

Blockly.FormJsGenerator.getHorizontalAlignment = function(propValue) {
    if(propValue=="0")
        return "left";
    if(propValue=="3")
        return "center";
    if(propValue=="2")
        return "right";
};

Blockly.FormJsGenerator.getVerticalAlignment = function(propValue) {
    if(propValue=="0")
        return "0%";
    if(propValue=="3")
        return "50%";
    if(propValue=="2")
        return "100%";
};