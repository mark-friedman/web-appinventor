

'use strict';

goog.provide('Blockly.ListPickerJsGenerator');

goog.require('Blockly.Generator');

/////// Methods to be implemented for every component JS Generator Start

Blockly.ListPickerJsGenerator.generateJSForAddingComponent = function(component){
    return "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element !== null) { " +
        "location.reload();" +
        "}else {"+
        "var div = document.createElement(\"div\");" +
        "div.setAttribute(\"id\",\"div_" + component.$Name + "\");" +
            "var listView = document.createElement(\"select\");" +
            "listView.setAttribute(\"id\",\"" + component.$Name + "\");" +
            "var label = document.createElement(\"Label\");" +
            "label.setAttribute(\"id\",\"label_" + component.$Name + "\");" +
            "label.appendChild(document.createTextNode(\"" + component.Text + "\"));" +
            "div.appendChild(label);" +
            "div.appendChild(listView);" +
            "document.body.appendChild(div);}"+
        "document.getElementById(\"div_"+ component.$Name + "\").style.cssFloat = \"left\";"+
        this.getWidthSizeVal("-1", component) +  this.getHeightSizeVal("-1", component);
};

Blockly.ListPickerJsGenerator.generateJSForRemovingComponent = function(component){
        return     "var previous =document.getElementById(\"div_" + component.$Name + "\");"+
            "previous.remove();";
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
             Math.round(propValue) +"px\";";
         case "FontTypeface":
             return "document.getElementById(\"div_" + component.$Name + "\").style.fontFamily = \"" +
                    getFontType(propValue) + "\";";
         case "Text":
             return "document.getElementById(\"label_" + component.$Name + "\").textContent=\"" +
                 propValue + "\";";
         case "TextColor":
             return "document.getElementById(\"label_" + component.$Name + "\").style.color = \"#" +
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
             return this.generateJSForRemovingComponent(component) + this.generateJSForAddingComponent(component) +
                 this.getList(component);
         case "Image":
             return "document.getElementById(\"div_" + component.$Name + "\").style.backgroundImage = \"url(assets/" +
                 (propValue) + ")\";";
         case "ItemBackgroundColor":
             if(component.hasOwnProperty("ElementsFromString"))
                 return this.generateJSForRemovingComponent(component) + this.generateJSForAddingComponent(component) +
                     this.getList(component);
             else
                 return "";
         case "ItemTextColor":
            return "document.getElementById(\"div_" + component.$Name + "\").style.color = \"" +
                propValue.substring(4) + "\";";
         case "Title":
                 return this.getTitleList(component);
         case "Selection":
             if(component.hasOwnProperty("ElementsFromString"))
                 return this.generateJSForRemovingComponent(component) + this.generateJSForAddingComponent(component) +
                     + this.getList(component);
             else
                 return "";
         default:
             return "";
     }
    };

Blockly.ListPickerJsGenerator.getWidthSizeVal = function(index, component) {
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
            "document.getElementById(\"div_" + component.$Name + "\").style.display = \"block\";";
};

Blockly.ListPickerJsGenerator.getList = function(component) {
    var listVals= component.ElementsFromString.split(",");
    var i;
    var listJS="";
    if(component.hasOwnProperty('Title')){
        listJS=listJS+ "var opt = document.createElement(\"option\");"+
        "opt.value=\""+component["Title"] +"\";"+
        "opt.setAttribute(\"disabled\",\"true \");";
        if(component.hasOwnProperty('Selection')){
            if(component["Selection"]==component["Title"])
                listJS+= "opt.setAttribute(\"selected\",\"true\");";
        }
        if(component.hasOwnProperty('ItemBackgroundColor')){
            listJS+= "opt.setAttribute(\"backgroundColor\",\""+component["ItemBackgroundColor"].substring(4) + "\");";
        }
        listJS+="var listName=document.getElementById(\""+component.$Name+"\");"+
        "listName.appendChild(opt);";
    }
    for (i = 0; i < listVals.length; i++) {
        listJS=listJS+ "var opt = document.createElement(\"option\");"+
        "opt.text =\"" +listVals[i]+"\";"+
        "opt.value =\""+listVals[i]+"\";";
        if(component.hasOwnProperty('Selection')){
            if(component["Selection"]==listVals[i])
                listJS+= "opt.setAttribute(\"selected\",\"true \");";
        }
        if(component.hasOwnProperty('ItemBackgroundColor')){
            listJS+= "opt.setAttribute(\"backgroundColor\",\""+component["ItemBackgroundColor"].substring(4) + "\");";
        }
        listJS+="var listName=document.getElementById(\""+component.$Name+"\");"+
        "listName.appendChild(opt);";
    }
    return listJS;
};

Blockly.ListPickerJsGenerator.getTitleList = function(component) {
    var listJS="";
    if(component.hasOwnProperty('Title')){
        listJS=listJS+ "var opt = document.createElement(\"option\");"+
        "opt.value=\""+component["Title"] +"\";"+
        "opt.setAttribute(\"disabled\",\"true \");";
        if(component.hasOwnProperty('Selection')){
            if(component["Selection"]==component["Title"])
                listJS+= "opt.setAttribute(\"selected\",\"true\");";
        }
        listJS+="var listName=document.getElementById(\""+component.$Name+"\");"+
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