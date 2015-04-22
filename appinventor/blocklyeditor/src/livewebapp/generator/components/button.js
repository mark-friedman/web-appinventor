

'use strict';

goog.provide('Blockly.ButtonJsGenerator');

goog.require('Blockly.Generator');


/////// Methods to be implemented for every component JS Generator Start

Blockly.ButtonJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
    "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload(true);" +
        "}else {"+
         "var div = document.createElement(\"div\");" +
            "var btn = document.createElement(\"Button\");" +
            "btn.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "var txt = document.createTextNode(\"" + component.Text + "\");" +
            "btn.appendChild(txt);" +
            "div.appendChild(btn);" +
            "document.body.appendChild(div);"+
        "}"+  this.getWidthSizeVal("-1", component) +  this.getHeightSizeVal("-1", component);
};


Blockly.ButtonJsGenerator.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\"" + component.$Name + "\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}";
};

Blockly.ButtonJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End


Blockly.ButtonJsGenerator.setProperties = function(component, propName, propValue) {
    switch(propName) {
        case "BackgroundColor":
            return "document.getElementById(\"" + component.$Name + "\").style.backgroundColor = \"#" +
                propValue.substring(4) + "\";";
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
                Math.round(propValue) +"px\";";
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
            return this.getWidthSizeVal(propValue, component);
        case "Height":
            return this.getHeightSizeVal(propValue, component);
        case "Shape":
            return "document.getElementById(\"" + component.$Name + "\").style.Shape = \"" +
                this.getShape(propValue) + "\";";
        case "Visible":
            return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Enabled":
            return "document.getElementById(\"" + component.$Name + "\").disabled = \"" +
                this.getEnabled(propValue) + "\";";
        case "Image":
            return "document.getElementById(\"" + component.$Name + "\").style.backgroundImage = \"url(assets/" +
                (propValue) + ")\";";
        default:
            return "";
    }
};

Blockly.ButtonJsGenerator.getWidthSizeVal = function(index, component) {
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

Blockly.ButtonJsGenerator.getHeightSizeVal = function(index, component) {
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


Blockly.ButtonJsGenerator.getVisibility = function(index) {
    if (index == "True" ) {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.ButtonJsGenerator.getEnabled = function(index) {
    if (index == "True") {
        return "False";
    } else {
        return "True";
    }
};

Blockly.ButtonJsGenerator.getFontType = function(index) {
    switch(index) {
        case "0": return "courier";
        case "1": return "sans-serif";
        case "2": return "serif";
        case "3": return "monospace";
        default:  return "";
    }
};

Blockly.ButtonJsGenerator.getTextAlignment = function(index) {
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
Blockly.ButtonJsGenerator.getShape = function(index) {
        switch(index) {
            case "0":
            case "2":
                return "default";
            case "1": return "rounded";
            default:  return "oval";
        }
};
