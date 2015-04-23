'use strict';

goog.provide('Blockly.CheckBoxJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.CheckBoxJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload();" +
        "}else {"+
         "var div = document.createElement(\"div\");" +
        "div.setAttribute(\"id\",\"div_" + component.$Name + "\");" +
            "var checkBox = document.createElement(\"input\");" +
            "checkBox.setAttribute(\"type\",\"checkbox\");" +
            "checkBox.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "var label = document.createElement(\"Label\");" +
            "label.setAttribute(\"id\",\"label_" + component.$Name + "\");" +
            "label.appendChild(document.createTextNode(\"" + component.Text + "\"));" +
            "div.appendChild(checkBox);" +
            "div.appendChild(label);" +
            "document.body.appendChild(div);}"+
            "document.getElementById(\"div_"+ component.$Name + "\").style.cssFloat = \"left\";" +
           this.getWidthSizeVal("-1", component) +  this.getHeightSizeVal("-1", component);
};

Blockly.CheckBoxJsGenerator.generateJSForRemovingComponent = function(component){
    return     "var previous =document.getElementById(\"div_" + component.$Name + "\");"+
            "previous.remove();"+
        "var node = document.getElementById(\"" + component.$Name + "\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}"
};

Blockly.CheckBoxJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End

Blockly.CheckBoxJsGenerator.setProperties = function(component, propName, propValue) {
    switch(propName) {
        case "FontBold":
            if(propValue == "False"){
                return "document.getElementById(\"div_" + component.$Name + "\").style.fontWeight = \"normal\";";
            }else{
                return "document.getElementById(\"div_" + component.$Name + "\").style.fontWeight = \"bold\";";
            }
        case "FontItalic":
            if(propValue == "False"){
                return "document.getElementById(\"div_" + component.$Name + "\").style.fontStyle = \"normal\";";
            }else{
                return "document.getElementById(\"div_" + component.$Name + "\").style.fontStyle = \"italic\";";
            }
        case "FontSize":
            return "document.getElementById(\"div_" + component.$Name + "\").style.fontSize = \"" +
                Math.round(propValue) +"px\";";
        case "FontTypeface":
            return "document.getElementById(\"div_" + component.$Name + "\").style.fontFamily = \"" +
                this.getFontType(propValue) + "\";";
        case "Text":
            return "document.getElementById(\"label_" + component.$Name + "\").textContent=\""
                + propValue + "\";";
        case "TextColor":
            return "document.getElementById(\"div_" + component.$Name + "\").style.color = \"#" +
                propValue.substring(4) + "\";";
        case "Width":
            return this.getWidthSizeVal(propValue, component);
        case "Height":
            return this.getHeightSizeVal(propValue, component);
        case "Visible":
            return "document.getElementById(\"div_" + component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";"+
                "document.getElementById(\"div_"+ component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Enabled":
            return "document.getElementById(\"div_" + component.$Name + "\").disabled = \"" +
                this.getEnabled(propValue) + "\";";
        case "Checked":
            return "document.getElementById(\"div_" + component.$Name + "\").checked = \"" +
                this.getChecked(propValue) + "\";";
        case "BackgroundColor":
            return "document.getElementById(\"div_" + component.$Name + "\").style.backgroundColor = \"#" +
                propValue.substring(4) + "\";";
        default:
            return "";
    }
};

Blockly.CheckBoxJsGenerator.getWidthSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"div_" + component.$Name + "\").style.width = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"div_" + component.$Name + "\").style.width = \"100%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\";";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"div_" + component.$Name + "\").style.width =\""+ index+"px\";";
    else
        return "document.getElementById(\"div_" + component.$Name + "\").style.width =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\";";
};

Blockly.CheckBoxJsGenerator.getHeightSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"div_" + component.$Name + "\").style.height = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"div_" + component.$Name + "\").style.height = \"100%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\";";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"div_" + component.$Name + "\").style.height =\""+ index+"px\";";
    else
        return "document.getElementById(\"div_" + component.$Name + "\").style.height =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\";";
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
        return "true";
    } else {
        return "false";
    }
};