

'use strict';

goog.provide('Blockly.HorizontalArrangement');

goog.require('Blockly.Generator');

goog.require('Blockly.LiveWebAppClient');

/////// Methods to be implemented for every component JS Generator Start

Blockly.HorizontalArrangement.generateJSForAddingComponent = function(component){
     var layout= "var element =  document.getElementById(\""+component.$Name+"\");"+
        "if (typeof(element) != 'undefined' && element != null) { +" +
        "location.reload();" +
        "}else {";
        var horizontal = "";
        if (component.hasOwnProperty('$Components')) {
            horizontal += "var div_arrangement = document.createElement(\"div\");";
            horizontal += "div_arrangement.id=\"" + component.$Name + "\";";
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
                    if (propValue != "")
                        js += propValue;
                }
                horizontal += js;
                horizontal += "div" + i + ".appendChild(div);";
                horizontal += "div_arrangement.appendChild(div" + i + ");";
            }
            horizontal += "document.body.appendChild(div_arrangement);";
        }
    layout+=horizontal+"}";
        return layout;
};


Blockly.HorizontalArrangement.generateJSForRemovingComponent = function(component){
    return     "var node = document.getElementById(\""+component.$Name +"\");" +
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
            return "document.getElementById(\"" + component.$Name + "\").style.visibility = \"" +
                this.getVisibility(propValue) + "\";";
        case "Width":
            return "document.getElementById(\"" + component.$Name + "\").style.width = \""
                + this.getSizeVal(propValue) + "\";";
        case "Height":
            return "document.getElementById(\"" + component.$Name + "\").style.height = \"" +
                this.getSizeVal(propValue) + "\";";
        case "AlignHorizontal":
            return "document.getElementById(\"" + component.$Name + "\").style.horizontalAlign=\""+
                this.getHorizontalAlignment(propValue)+ "\";";
        case "AlignVertical":
            return "document.getElementById(\"" + component.$Name + "\").style.verticalAlign=\""+
                this.getVerticalAlignment(propValue)+ "\";";
        default:
            return "";
    }
};

Blockly.HorizontalArrangement.getHorizontalAlignment = function(propValue) {
    if(propValue=="0")
        return "left";
    if(propValue=="3")
        return "center";
    if(propValue=="2")
        return "right";
};

Blockly.HorizontalArrangement.getVerticalAlignment = function(propValue) {
    if(propValue=="0")
        return "0%";
    if(propValue=="3")
        return "50%";
    if(propValue=="2")
        return "100%";
};

Blockly.HorizontalArrangement.getSizeVal = function(index) {
    if(index == "Automatic")
        return "auto";
    else if(index == "Fill Parent")
        return "100%";
    else if(index.indexOf("-")<0)
        return index+"px";
    else
        return index.substring(3)+"%";
};
