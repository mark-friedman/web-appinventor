

'use strict';

goog.provide('Blockly.VerticalArrangement');

goog.require('Blockly.Generator');

goog.require('Blockly.LiveWebAppClient');

/////// Methods to be implemented for every component JS Generator Start

Blockly.VerticalArrangement.generateJSForAddingComponent = function(component){
    var vertical ="";
    if (component.hasOwnProperty('$Components')) {
        vertical += "var div_arrangement = document.createElement(\"div\");";
        var components = component.$Components;
        vertical += "div_arrangement.id=\""+component.$Name+"\";";
        vertical += "div_arrangement.className = \"column\";";
        var span = 1;
        if (components > 0)
            span = 12 / components.length;
        for (var i = 0; i < components.length; i++) {
            var js = "";
            vertical += "var div" + i + " = document.createElement(\"div\");";
            vertical += "div" + i + ".className = \"row-md-" + span + "\";";
            if (js == undefined)
                js = Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);
            else
                js += Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);

            // generate javascript for all the set properties
            for (var key in components[i]) {
                var propValue = Blockly.ComponentJSGenerator.generateJSForPropertyChange(components[i], key, components[i][key]);
                if(propValue!="")
                    js +=propValue;
            }
            vertical += js;
            vertical += "div" + i + ".appendChild(div);";
            vertical += "div_arrangement.appendChild(div" + i + ");";
        }
        vertical += "document.body.appendChild(div_arrangement);";
    }
    return vertical;
};


Blockly.VerticalArrangement.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\""+component.$Name +"\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}";
};

Blockly.VerticalArrangement.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End


Blockly.VerticalArrangement.setProperties = function(component, propName, propValue) {
    switch(propName) {
        case "Visible":
            return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Width":
            return "document.getElementById(\"" + component.$Name + "\").style.width = \""
                + this.getSizeVal(propValue) + "\";";
        case "Height":
            return "document.getElementById(\"" + component.$Name + "\").style.height = \"" +
                this.getSizeVal(propValue) + "\";";
        default:
            return "";
    }
};

Blockly.ButtonJsGenerator.getSizeVal = function(index) {
    if(index == "Automatic")
        return "auto";
    else if(index == "Fill Parent")
        return "100%";
    else
        return index+"px";
};

