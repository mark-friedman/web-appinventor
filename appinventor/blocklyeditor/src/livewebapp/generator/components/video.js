

'use strict';

goog.provide('Blockly.VideoJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.VideoJsGenerator.generateJSForAddingComponent = function(component){
    return     "var div = document.createElement(\"div\");" +
                "var video = document.createElement(\"video\");" +
                "video.setAttribute(\"id\",\"" + component.$Name + "\");" +
                "video.setAttribute(\"controls\",\"controls\");"+
                "div.appendChild(video);"+
                "document.body.appendChild(div);";

};


Blockly.VideoJsGenerator.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\"" + component.$Name + "\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}";
};

Blockly.VideoJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End


Blockly.VideoJsGenerator.setProperties = function(component, propName, propValue) {
    switch(propName) {

        case "Width":
            return "document.getElementById(\"" + component.$Name + "\").style.width = \""
                + this.getSizeVal(propValue) + "\";";
        case "Height":
            return "document.getElementById(\"" + component.$Name + "\").style.height = \""
                + this.getSizeVal(propValue) + "\";";
        case "Visible":
            return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Volume":
            return "document.getElementById(\"" +component.$Name + "\").volume=\""
                + parseFloat(propValue/100) + "\";";
        case "Source":
            return this.getVideoSourceJS(component.$Name, propValue);
        default:
            return "";
    }
};

Blockly.VideoJsGenerator.getSizeVal = function(index) {
    if(index == "Automatic")
        return "auto";
    else if(index == "Fill Parent")
        return "100%";
    else
        return index+"px";
};


Blockly.VideoJsGenerator.getVideoSourceJS= function(componentName, propVal) {
    return "var videoID=document.getElementById(\""+componentName+"\");"+
        "videoID.src = \"assets/" + (propVal) + "\";";
};

Blockly.VideoJsGenerator.getVisibility = function(index) {
    if (index == "True" ) {
        return "";
    } else {
        return "hidden";
    }
};
