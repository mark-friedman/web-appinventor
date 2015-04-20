

'use strict';

goog.provide('Blockly.AudioJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.AudioJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload();" +
        "}else {"+
        "var div = document.createElement(\"div\");" +
      "var audio = document.createElement(\"audio\");" +
      "audio.setAttribute(\"id\",\"" + component.$Name + "\");" +
      "audio.setAttribute(\"controls\",\"controls\");"+
      "audio.setAttribute(\"hidden\", \"hidden\");"+
      "audio.setAttribute(\"autoplay\", \"autoplay\");"+
      "div.appendChild(audio);"+
      "document.body.appendChild(div);" +
        "}";
};


Blockly.AudioJsGenerator.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\"" + component.$Name + "\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}";
};

Blockly.AudioJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End


Blockly.AudioJsGenerator.setProperties = function(component, propName, propValue) {
    switch(propName) {
        case "Volume":
            return "document.getElementById(\"" +component.$Name + "\").volume=\"" +
                parseFloat(propValue/100) + "\";";
        case "Loop":
            return "var audio=document.getElementById(\""+component.$Name+"\");"+
                    "audio.setAttribute(\"loop\",\"loop\");";
        case "Source":
            return this.getAudioSourceJS(component.$Name, propValue);
        default:
            return "";
    }
};


Blockly.AudioJsGenerator.getAudioSourceJS= function(componentName, propVal) {
    return "var audioID=document.getElementById(\""+componentName+"\");"+
        "audioID.src = \"assets/" + (propVal) + "\";";
};

Blockly.AudioJsGenerator.getVisibility = function(index) {
    if (index == "True" ) {
        return "";
    } else {
        return "hidden";
    }
};
