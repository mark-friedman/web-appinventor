

'use strict';

goog.provide('Blockly.TextBoxJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.TextBoxJsGenerator.generateJSForAddingComponent = function(component){
     var txtBox = "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { " +
        "location.reload();" +
        "}else {"+
        "var div = document.createElement(\"div\");";
        if (component["MultiLine"] == "True")
            txtBox = txtBox.concat("var txt = document.createElement(\"textarea\");");
        else
            txtBox = txtBox.concat("var txt = document.createElement(\"input\");");
        txtBox = txtBox.concat("txt.setAttribute(\"id\",\"" + component.$Name + "\");" +
        "div.appendChild(txt);" +
        "document.body.appendChild(div);"+
         "}");
    return txtBox+
        this.getWidthSizeVal("-1", component) +  this.getHeightSizeVal("-1", component);
};


Blockly.TextBoxJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var node = document.getElementById(\"" + component.$Name + "\");" +
                   "if(node.parentNode){" +
                   "  node.parentNode.removeChild(node);"+
                   "}";
    };

Blockly.TextBoxJsGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){

        return this.setProperties(component,propertyName,propertyValue)
    };

/////// Methods to be implemented for every component JS Generator End


Blockly.TextBoxJsGenerator.setProperties = function(component, propName, propValue) {
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
         case "Hint":
             return "document.getElementById(\"" + component.$Name + "\").style.title = \"" + propValue + "\";";
         case "MultiLine":
             var txtBox = "var node = document.getElementById(\"" + component.$Name + "\");" +
                 "if(node.parentNode){" +
                 "  node.parentNode.removeChild(node);"+
                 "}";
              txtBox += "var element =  document.getElementById(\""+component.$Name+"\");"+
                 "if (typeof(element) != 'undefined' && element != null) { " +
                 "location.reload();" +
                 "}else {"+
                 "var div = document.createElement(\"div\");";
             if (component["MultiLine"] == "True")
                 txtBox += "var txt = document.createElement(\"textarea\");";
             else
                 txtBox += "var txt = document.createElement(\"input\");";
             txtBox += "txt.setAttribute(\"id\",\"" + component.$Name + "\");" +
             "div.appendChild(txt);" +
             "document.body.appendChild(div);";
             txtBox += "}";
             return txtBox;
         case "BackgroundColor":
             return "document.getElementById(\"" + component.$Name + "\").style.backgroundColor = \"#" +
                 propValue.substring(4) + "\";";
         default:
             return "";
     }
    };

Blockly.TextBoxJsGenerator.getWidthSizeVal = function(index, component) {
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

Blockly.TextBoxJsGenerator.getHeightSizeVal = function(index, component) {
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

Blockly.TextBoxJsGenerator.getFontType = function(index) {
        switch(index) {
            case "0": return "courier";
            case "1": return "sans-serif";
            case "2": return "serif";
            case "3": return "monospace";
            default:  return "";
        }
    };

Blockly.TextBoxJsGenerator.getTextAlignment = function(index) {
        switch(index) {
            case "0": return "left";
            case "1": return "center";
            case "2": return "right";
            default:  return "";
        }
    };

