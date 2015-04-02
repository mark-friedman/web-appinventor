// Javascript generator for components

'use strict';

goog.provide('Blockly.ComponentJSGenerator');

goog.require('Blockly.Generator');
goog.require('Blockly.ButtonJsGenerator');
goog.require('Blockly.ListViewJsGenerator');
goog.require('Blockly.CheckBoxJsGenerator');
goog.require('Blockly.DatePickerJsGenerator');
goog.require('Blockly.LabelJsGenerator');
goog.require('Blockly.TextBoxJsGenerator');
goog.require('Blockly.PasswordBoxJsGenerator');
goog.require('Blockly.VideoJsGenerator');

Blockly.ComponentJSGenerator.getGeneratorForComponent  =  function(component) {
        var type = this.getComponentType(component.$Type);
        switch(type) {
            case "button":
                return Blockly.ButtonJsGenerator;
            case "checkBox":
                return Blockly.CheckBoxJsGenerator;
            case "datePicker":
                return Blockly.DatePickerJsGenerator;
            case "label":
                return Blockly.LabelJsGenerator;
            case "listView":
                return Blockly.ListViewJsGenerator;
            case "textBox":
                return Blockly.TextBoxJsGenerator;
            case "passwordBox":
                return Blockly.PasswordBoxJsGenerator;
            case "listPicker":
                return Blockly.ListPickerJsGenerator;
            case "timePicker":
                return Blockly.TimePickerJsGenerator;
            case "image":
                return Blockly.ImageJsGenerator;
            case "range":
                return Blockly.RangeJsGenerator;
            case "video":
                return Blockly.VideoJsGenerator;
            case "audio":
                return Blockly.AudioJsGenerator;
            case "imagePicker":
                return Blockly.ImagePickerJsGenerator;
            default:
                console.log("==== unknown type: " + component.$Type);
                return null;
};
}


Blockly.ComponentJSGenerator.getComponentType = function(type) {
    console.log("Component:"+type);
         switch(type) {
            case "Button": return "button";
             case "CheckBox": return "checkBox";
             case "DatePicker": return "datePicker";
             case "Label": return "label";
             case "TextBox": return "textBox";
             case "ListView": return "listView";
             case "PasswordTextBox": return "passwordBox";
             case "ListPicker": return "listPicker";
             case "TimePicker": return "timePicker";
             case "Image": return "image";
             case "Slider": return "range";
             case "VideoPlayer" : return "video";
             case "Player" : return "audio";
             case "ImagePicker" : return "imagePicker";
            default: return "";
         }
      };

Blockly.ComponentJSGenerator.generateJSForAddingComponent = function(component){
        console.log("-------generateJSForAddingComponent invoked correctly");
        var jsGenerator = this.getGeneratorForComponent(component);
        var generatedJS= jsGenerator.generateJSForAddingComponent(component);
        console.log(generatedJS);
        return generatedJS;
};

Blockly.ComponentJSGenerator.generateJSForRemovingComponent = function(component){
        var jsGenerator = this.getGeneratorForComponent(component);
        console.log("-------generateJSForRemovingComponent invoked");
        return jsGenerator.generateJSForRemovingComponent(component);
};

Blockly.ComponentJSGenerator.generateJSForPropertyChange = function(component,propertyName,propertyValue){
        var jsGenerator = this.getGeneratorForComponent(component);
        console.log("-------generateJSForPropertyChange invoked");
        console.log("component:"+component+"\tpropertyName:"+propertyName+"\tpropertyValue:"+propertyValue);
        var jsGenerated = jsGenerator.generateJSForPropertyChange(component,propertyName,propertyValue);
        return jsGenerated;
};

