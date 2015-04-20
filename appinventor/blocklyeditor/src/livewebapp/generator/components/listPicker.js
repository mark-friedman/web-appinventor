

'use strict';

goog.provide('Blockly.ListPickerJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.ListPickerJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload();" +
        "}else {"+
        "var div = document.createElement(\"div\");" +
        "div.setAttribute(\"id\",\"div_" + component.$Name + "\");" +
            "var listView = document.createElement(\"select\");" +
            "listView.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "var label = document.createElement(\"Label\");" +
            "label.setAttribute(\"id\",\"" + component.Uuid + "\");" +
            "label.appendChild(document.createTextNode(\"" + component.Text + "\"));" +
            "div.appendChild(label);" +
            "div.appendChild(listView);" +
            "document.body.appendChild(div);}"+
        "document.getElementById(\"div_"+ component.$Name + "\").style.cssFloat = \"left\"";
};

Blockly.ListPickerJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var previous =document.getElementById(\"" + component.$Name + "\").previousElementSibling;"+
            "previous.remove();"+
            "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.ListPickerJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.ListPickerJsGenerator.setProperties = function(component, propName, propValue) {
     switch(propName) {
         case "FontBold":
             if(propValue == "False"){
               return "document.getElementById(\"div_" + component.$Name + "\").style.fontWeight = \"normal\";";
             }else{
               return "document.getElementById(\"div_" + component.$Name + "\").style. = \"bold\";";
             }
         case "FontItalic":
             if(propValue == "False"){
               return "document.getElementById(\"div_" + component.$Name + "\").style.fontStyle = \"normal\";";
             }else{
               return "document.getElementById(\"div_" + component.$Name + "\").style.fontStyle = \"italic\";";
             }
         case "FontSize":
             return "document.getElementById(\"div_" + component.$Name + "\").style.fontSize = \"" +
             Math.round(propValue) +"pt\";";
         case "FontTypeface":
             return "document.getElementById(\"div_" + component.$Name + "\").style.fontFamily = \"" +
                    getFontType(propValue) + "\";";
         case "Text":
             return "document.getElementById(\"div_" + component.$Name + "\").textContent=\"" +
                 propValue + "\";";
         case "TextColor":
             return "document.getElementById(\"div_" + component.$Name + "\").style.color = \"#" +
                    propValue.substring(4) + "\";";
         case "TextAlignment":
             return "document.getElementById(\"div_" + component.$Name + "\").style.textAlign = \"" +
                                  getTextAlignment(propValue) + "\";";
         case "Width":
             return this.getWidthSizeVal(propValue, component);
         case "Height":
             return this.getHeightSizeVal(propValue, component);
         case "BackgroundColor":
             return "document.getElementById(\"div_" + component.$Name + "\").style.backgroundColor = \"#" +
                 propValue.substring(4) + "\";";
         case "Visible":
             return "document.getElementById(\"div_" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";"+
              "document.getElementById(\"div_" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";";
         case "Enabled":
             return "document.getElementById(\"div_" + component.$Name + "\").disabled = \"" +
                 this.getEnabled(propValue) + "\";";
         case "ElementsFromString":
             return this.getList(propValue, component.$Name);
         case "Image":
             return "document.getElementById(\"div_" + component.$Name + "\").style.backgroundImage = \"url(assets/" +
                 (propValue) + ")\";";
         default:
             return "";
     }
    };

Blockly.ListPickerJsGenerator.getWidthSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"div_" + component.$Name + "\").style.width = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"div_" + component.$Name + "\").style.width = \"100%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"div_" + component.$Name + "\").style.width =\""+ index+"px\";";
    else
        return "document.getElementById(\"div_" + component.$Name + "\").style.width =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
};

Blockly.ListPickerJsGenerator.getHeightSizeVal = function(index, component) {
    if(index == "-1")
        return "document.getElementById(\"div_" + component.$Name + "\").style.height = \"auto\";";
    else if(index == "-2")
        return "document.getElementById(\"div_" + component.$Name + "\").style.height = \"100%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
    else if(index.indexOf("-")<0)
        return "document.getElementById(\"div_" + component.$Name + "\").style.height =\""+ index+"px\";";
    else
        return "document.getElementById(\"div_" + component.$Name + "\").style.height =\""+ index.substring(3)+"%\";"+
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\"";
};

Blockly.ListPickerJsGenerator.getList = function(index, componentID) {
    var listVals= index.split(",");
    var i;
    var listJS="";
    for (i = 0; i < listVals.length; i++) {
        listJS=listJS+ "var opt = document.createElement(\"option\");"+
        "opt.text =\"" +listVals[i]+"\";"+
        "opt.value =\""+listVals[i]+"\";"+
        "var listName=document.getElementById(\""+componentID+"\");"+
        "listName.appendChild(opt);";
    }
    return listJS;
};

Blockly.ListPickerJsGenerator.getVisibility = function(index) {
    if (index == "True") {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.ListPickerJsGenerator.getEnabled = function(index) {
    if (index == "True") {
       return "False";
    } else {
        return "True";
    }
};

Blockly.ListPickerJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
    };

Blockly.ListPickerJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
    };

Blockly.ListPickerJsGenerator.getShape = function(index) {
    switch(index) {
        case "0":
        case "2":
            return "default";
        case "1": return "rounded";
        default:  return "oval";
    }
};