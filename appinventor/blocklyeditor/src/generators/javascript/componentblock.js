// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @license
 * @fileoverview Component blocks yail generators for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.JavaScript.componentblock');

/**
 * Lyn's History:
 * [lyn, 10/27/13] Modified event parameter names to begin with YAIL_LOCAL_VAR_TAG (currently '$').
 *     All setters/getters assume such a tag. At least on Kawa-legal first character is necessary to
 *     ensure AI identifiers satisfy Kawa's identifier rules.
 */

/**
 * Returns a function that takes no arguments, generates JavaScript for an event handler declaration block
 * and returns the generated code string.
 *
 * @param {String} instanceName the block's instance name, e.g., Button1
 * @param {String} eventName  the type of event, e.g., Click
 * @returns {Function} event code generation function with instanceName and eventName bound in
 */
Blockly.JavaScript.component_event = function() {
  //Standard start for each blocks javascript functions
  var code = 'document.getElementById("' + this.instanceName + '").';

  //Eventually will need a runtime library to deal with event handles
  //Currently will use a conditional
  var JSEvent;

  // Switch Block to handle different event handlers
  switch (this.eventName) {
    case 'Click':
      JSEvent = 'onclick';
      break;
    case 'GotFocus':
      JSEvent = 'onmouseover';
      break;
    case 'LostFocus':
      JSEvent = 'onmouseout';
      break;
    case 'Changed':
      JSEvent = 'onchange';
    case 'TouchDown':
      JSEvent = 'onmousedown';
      break;
    case 'TouchUp':
      JSEvent = 'onmouseup';
      break;
    case 'AfterDateSet':
      JSEvent = 'onchange';
      break;
    case 'PositionChanged':
      JSEvent = 'onchange';
      break;
    case 'AfterPicking':
      JSEvent = 'onselect';
      break;
    case 'Completed':
      JSEvent = 'onended';
      break;
    default:
      break;
  }

  //Concatenate event handler functionality
  code = code + JSEvent;

  //Fetch the code for the body
  code = code + ' = function() {';

  var body = Blockly.JavaScript.statementToCode(this, 'DO', Blockly.JavaScript.ORDER_NONE);

  //TODO: handle deactivated block
  if(body == ""){
    body = null;
  }

  //Concatenate the body
  code = code + body;


  //Finalize
  code = code + '};';

  return code;


 // var body = Blockly.JavaScript.statementToCode(this, 'DO', Blockly.JavaScript.ORDER_NONE);
 // // TODO: handle deactivated block, null body
 // if(body == ""){
 //   body = Blockly.JavaScript.YAIL_NULL;
 // }


 // var code = Blockly.JavaScript.YAIL_DEFINE_EVENT
 //   + this.getFieldValue("COMPONENT_SELECTOR")
 //   + Blockly.JavaScript.YAIL_SPACER
 //   + this.eventName
 //   + Blockly.JavaScript.YAIL_OPEN_COMBINATION
    // TODO: formal params go here
 //   + this.declaredNames()
//        .map(function (name) {return Blockly.JavaScript.YAIL_LOCAL_VAR_TAG+name;})
//          .join(' ')
//   + Blockly.JavaScript.YAIL_CLOSE_COMBINATION
//    + Blockly.JavaScript.YAIL_SET_THIS_FORM
//    + Blockly.JavaScript.YAIL_SPACER
//    + body
//    + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
//  return code;
}

Blockly.JavaScript.component_method = function() {
  var methodHelperJavaScriptString = Blockly.JavaScript.methodHelper(this, (this.isGeneric ? this.typeName : this.instanceName), this.methodName, this.isGeneric);
  //if the method returns a value
  if(this.getMethodTypeObject().returnType) {
    return [methodHelperJavaScriptString, Blockly.JavaScript.ORDER_ATOMIC];
  } else {
    return methodHelperJavaScriptString + ';';
  }
}

/**
 * Returns a function that generates JavaScript to call to a method with a return value. The generated
 * function takes no arguments and returns a 2-element Array with the method call code string
 * and the operation order Blockly.JavaScript.ORDER_ATOMIC.
 *
 * @param {String} instanceName
 * @param {String} methodName
 * @returns {Function} method call generation function with instanceName and methodName bound in
 */
Blockly.JavaScript.methodWithReturn = function(instanceName, methodName) {
  return function() {
    return [Blockly.JavaScript.methodHelper(this, instanceName, methodName, false),
            Blockly.JavaScript.ORDER_ATOMIC];
  }
}

/**
 * Returns a function that generates JavaScript to call to a method with no return value. The generated
 * function takes no arguments and returns the method call code string.
 *
 * @param {String} instanceName
 * @param {String} methodName
 * @returns {Function} method call generation function with instanceName and methodName bound in
 */
Blockly.JavaScript.methodNoReturn = function(instanceName, methodName) {
  return function() {
    return Blockly.JavaScript.methodHelper(this, instanceName, methodName, false);
  }
}

/**
 * Returns a function that generates JavaScript to call to a generic method with a return value.
 * The generated function takes no arguments and returns a 2-element Array with the method call
 * code string and the operation order Blockly.JavaScript.ORDER_ATOMIC.
 *
 * @param {String} instanceName
 * @param {String} methodName
 * @returns {Function} method call generation function with instanceName and methodName bound in
 */
Blockly.JavaScript.genericMethodWithReturn = function(typeName, methodName) {
  return function() {
    return [Blockly.JavaScript.methodHelper(this, typeName, methodName, true), Blockly.JavaScript.ORDER_ATOMIC];
  }
}

/**
 * Returns a function that generates JavaScript to call to a generic method with no return value.
 * The generated function takes no arguments and returns the method call code string.
 *
 * @param {String} instanceName
 * @param {String} methodName
 * @returns {Function} method call generation function with instanceName and methodName bound in
 */
Blockly.JavaScript.genericMethodNoReturn = function(typeName, methodName) {
  return function() {
    return Blockly.JavaScript.methodHelper(this, typeName, methodName, true);
  }
}

/**
 * Generate and return the code for a method call. The generated code is the same regardless of
 * whether the method returns a value or not.
 * @param {!Blockly.Block} methodBlock  block for which we're generating code
 * @param {String} name instance or type name
 * @param {String} methodName
 * @param {String} generic true if this is for a generic method block, false if for an instance
 * @returns {Function} method call generation function with instanceName and methodName bound in
 */
Blockly.JavaScript.methodHelper = function(methodBlock, name, methodName, generic) {

// TODO: the following line  may be a bit of a hack because it hard-codes "component" as the
// first argument type when we're generating yail for a generic block, instead of using
// type information associated with the socket. The component parameter is treated differently
// here than the other method parameters. This may be fine, but consider whether
// to get the type for the first socket in a more general way in this case.
  var paramObjects = methodBlock.getMethodTypeObject().params;
  var numOfParams = paramObjects.length;
  // not sure if the following array is needed
  // var paramTypes = [];

  // Iterate through to retrieve all the arguments
  var args = [];
  for (var x = 0; x < numOfParams; x++) {
    // TODO(hal, andrew): check for empty socket and generate error if necessary
    args.push(Blockly.JavaScript.YAIL_SPACER
              + Blockly.JavaScript.valueToCode(methodBlock, 'ARG' + x, Blockly.JavaScript.ORDER_NONE));
  }

  typeName = methodBlock.typeName;

  switch (typeName) {

    // maybe? -> test
    // might have to use jquery to implement datepicker
    case 'DatePicker':
      // not sure about launchpicker or setdatetodisplay
      if (methodName == 'LaunchPicker') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").onclick());' +
        '})()';
      } else if (methodName == 'SetDateToDisplay') {
        var year = args[0];
        var month = args[1];
        var day = args[2];
        if (day.length != 2) { day = "0" + day; };
        if (month.length != 2) { month = "0" + month; };

        var date = month + '/' + day + '/' + year;
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").datepicker(\"setDate\", ' + date + '));' +
        '})()';
      }
      break;

    // not sure about this one
    case 'ListPicker':
      if (methodName == 'Open') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").onclick());' +
        '})()';
      }
      break;

    // maybe? -> test
    case 'PasswordTextBox':
      if (methodName == 'RequestFocus') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").focus());' +
        '})()';
      }
      break;

    // maybe? -> test
    // i read that blur might hide the keyboard... test!!
    case 'TextBox':
      if (methodName == 'HideKeyboard') {
        var code = '(function() { ' +
          '(document.activeElement.blur());' +
        '})()';
      } else if (methodName == 'RequestFocus') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").focus());' +
        '})()';
      }
      break;

    // maybe? -> test
    // might have to use jquery to use timepicker
    case 'TimePicker':
      if (methodName == 'LaunchPicker') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").onclick());' +
        '})()';
      } else if (methodName == 'SetTimeToDisplay') {
        var hour = args[0];
        var minute = args[1];
        var suffix = 'AM';
        if (hour > 12) {
          suffix = 'PM';
          hour -= 12;
        }
        // not sure if the following line is needed
        if (hour.length != 2) { hour = "0" + hour; };
        if (minute.length != 2) { minute = "0" + minute; };

        var time = hour + ':' + minute + ' ' + suffix;
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").timepicker(\"setTime\", ' + time + '));' +
        '})()';
      }
      break;

    // maybe? -> test
    case 'ImagePicker':
      if (methodName == 'Open') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").imagepicker());' +
        '})()';
      }
      break;

    // TODO
    // CURRENT TIME JUMPS TO 0 NO MATTER WHAT INPUT
    case 'Player':
      if (methodName == 'Pause') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").pause());' +
        '})()';
      } else if (methodName == 'Start') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").play());' +
        '})()';
      } else if (methodName == 'Stop') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").pause());' +
          '(document.getElementById(\"' + name + '\").currentTime = 0);' +
        '})()';
      }
      // potentially vibrate? w.e
      break;

    // TODO
    // CURRENT TIME JUMPS TO 0 NO MATTER WHAT INPUT
    case 'VideoPlayer':
      if (methodName == 'GetDuration') {
        var code = '(function() { ' +
          'return (document.getElementById(\"' + name + '\").duration * 1000);' +
        '})()';
      } else if (methodName == 'Pause') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").pause());' +
        '})()';
      } else if (methodName == 'SeekTo') {
        var time = args[0] / 1000;
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").currentTime = ' + time + ');' +
        '})()';
      } else if (methodName == 'Start') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").play());' +
        '})()';
      }
      break;


    default:
      break;
  }

  return code;

  // if(generic) {
  //   paramTypes.push(Blockly.JavaScript.YAIL_COMPONENT_TYPE);
  // }

  // for(var i=0;i<paramObjects.length;i++) {
  //   paramTypes.push(paramObjects[i].type);
  // }

  // //var paramTypes = (generic ? [Blockly.JavaScript.YAIL_COMPONENT_TYPE] : []).concat(methodBlock.paramTypes);
  // var callPrefix;
  // if (generic) {
  //   callPrefix = Blockly.JavaScript.YAIL_CALL_COMPONENT_TYPE_METHOD
  //       // TODO(hal, andrew): check for empty socket and generate error if necessary
  //       + Blockly.JavaScript.valueToCode(methodBlock, 'COMPONENT', Blockly.JavaScript.ORDER_NONE)
  //       + Blockly.JavaScript.YAIL_SPACER;
  // } else {
  //   callPrefix = Blockly.JavaScript.YAIL_CALL_COMPONENT_METHOD;
  //   name = methodBlock.getFieldValue("COMPONENT_SELECTOR");
  // }

  // var args = [];
  // for (var x = 0; x < numOfParams; x++) {
  //   // TODO(hal, andrew): check for empty socket and generate error if necessary
  //   args.push(Blockly.JavaScript.YAIL_SPACER
  //             + Blockly.JavaScript.valueToCode(methodBlock, 'ARG' + x, Blockly.JavaScript.ORDER_NONE));
  // }

  // return callPrefix
  //   + Blockly.JavaScript.YAIL_QUOTE
  //   + name
  //   + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_QUOTE
  //   + methodName
  //   + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //   + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR
  //   + args.join(' ')
  //   + Blockly.JavaScript.YAIL_CLOSE_COMBINATION
  //   + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_QUOTE
  //   + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //   + paramTypes.join(' ')
  //   + Blockly.JavaScript.YAIL_CLOSE_COMBINATION
  //   + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
}

Blockly.JavaScript.component_set_get = function() {
  if(this.setOrGet == "set") {
    if(this.isGeneric) {
      return Blockly.JavaScript.genericSetproperty.call(this);
    } else {
      return Blockly.JavaScript.setproperty.call(this);
    }
  } else {
    if(this.isGeneric) {
      return Blockly.JavaScript.genericGetproperty.call(this);
    } else {
      return Blockly.JavaScript.getproperty.call(this);
    }
  }
}

/**
 * Returns a function that takes no arguments, generates JavaScript code for setting a component property
 * and returns the code string.
 *
 * @param {String} instanceName
 * @returns {Function} property setter code generation function with instanceName bound in
 */
Blockly.JavaScript.setproperty = function() {
  var propertyName = this.getFieldValue("PROP");
  // var propType = this.getPropertyObject(propertyName).type
  // var assignLabel = Blockly.JavaScript.YAIL_QUOTE + this.getFieldValue("COMPONENT_SELECTOR") + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_QUOTE + propertyName;
  // var code = Blockly.JavaScript.YAIL_SET_AND_COERCE_PROPERTY + assignLabel + Blockly.JavaScript.YAIL_SPACER;
  // TODO(hal, andrew): check for empty socket and generate error if necessary

  // Generate code for the body
  var bodyCode = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE /*TODO:?*/);

  // Initialize code to call this block instance in the dom
  var elementCode = 'document.getElementById(\"' + this.instanceName + '\")';

  // Call helper function
  var code = Blockly.JavaScript.setPropertyHelper(elementCode, propertyName, bodyCode, this.typeName);

  return code;
}

/**
 *  Helper function that returns code for setting a property on a block
 *  @param {String} elementCode   : The current element to set the property for
 *  @param {String} propertyName  : Name of the property to set
 *  @param {String} bodyCode      : The code for the value to set the element property to
 *  @param {String} typeName      : The type name of the current block
 *  @return {String} code         : Code to be generated based on property
 */
Blockly.JavaScript.setPropertyHelper = function(elementCode, propertyName, bodyCode, typeName) {

  var code;

  // Check if the body code is numeric, if it change keep it as numeric
  var isnum = /^\d+$/.test(bodyCode);
  if (isnum) {
    bodyCode = parseInt(bodyCode);
  }

  // Check the elementCode generated and identify if it needs to be modified to handle
  // Identify the elementId that is located between the quotes
  var elementId = elementCode.match(/"(.*?)"/)[1];
  if (((elementId.indexOf("DatePicker") > -1) || (elementId.indexOf("CheckBox") > -1) || (elementId.indexOf("ImagePicker") > -1))
    && (propertyName == 'Text')) {
    code = 'document.getElementById(\"' + 'label' + elementId + '\")';
  }
  else {
    code = elementCode;
  }

  // Switch block
  // Cases will handle the property name changes that is identified
  switch (propertyName.toLowerCase()) {
    case 'text':
      if (typeName == 'TextBox' || typeName == "DatePicker" || typeName == "ListPicker" || typeName == "PasswordTextBox") {
        code += '.value = ' + bodyCode + ';';
      // else if (typeName == 'CheckBox')
      //   code += '.input = ' + bodyCode + ';';
      }
      else {
        code += '.innerHTML = ' + bodyCode + ';';
      }
      break;
    case 'backgroundcolor':
      code += '.style.backgroundColor = ' + bodyCode + ';';
      break;
    case 'height':
      code += '.style.height = \"' + bodyCode + 'px\";';
      break;
    case 'heightpercent':
      code += '.style.height = \"' + bodyCode + 'vh\";';
      break;
    case 'width':
      code += '.style.width = \"' + bodyCode + 'px\";';
      break;
    case 'widthpercent':
      code += '.style.width = \"' + bodyCode + 'vh\";';
      break;
    case 'fontbold':
      code += '.style.fontWeight = (' + bodyCode + ' ? \"bold\" : \"normal\");';
      break;
    case 'fontitalic':
      code += '.style.fontStyle = (' + bodyCode + ' ? \"italic\" : \"normal\");';
      break;
    case 'fontsize':
      code += '.style.fontSize = \"' + bodyCode + 'px\";';
      break;
    case 'textcolor':
      code += '.style.color = ' + bodyCode + ';';
      break;
    case 'visible':
      code += '.style.visibility = (' + bodyCode + ' ? \"visible\" : \"hidden\");';
      break;
    case 'hasmargins':
      code += 'style.margin = (' + bodyCode + ' ? \"1px\" : \"0px\");';
      break;
    case 'checked':
      code += '.checked = ' + bodyCode + ';';
      break;
    case 'enabled':
      code += '.disabled = ' + '!' + bodyCode + ';';
      break;
    case 'hint':
      code += '.placeholder = ' + bodyCode + ';';
      break;
    case 'elementsfromstring':

      var newCode = 'var values = ' + bodyCode + '.split(\",\");';
      newCode += 'var listItems = \"\";';
      newCode += 'for(var i=0; i<values.length; i++){';
      newCode += 'listItems = listItems + \"<li>\" + values[i] + \"</li>\";}';
      newCode += '' + code + '.innerHTML = listItems;';
      code = newCode;
      break;
    case 'minvalue':
      code += '.min = ' + bodyCode + ';';
      break;
    case 'maxvalue':
      code += '.max = ' + bodyCode + ';';
      break;
    case 'thumbposition':
      code += '.value = ' + bodyCode + ';';
      break;
    //case 'image':
    //  code += '.src = ' + bodyCode + ';';
    //case 'showfeedback':
    //  code += '.showfeedback = ' + bodyCode + ';';
    // case 'multiline':
    //   code += "";
    //   break;
    case 'volume':
      code += '.volume = ' + bodyCode + ';';
      break;
    case 'source':
      code += '.src = ' + bodyCode + ';';
      break;
    case 'fullscreen':
      code += '';
      break;
    default:
      break;
  }
  return code;
}

/**
 * Returns a function that takes no arguments, generates JavaScript code for setting a generic component's
 * property and returns the code string.
 *
 * @param {String} instanceName
 * @returns {Function} property setter code generation function with instanceName bound in
 */
Blockly.JavaScript.genericSetproperty = function() {
  var propertyName = this.getFieldValue("PROP");
  // var propType = this.getPropertyObject(propertyName).type;
  // var assignLabel = Blockly.JavaScript.YAIL_QUOTE + this.typeName + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_QUOTE + propertyName;
  // var code = Blockly.JavaScript.YAIL_SET_AND_COERCE_COMPONENT_TYPE_PROPERTY
  //   // TODO(hal, andrew): check for empty socket and generate error if necessary
  //   + Blockly.JavaScript.valueToCode(this, 'COMPONENT', Blockly.JavaScript.ORDER_NONE)
  //   + Blockly.JavaScript.YAIL_SPACER
  //   + assignLabel
  //   + Blockly.JavaScript.YAIL_SPACER;
  // // TODO(hal, andrew): check for empty socket and generate error if necessary
  // code = code.concat(Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE /*TODO:?*/));
  // code = code.concat(Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //   + propType + Blockly.JavaScript.YAIL_CLOSE_COMBINATION);

  var elementCode = Blockly.JavaScript.valueToCode(this, 'COMPONENT', Blockly.JavaScript.ORDER_NONE);
  var bodyCode = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE /*TODO:?*/);

  // Call helper function
  var code = Blockly.JavaScript.setPropertyHelper(elementCode, propertyName, bodyCode, this.typeName);

  return code;
}


/**
 * Returns a function that takes no arguments, generates JavaScript code for getting a component's
 * property value and returns a 2-element array containing the property getter code string and the
 * operation order Blockly.JavaScript.ORDER_ATOMIC.
 *
 * @param {String} instanceName
 * @returns {Function} property getter code generation function with instanceName bound in
 */
Blockly.JavaScript.getproperty = function(instanceName) {
  var propertyName = this.getFieldValue("PROP");
  // var propType = this.getPropertyObject(propertyName).type;

  // Initialize code to call this block instance in the dom
  var elementCode = 'document.getElementById(\"' + this.instanceName + '\")';

  // Call helper function
  var code = '(' + Blockly.JavaScript.getPropertyHelper(elementCode, propertyName, this.typeName) + ')';

  // var code = Blockly.JavaScript.YAIL_GET_PROPERTY
  //   + Blockly.JavaScript.YAIL_QUOTE
  //   + this.getFieldValue("COMPONENT_SELECTOR")
  //   + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_QUOTE
  //   + propertyName
  //   + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

/**
 *  Helper function that returns code for getting a property of a block
 *  @param {String} elementCode   : The current element to set the property for
 *  @param {String} propertyName  : Name of the property to set
 *  @param {String} typeName      : The type name of the current block
 *  @return {String} code         : Code to be generated based on property
 */
Blockly.JavaScript.getPropertyHelper = function(elementCode, propertyName, typeName) {

  var code;

  // Check the elementCode generated and identify if it needs to be modified to handle
  // Identify the elementId that is located between the quotes
  var elementId = elementCode.match(/"(.*?)"/)[1];
  if (((elementId.indexOf("DatePicker") > -1) || (elementId.indexOf("CheckBox") > -1) || (elementId.indexOf("ImagePicker") > -1))
    && (propertyName == 'Text')) {
    code = 'document.getElementById(\"' + 'label' + elementId + '\")';
  }
  else {
    code = elementCode;
  }

  // Switch block
  // Cases will handle the property name changes that is identified
  switch (propertyName.toLowerCase()) {
    case 'text':
      if (typeName == 'TextBox' || typeName == "DatePicker" || typeName == "ListPicker" || typeName == "PasswordTextBox") {
        code += '.value';
      // else if (typeName == 'CheckBox')
      //   code += '.input';
      }
      else {
        code += '.innerHTML';
      }
      break;
    case 'backgroundcolor':
      code += '.style.backgroundColor';
      break;
    case 'height':
      code += '.style.height';
      break;
    case 'width':
      code += '.style.width';
    case 'fontbold':
      code += '.style.fontWeight == \"bold\"';
      break;
    case 'fontitalic':
      code += '.style.fontStyle == \"italic\"';
      break;
    case 'fontsize':
      code += '.style.fontSize';
      break;
    case 'textcolor':
      code += '.style.color';
      break;
    case 'visible':
      code += '.style.visibility == \"visible\"';
      break;
    case 'hasmargins':
      code += '.style.margin != \"0px\"';
      break;
    case 'checked':
      code += '.checked';
      break;
    case 'enabled':
      code += '.disabled != true';
      break;
    case 'hint':
      code += '.placeholder';
      break;
    case 'minvalue':
      code += '.min';
      break;
    case 'maxvalue':
      code += '.max';
      break;
    case 'thumbposition':
      code += '.value';
      break;

    case 'image':
      code += ".value";
      break;
    //case 'image':
    //  code += '.src';
    //case 'showfeedback' :
    //  code += '.showfeedback';
    // case 'multiline':
    //   code += '';
    //   break;
    case 'source':
      code += '.src';
      break;
    case 'isplaying':
      code += '.paused != true';
      break;
    default:
      break;
  }
  return code;
}

/**
 * Returns a function that takes no arguments, generates JavaScript code for getting a generic component's
 * property value and returns a 2-element array containing the property getter code string and the
 * operation order Blockly.JavaScript.ORDER_ATOMIC.
 *
 * @param {String} instanceName
 * @returns {Function} property getter code generation function with instanceName bound in
 */
Blockly.JavaScript.genericGetproperty = function(typeName) {
  var propertyName = this.getFieldValue("PROP");
  // var propType = this.getPropertyObject(propertyName).type;
  // var code = Blockly.JavaScript.YAIL_GET_COMPONENT_TYPE_PROPERTY
  //   // TODO(hal, andrew): check for empty socket and generate error if necessary
  //   + Blockly.JavaScript.valueToCode(this, 'COMPONENT', Blockly.JavaScript.ORDER_NONE)
  //   + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_QUOTE
  //   + this.typeName
  //   + Blockly.JavaScript.YAIL_SPACER
  //   + Blockly.JavaScript.YAIL_QUOTE
  //   + propertyName
  //   + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Initialize the code for the element
  var elementCode = Blockly.JavaScript.valueToCode(this, 'COMPONENT', Blockly.JavaScript.ORDER_NONE);
  var code = '(' + Blockly.JavaScript.getPropertyHelper(elementCode, propertyName, this.typeName) + ')';

  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

/**
 * Returns a function that takes no arguments, generates JavaScript to get the value of a component
 * object, and returns a 2-element array containing the component getter code and the operation
 * order Blockly.JavaScript.ORDER_ATOMIC.
 *
 * @param {String} instanceName
 * @returns {Function} component getter code generation function with instanceName bound in
 */
Blockly.JavaScript.component_component_block = function() {
  // Return the dom element of this block
  return ['document.getElementById(\"' + this.instanceName + '\")', Blockly.JavaScript.ORDER_ATOMIC];

  // return [Blockly.JavaScript.YAIL_GET_COMPONENT + this.getFieldValue("COMPONENT_SELECTOR") + Blockly.JavaScript.YAIL_CLOSE_COMBINATION,
  //         Blockly.JavaScript.ORDER_ATOMIC];
}
