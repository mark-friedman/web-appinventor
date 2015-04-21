

'use strict';

goog.provide('Blockly.ListViewJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.ListViewJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload();" +
        "}else {"+
        "var div = document.createElement(\"div\");" +
            "var listView = document.createElement(\"ul\");" +
            "listView.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "div.appendChild(listView);" +
            "document.body.appendChild(div);}"+
        this.getWidthSizeVal("-1", component) +  this.getHeightSizeVal("-1", component);
};

Blockly.ListViewJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.ListViewJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.ListViewJsGenerator.setProperties = function(component, propName, propValue) {
     switch(propName) {
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
             Math.round(propValue) +"pt\";";
         case "FontTypeface":
             return "document.getElementById(\"" + component.$Name + "\").style.fontFamily = \"" +
                    getFontType(propValue) + "\";";
         case "Text":
             return "document.getElementById(\"" + component.$Name + "\").innerHTML = \"" + propValue + "\";";
         case "TextColor":
             return "document.getElementById(\"" + component.$Name + "\").style.color = \"#" +
                    propValue.substring(4) + "\";";
         case "TextAlignment":
             return "document.getElementById(\"" + component.$Name + "\").style.textAlign = \"" +
                                  getTextAlignment(propValue) + "\";";
         case "Width":
             return this.getWidthSizeVal(propValue, component);
         case "Height":
             return this.getHeightSizeVal(propValue, component);
         case "BackgroundColor":
             return "document.getElementById(\"" + component.$Name + "\").style.backgroundColor = \"" +
                 this.getColor(propValue) + "\";";
         case "Visible":
             return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                 this.getVisibility(propValue) + "\";";
         case "Enabled":
             return "document.getElementById(\"" + component.$Name + "\").disabled = \"" +
                 this.getEnabled(propValue) + "\";";
         case "ElementsFromString":
             return this.getList(propValue, component.$Name);
         default:
             return "";
     }
    };

Blockly.ListViewJsGenerator.getList = function(index, componentID) {
    var listVals= index.split(",");
    var i;
    var listJS="";
    for (i = 0; i < listVals.length; i++) {
        listJS=listJS+" var anchor = document.createElement(\"a\");"+
        "anchor.href = \"#\";" +
        "anchor.innerText = \""+listVals[i]+"\";"+
        "var elem = document.createElement(\"li\");"+
        "elem.appendChild(anchor);"+
        componentID+".appendChild(elem);";
    }
    return listJS;
};

Blockly.ListViewJsGenerator.getWidthSizeVal = function(index, component) {
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

Blockly.ListViewJsGenerator.getHeightSizeVal = function(index, component) {
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

Blockly.ListViewJsGenerator.getColor = function(index) {
    return index.replace(0, 4, "#");
};

Blockly.ListViewJsGenerator.getVisibility = function(index) {
    if (index == "True") {
        return "";
    } else {
        return "hidden";
    }
};

Blockly.ListViewJsGenerator.getEnabled = function(index) {
    if (index == "True") {
       return "False";
    } else {
        return "True";
    }
};

Blockly.ListViewJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
    };

Blockly.ListViewJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
    };

Blockly.ListViewJsGenerator.getShape = function(index) {
    switch(index) {
        case "0":
        case "2":
            return "default";
        case "1": return "rounded";
        default:  return "oval";
    }
};