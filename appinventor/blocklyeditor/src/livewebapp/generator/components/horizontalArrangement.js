

'use strict';

goog.provide('Blockly.HorizontalArrangement');

goog.require('Blockly.Generator');

goog.require('Blockly.LiveWebAppClient');

/////// Methods to be implemented for every component JS Generator Start

Blockly.HorizontalArrangement.generateJSForAddingComponent = function(component){
    var horizontal ="";
    if (component.hasOwnProperty('$Components')) {
        horizontal += "var div_arrangement = document.createElement(\"div\");";
        horizontal += "div_arrangement.id=\"div-"+component.Uuid+"\";";
        horizontal += "div_arrangement.className = \"row\";";
        var components = component.$Components;
        var span = 1;
        if (components > 0)
            span = 12 / components.length;
        for (var i = 0; i < components.length; i++) {
            var js = "";
            horizontal += "var div" + i + " = document.createElement(\"div\");";
            horizontal += "div" + i + ".className = \"col-md-" + span + "\";";
            if (js == undefined)
                js = Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);
            else
                js += Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);
            console.log("Adding Component JS: " + js);

            // generate javascript for all the set properties
            for (var key in components[i]) {
                var propValue = Blockly.ComponentJSGenerator.generateJSForPropertyChange(components[i], key, components[i][key]);
                if(propValue!="")
                    js +=propValue;
            }
            horizontal += js;
            horizontal += "div" + i + ".appendChild(div);";
            horizontal += "div_arrangement.appendChild(div" + i + ");";
        }
        horizontal += "document.body.appendChild(div_arrangement);";
    }
    return horizontal;
};


Blockly.HorizontalArrangement.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\"div-"+component.Uuid +"\");" +
        "if(node.parentNode){" +
        "  node.parentNode.removeChild(node);"+
        "}";
};

Blockly.HorizontalArrangement.generateJSForPropertyChange = function(component,propertyName,propertyValue){

    return this.setProperties(component,propertyName,propertyValue)
};

/////// Methods to be implemented for every component JS Generator End


Blockly.HorizontalArrangement.setProperties = function(component, propName, propValue) {
    switch(propName) {
        case "Visible":
            return "document.getElementById(\"" + component.Uuid + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Width":
            return "document.getElementById(\"" + component.Uuid + "\").style.width = \""
                + this.getSizeVal(propValue) + "\";";
        case "Height":
            return "document.getElementById(\"" + component.Uuid + "\").style.height = \"" +
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
