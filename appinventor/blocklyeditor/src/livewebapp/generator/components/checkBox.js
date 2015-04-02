'use strict';

goog.provide('Blockly.CheckBoxJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.CheckBoxJsGenerator.generateJSForAddingComponent = function(component){
    return "var div = document.createElement(\"div\");" +
        "var checkBox = document.createElement(\"input\");" +
        "checkBox.setAttribute(\"type\",\"checkbox\");" +
        "checkBox.setAttribute(\"id\",\"" + component.$Name + "\");" +
        "var label = document.createElement(\"Label\");" +
        "label.setAttribute(\"htmlFor\",\"" + component.$Name + "\");" +
        "label.appendChild(document.createTextNode(\"" + component.Text + "\"));"+
        "div.appendChild(checkBox);" +
        "div.appendChild(label);" +
        "document.body.appendChild(div);";
};

Blockly.CheckBoxJsGenerator.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\"" + component.$Name + "\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}";
};

Blockly.CheckBoxJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End

Blockly.CheckBoxJsGenerator.setProperties = function(component, propName, propValue) {
    switch(propName) {
        case "FontBold":
            if(propValue == "False"){
                return "document.getElementById(\"" + component.$Name + "\").style.innerHTML.fontWeight = \"normal\";";
            }else{
                return "document.getElementById(\"" + component.$Name + "\").style.innerHTML.fontWeight = \"bold\";";
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
            return "document.getElementById(\"" + component.$Name + "\").innerHTML.style.color = \"#" +
                propValue.substring(4) + "\";";
        case "Width":
            return "document.getElementById(\"" + component.$Name + "\").style.width = \"" + propValue + "px\";";
        case "Height":
            return "document.getElementById(\"" + component.$Name + "\").style.height = \"" + propValue + "px\";";
        case "Visible":
            return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Enabled":
            return "document.getElementById(\"" + component.$Name + "\").style.disabled = \"" +
                this.getEnabled(propValue) + "\";";
        case "Checked":
            return "document.getElementById(\"" + component.$Name + "\").style.checked = \"" +
                this.getChecked(propValue) + "\";";
        default:
            return "";
    }
};

Blockly.CheckBoxJsGenerator.getColor = function(index) {
    return index.replace(0, 4, "#");
};

Blockly.CheckBoxJsGenerator.getVisibility = function(index) {
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

Blockly.CheckBoxJsGenerator.getFontType = function(index) {
    switch(index) {
        case "0": return "courier";
        case "1": return "sans-serif";
        case "2": return "serif";
        case "3": return "monospace";
        default:  return "";
    }
};

Blockly.CheckBoxJsGenerator.getChecked = function(index) {
    if (index == "True") {
        return "alse";
    } else {
        return "true";
    }
};