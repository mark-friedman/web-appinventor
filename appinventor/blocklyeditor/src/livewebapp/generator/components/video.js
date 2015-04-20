

'use strict';

goog.provide('Blockly.VideoJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.VideoJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload(false);" +
        "var div = document.createElement(\"div\");" +
            "var video = document.createElement(\"video\");" +
            "video.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "video.setAttribute(\"controls\",\"controls\");" +
            "div.appendChild(video);" +
            "document.body.appendChild(div);}"+
        this.getWidthSizeVal("-1", component) +  this.getHeightSizeVal("-1", component);
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
            return this.getWidthSizeVal(propValue, component);
        case "Height":
            return this.getHeightSizeVal(propValue, component);
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

Blockly.VideoJsGenerator.getWidthSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"" + component.$Name + "\").style.width = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"" + component.$Name + "\").style.width = \"100%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"" + component.$Name + "\").style.width =\""+ index+"px\";";
    else
        return "document.getElementById(\"" + component.$Name + "\").style.width =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
};

Blockly.VideoJsGenerator.getHeightSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"" + component.$Name + "\").style.height = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"" + component.$Name + "\").style.height = \"100%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"" + component.$Name + "\").style.height =\""+ index+"px\";";
    else
        return "document.getElementById(\"" + component.$Name + "\").style.height =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"" + component.$Name + "\").style.display = \"block\";";
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
