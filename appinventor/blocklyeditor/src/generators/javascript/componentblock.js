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
      JSEvent = 'onclick = ';
      break;
    case 'GotFocus':
      JSEvent = 'onmouseover = ';
      break;
    case 'LostFocus':
      JSEvent = 'onmouseout = ';
      break;
    case 'Changed':
      JSEvent = 'onchange = ';
      break;
    case 'TouchDown':
      JSEvent = 'onmousedown = ';
      break;
    case 'TouchUp':
      JSEvent = 'onmouseup = ';
      break;
    case 'AfterDateSet':
      JSEvent = 'onchange = ';
      break;
    case 'PositionChanged':
      JSEvent = 'onchange = ';
      break;
    case 'AfterPicking':
      JSEvent = 'onchange = ';
      break;
    case 'BeforePicking':
      JSEvent = 'onclick = ';
      break;
    case 'Completed':
      JSEvent = 'onended = ';
      break;
    case 'AfterTimeSet':
      JSEvent = 'addEventListener(\"change\", ';
      break;
    case 'OtherPlayerStarted':
      JSEvent = 'addEventListener(\"_otherPlayerStarted\",';
      break;
    default:
      break;
  }

  //Concatenate event handler functionality
  code = code + JSEvent;

  //Fetch the code for the body
  code = code + ' function() {';

  var body = Blockly.JavaScript.statementToCode(this, 'DO', Blockly.JavaScript.ORDER_NONE);

  //TODO: handle deactivated block
  if(body == ""){
    body = null;
  }

  code = code + body;

  //Finalize
  if (this.eventName == 'AfterTimeSet' || this.eventName == 'OtherPlayerStarted') {
    code = code + '});';
  } else {
    code = code + '};';
  }

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
    args.push(Blockly.JavaScript.valueToCode(methodBlock, 'ARG' + x, Blockly.JavaScript.ORDER_NONE));
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
        // Hacky way to drop the decimal if a decimal value is passed in
        var year = parseInt(args[0]).toString();
        var month = parseInt(args[1]).toString();
        var day = parseInt(args[2]).toString();

        // Array to handle the number of days possible in specified month
        // Leap year is factored in later on
        var dayLim = [31,28,31,30,31,30,31,31,30,31,30,31];

        // YEAR - '0001' to '275760'
        if (parseInt(year) <= 0) {
          year = "0001";
        } else if (year.length < 4) {
          while (year.length < 4) {
            year = "0" + year;
          }
        } else if (year.length > 6 || parseInt(year) > 275760) {
          year = "0001";
        };

        // Check if its a leap year
        // If it is change dayLim for february
        // Logic from: https://support.microsoft.com/en-us/kb/214019
        yearVal = parseInt(year);
        if (((yearVal % 4 == 0) && (yearVal % 100 != 0)) || (yearVal % 400 == 0)) {
          dayLim[1] = 29;
        }

        // MONTH - '01' to '12'
        if (parseInt(month) <= 0) {
          month = "01";
        } else if (month.length == 1) {
          month = "0" + month;
        } else if (month.length > 2 || parseInt(month) > 12) {
          month = "01";
        };

        // DAY - '01' to dayLim
        if (parseInt(day) <= 0) {
          day = "01";
        } else if (day.length == 1) {
          day = "0" + day;
        } else if (day.length > 2 || parseInt(day) > dayLim[parseInt(month)-1]) {
          day = "01";
        };

        var date = year + '-' + month + '-' + day;
        date = date.trim();
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").value = \"' + date + '\"); ' +
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
      // LAUNCH PICKER CURRENTLY NOT WORKING
      if (methodName == 'LaunchPicker') {
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").onclick());' +
        '})()';

      // Sets the time
      } else if (methodName == 'SetTimeToDisplay') {
        // Hacky way to drop the decimal
        var hour = parseInt(args[0]).toString();
        var minute = parseInt(args[1]).toString();

        // HOURS - '00' to '23'
        if (parseInt(hour) < 0) {
          hour = "00";
        } else if (hour.length == 1) {
          hour = "0" + hour;
        } else if (hour.length > 2 || parseInt(hour) > 23) {
          hour = "00";
        }

        // MINUTES - '00' to '59'
        if (parseInt(minute) < 0) {
          minute = "00";
        } else if (minute.length == 1) {
          minute = "0" + minute;
        } else if (minute.length > 2 || parseInt(minute) > 59) {
          minute = "00";
        }

        var time = hour + ':' + minute;
        time = time.trim();
        var code = '(function() { ' +
          '(document.getElementById(\"' + name + '\").value = \"' + time + '\"); ' +
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
          'playStarted(' + name + '); ' +
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
 *  Helper function that returns the appropriate document.getElementById
 *  That is, it determines whether to get the component or its label.
 *  @param {String} elementId   : The current element to set the property for
 *  @param {Integer} useLabel   : 0 or 1, (false or true)
 *  @return {String} code       : the appropriate "document.getElementById"
 */
Blockly.JavaScript.codeHelper = function(elementId, useLabel) {
  var code = 'document.getElementById(\"';
  // var elementId = elementCode.match(/"(.*?)"/)[1];
  // if element has a label, address it
  /*if ((useLabel == 1) &&
      (elementId.indexOf("DatePicker") > -1) ||
      (elementId.indexOf("ImagePicker") > -1) ||
      (elementId.indexOf("ListPicker") > -1) ||
      (elementId.indexOf("TimePicker") > -1) ||
      (elementId.indexOf("CheckBox") > -1)) {
  */
  if ((useLabel == 1) &&
      ((elementId.indexOf("DatePicker")  > -1) ||
       (elementId.indexOf("ImagePicker") > -1) ||
       (elementId.indexOf("ListPicker")  > -1) ||
       (elementId.indexOf("TimePicker")  > -1) ||
       (elementId.indexOf("CheckBox")    > -1))  ) {
    code += 'label_';
  }
  code += elementId + '\")';

  return code;
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

  // // Initialize code to call this block instance in the dom
  // var elementCode = 'document.getElementById(\"' + this.instanceName + '\")';

  // Call helper function
  var code = Blockly.JavaScript.setPropertyHelper(this.instanceName, propertyName, bodyCode, this.typeName);

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

  var code = '';
  // use code2 for labels
  // e.g., hidden should make hidden both the component and its label
  var code2 = '';
  // use code3 to store code for use in both code and code2
  var code3 = '';

  // Check if the body code is numeric, if it change keep it as numeric
  var isnum = /^\d+$/.test(bodyCode);
  if (isnum) {
    bodyCode = parseInt(bodyCode);
  }

  // // Check the elementCode generated and identify if it needs to be modified to handle
  // // Identify the elementId that is located between the quotes
  // var elementId = elementCode.match(/"(.*?)"/)[1];
  // if (((elementId.indexOf("DatePicker") > -1) || (elementId.indexOf("CheckBox") > -1)
  //   || (elementId.indexOf("ImagePicker") > -1) || (elementId.indexOf("TimePicker") > -1))
  //   && (propertyName == 'Text')) {
  //   code = 'document.getElementById(\"' + 'label' + elementId + '\")';
  // }
  // else {
  //   code = elementCode;
  // }

  // Switch block
  // Cases will handle the property name changes that is identified
  switch (propertyName.toLowerCase()) {
    case 'text':
      if (typeName == 'TextBox' || typeName == "PasswordTextBox") {
        code += Blockly.JavaScript.codeHelper(elementCode, 0);
        code += '.value = ' + bodyCode + ';';
      }
      else if (typeName == 'ListPicker') {
        code3 += Blockly.JavaScript.codeHelper(elementCode, 0);
        code += "var oldValueIndex = " + code3 + ".selectedIndex;";
        code += "var newValue = document.createElement(\"OPTION\");";
        code += "newValue.setAttribute(\"value\", " + bodyCode + ");";
        code += "var newValueText = document.createTextNode(" + bodyCode + ");";
        code += "newValue.appendChild(newValueText);";
        code += code3 + ".replaceChild(newValue, " + code3 + ".childNodes[oldValueIndex]);";
        code += code3 + ".selectedIndex = oldValueIndex;";
      }
      else {
        code += Blockly.JavaScript.codeHelper(elementCode, 1);
        code += '.innerHTML = ' + bodyCode + ';';
      }
      break;
    case 'backgroundcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.backgroundColor = ' + bodyCode + ';';
      break;
    case 'height':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.height = ';
      code += '(function() { ' +
        'var code = \"\"; ' +
        'var bodyVal = eval(\'' + bodyCode + '\'); ' +
        // Check if the value evaluated from the body code is numeric or a string with -px
        // Its numeric
        'if (!isNaN(bodyVal)) { ' +
        ' code += bodyVal + \"px\"; ' +
        // Should be a string otherwise
        '} else { ' +
        ' code += bodyVal; ' +
        '} ' +
        'return code; ' +
      '})();';
      break;
    case 'heightpercent':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.height = ';
      code += '(function() { ' +
        'var code = \"\"; ' +
        'var bodyVal = eval(\'' + bodyCode + '\'); ' +
        // Check if the value evaluated from the body code is numeric or a string with -px
        // Its numeric
        'if (!isNaN(bodyVal)) { ' +
        ' code += bodyVal + \"vh\"; ' +
        // Should be a string otherwise
        '} else { ' +
        ' code += bodyVal; ' +
        '} ' +
        'return code; ' +
      '})();';
      break;
    case 'width':
      // this isn't even supported by the design surface as of 4/17
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.width = ';
      code += '(function() { ' +
        'var code = \"\"; ' +
        'var bodyVal = eval(\'' + bodyCode + '\'); ' +
        // Check if the value evaluated from the body code is numeric or a string with -px
        // Its numeric
        'if (!isNaN(bodyVal)) { ' +
        ' code += bodyVal + \"px\"; ' +
        // Should be a string otherwise
        '} else { ' +
        ' code += bodyVal; ' +
        '} ' +
        'return code; ' +
      '})();';
      break;
    case 'widthpercent':
      // currently the designer surface adjusts the width of the picker
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.width = ';
      code += '(function() { ' +
        'var code = \"\"; ' +
        'var bodyVal = eval(\'' + bodyCode + '\'); ' +
        // Check if the value evaluated from the body code is numeric or a string with -px
        // Its numeric
        'if (!isNaN(bodyVal)) { ' +
        ' code += bodyVal + \"vh\"; ' +
        // Should be a string otherwise
        '} else { ' +
        ' code += bodyVal; ' +
        '} ' +
        'return code; ' +
      '})();';
      break;
    case 'fontbold':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.fontWeight = (' + bodyCode + ' ? \"bold\" : \"normal\");';
      break;
    case 'fontitalic':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.fontStyle = (' + bodyCode + ' ? \"italic\" : \"normal\");';
      break;
    case 'fontsize':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.fontSize = ';
      code += '(function() { ' +
        'var code = \"\"; ' +
        'var bodyVal = eval(\'' + bodyCode + '\'); ' +
        // Check if the value evaluated from the body code is numeric or a string with -px
        // Its numeric
        'if (!isNaN(bodyVal)) { ' +
        ' code += bodyVal + \"px\"; ' +
        // Should be a string otherwise
        '} else { ' +
        ' code += bodyVal; ' +
        '} ' +
        'return code; ' +
      '})();';
      break;
    case 'textcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.color = ' + bodyCode + ';';
      break;
    case 'visible':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code2 += Blockly.JavaScript.codeHelper(elementCode, 0);
      code3 += '.style.visibility = (' + bodyCode + ' ? \"visible\" : \"hidden\");';
      code += code3;
      code2 += code3;
      break;
    case 'hasmargins':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += 'style.margin = (' + bodyCode + ' ? \"1px\" : \"0px\");';
      break;
    case 'checked':
      code += Blockly.JavaScript.codeHelper(elementCode, 0);
      code += '.checked = ' + bodyCode + ';';
      break;
    case 'enabled':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code2 += Blockly.JavaScript.codeHelper(elementCode, 0);
      code3 += '.disabled = ' + '!' + bodyCode + ';';
      code += code3;
      code2 += code3;
      break;
    case 'hint':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.placeholder = ' + bodyCode + ';';
      break;
    case 'elementsfromstring':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      // add each list element as an item of array
      var newCode = 'var values = ' + bodyCode + '.split(\",\");';
      // initialize an HTML string to represent list
      newCode += 'var listItems = \"\";';
      // loop through array and add elements to list
      newCode += 'for(var i=0; i<values.length; i++){';
      newCode += 'listItems = listItems + \"<li>\" + values[i] + \"</li>\";}';
      newCode += '' + code + '.innerHTML = listItems;';
      code = newCode;
      break;
    case 'minvalue':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.min = ' + bodyCode + ';';
      break;
    case 'maxvalue':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.max = ' + bodyCode + ';';
      break;
    case 'thumbposition':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.value = ' + bodyCode + ';';
      break;
    case 'thumbenabled':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.disabled = ' + '!' + bodyCode + ';';
      break;
    case 'image':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.backgroundImage = \"url(\\\'assets/' + eval(bodyCode) + '\\\')\";';
      break;
    case 'picture':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.src = \"url(\\\'assets/' + eval(bodyCode) + '\\\')\";';
      break;
    case 'volume':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.volume = ' + eval(bodyCode / 100) + ';';
      break;
    case 'source':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.src = \"assets/' + eval(bodyCode) + '\";';
      break;
    case 'loop':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.loop = ' + bodyCode + ';';
      break;
    //TODO - GET FULL SCREEN WORKING
    case 'fullscreen':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      var elemCode = code;
      var fsCode = '(function() { ' +
      // Enter full screen mode based on bodyCode boolean result
        'var elem = ' + elemCode + '; ' +
        'if (' + bodyCode + ') { ' +
        ' if (elem.requestFullscreen) { ' +
        '   elem.requestFullscreen(); ' +
        ' } else if (elem.msRequestFullscreen) { ' +
        '   elem.msRequestFullscreen(); ' +
        ' } else if (elem.mozRequestFullScreen) { ' +
        '   elem.mozRequestFullScreen(); ' +
        ' } else if (elem.webkitRequestFullscreen) { ' +
        '   elem.webkitRequestFullscreen(); ' +
        ' } ' +

        '} else { ' +
        ' if (elem.exitFullscreen) { ' +
        '   elem.exitFullscreen(); ' +
        ' } else if (elem.msExitFullscreen) { ' +
        '   elem.msExitFullscreen(); ' +
        ' } else if (elem.mozExitFullScreen) { ' +
        '   elem.mozExitFullScreen(); ' +
        ' } else if (elem.webkitExitFullscreen) { ' +
        '   elem.webkitExitFullscreen(); ' +
        ' } ' +
        '} ' +
      '})();';
        code = fsCode;
        break;
    case 'numbersonly': //april13
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      if(bodyCode){
        code += '.type = \"number\";';
      } else{
        code += '.type = \"text\";';
      }
      break;
    //case 'showfeedback':
    //  code += Blockly.JavaScript.codeHelper(elementCode, 1);
    //  code += '.showfeedback = ' + bodyCode + ';';
    //  break;
    case 'multiline': //april13
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      // if input is true, change tag to textarea tag
      // if input is false, change tag to input tag
      // set oldChild to the current element
      var oldChild = code;
      code = 'var parent = ' + oldChild + '.parentNode;';
      //create a new element to be new child
      code += 'var newChild = document.createElement( ' ;
      code += bodyCode + ' ? \'textarea\' : \'input\'';
      code += ');';
      code += 'newChild.id = \"' + elementCode + '\";';
      code += 'parent.replaceChild(newChild,' + oldChild +');';
      break;
    case 'itembackgroundcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.backgroundColor = ' + bodyCode + ';';
      break;
    case 'itemtextcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.color = ' + bodyCode + ';';
      break;
    case 'title':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      //code += '.previousElementSibling.innerHTML = ' + bodyCode + ';';
      code += '.innerHTML = ' + bodyCode + ';';
      break;
    case 'selection':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      //select a child of an element
      //get the children
      code = 'var items = ' + elemCode + '.children;';
      //loop through children
      code += 'for (var i = 0; i<items.length; i++){';
      //if the child's innerHTML matches the input
      code += 'if(items[i].innerHTML==' + bodyCode + ')';
      //create new child that is a copy of old but with selected attribute as true
      code += '{ var newItem = document.createElement(\"option\");';
      code += 'newItem.innerHTML = items[i].innerHTML;';
      //set selected attribute to true
      code += 'newItem.selected = \"true\";';
      code += '' + elemCode + '.replaceChild(newItem,items[i]);';
      code += 'break;}};';
      break;
    case 'selectionindex':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      code = 'var items = ' + elemCode + '.children;';
      //create new child that is a copy of old but with selected attribute as true
      code += 'var newItem = document.createElement(\"option\");';
      //get HTML of item at input index for new element
      code += 'newItem.innerHTML = items[' + bodyCode + '-1].innerHTML;';
      code += 'newItem.selected = \"true\";';
      code += '' + elemCode + '.replaceChild';
      code += '(newItem,items[' + bodyCode + '-1]);';
      break;
    case 'elements':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      //sets new elements from an input list
      //items is a list of old child elements
      code = 'var items =' + elemCode + '.children;';
      code += 'var l = items.length;';
      //loop through old children and remove them
      code += 'for (var i=0; i<l; i++){';
      code += '' + elemCode + '.removeChild(items[i]);};';
      //loop through new children and set them as children
      code += 'for (var i=0; i<' + bodyCode + '.length; i++){';
      code += 'var newItem = document.createElement(\"option\");';
      code += 'newItem.innerHTML = ' + bodyCode + '[i];';
      code += '' + elemCode + '.appendChild(newItem);';
      code += '};';
      break;
    case 'textsize':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      code = 'var x = ' + elemCode + '.children;';
      code += 'for (i=0; i<x.length; i++){';
      code += 'x[i].style.fontSize = \"' + bodyCode +'%\";};';
      break;
    case 'animation':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 0);
      code = 'var stringInput = ' + bodyCode + '.toLowerCase();';
      //track parent in order to replace old image with clone
      code += 'var parent =' + elemCode + '.parentNode;';

      //clone eventually replaces animated image  
      code += 'var clone = ' + elemCode + '.cloneNode();';

      //following line is needed in order set the position
      code += elemCode + '.style.position = \"relative\";';
      
      //deal with moving cases
      code += 'if(stringInput!=\"stop\"){';
      // variable holds direction of motion; default is right
      code +=  'var direction = 1;';
      // variable holds speed; default is medium (not slow or fast)
      code +=   'var speed = 5;';
      //if moving left, switch signs of direction
      code +='if(stringInput.match(/left/)==\"left\"){';
      code +=     'direction = -1;};';
      // if slow, decrease speed
      code +='if(stringInput.match(/slow/)==\"slow\"){';
      code +=      'speed = 1;};';
      // if fast, increase speed
      code +='if(stringInput.match(/fast/)==\"fast\"){';
      code +=       'speed = 9;};';
      // initialize start position
      code += 'var x =  0 - (2*' + elemCode + '.width);';
      code += 'if(stringInput.match(/left/)==\"left\"){';
      code += 'x = screen.width ;};';
      
      //doAnimate moves image across screen
      code += 'var doAnimate = setInterval(function(){' ;
      code += 'x = x + (direction * speed);';
      code += elemCode + '.style.left = x + \"px\" ;},10);';

      //setTimeout stops the image from moving forever
      code += 'setTimeout(function(){clearInterval(doAnimate);';
      // replaceChild resets image
      code += 'parent.replaceChild(clone,'+elemCode+');},';
      code += '(10*(2*' + elemCode + '.width + screen.width)';
      code += '/speed));';

      //run command to animate image
      code += 'doAnimate;';

      code += '};';


      break;

    default:
      break;
  }
  return code + code2;
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
  var elementId = elementCode.match(/"(.*?)"/)[1];

  // Call helper function
  var code = Blockly.JavaScript.setPropertyHelper(elementId, propertyName, bodyCode, this.typeName);

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
  var code = '(' + Blockly.JavaScript.getPropertyHelper(this.instanceName, propertyName, this.typeName) + ')';

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

  var code = '';
  // maybe use code2 and code3 to handle width/height
  // of both the object and it's label.

  // Check the elementCode generated and identify if it needs to be modified to handle
  // Identify the elementId that is located between the quotes
  // var elementId = elementCode.match(/"(.*?)"/)[1];
  // if (((elementId.indexOf("DatePicker") > -1) || (elementId.indexOf("CheckBox") > -1) || (elementId.indexOf("ImagePicker") > -1))
  //   && ((propertyName == 'Text') || (propertyName == 'Image'))) {
  //   code = 'document.getElementById(\"' + 'label' + elementId + '\")';
  // }
  // else {
  //   code = elementCode;
  // }

  // Switch block
  // Cases will handle the property name changes that is identified
  switch (propertyName.toLowerCase()) {
    case 'text':
      if (typeName == 'TextBox' || typeName == "PasswordTextBox" || typeName == 'ListPicker') {
        code += Blockly.JavaScript.codeHelper(elementCode, 0);
        code += '.value';
      }
      else {
        code += Blockly.JavaScript.codeHelper(elementCode, 1);
        code += '.innerHTML';
      }
      break;
    case 'backgroundcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.backgroundColor';
      break;
    case 'height':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.height';
      break;
    case 'width':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.width';
      break;
    case 'fontbold':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.fontWeight == \"bold\"';
      break;
    case 'fontitalic':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.fontStyle == \"italic\"';
      break;
    case 'fontsize':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.fontSize';
      break;
    case 'textcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.color';
      break;
    case 'visible':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.visibility == \"visible\"';
      break;
    case 'hasmargins':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.margin != \"0px\"';
      break;
    case 'checked':
      code += Blockly.JavaScript.codeHelper(elementCode, 0);
      code += '.checked';
      break;
    case 'enabled':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.disabled != true';
      break;
    case 'hint':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.placeholder';
      break;
    case 'minvalue':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.min';
      break;
    case 'maxvalue':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.max';
      break;
    case 'thumbposition':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.value';
      break;
    case 'thumbenabled':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.disabled != true';
      break;
    case 'image':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.backgroundImage';
      // returns "url(blahblahblah/what_you_want)"
      // so we need to trim 'url(' and ')'
      code += '.slice(4,-1)';
      // now we trim the blahblahblah
      code += '.split(\"/\")';
      // and grab what_you_want
      code += '.slice(-1)[0]';
      break;
    case 'picture':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.src';
      // returns "http://blahblah/image"
      // so the following code pears the blahblah
      code += '.split(\"/\")';
      code += '.slice(-1)[0]';
      break;
    //case 'showfeedback' :
    //  code += Blockly.JavaScript.codeHelper(elementCode, 1);
    //  code += '.showfeedback';
    //  break;
    case 'source':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.src';
      break;
    case 'isplaying':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.paused != true';
      break;
    case 'loop':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.loop';
      break;
    case 'numbersonly':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.type';
      break;
    case 'multiline':
      var elementCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      code = '(function() { ';
      //get all elements with textarea tags
      code += 'var elements = document.getElementsByTagName(\"TEXTAREA\");';
      //loop through and see if their ids match the current element's id
      code += 'for (i=0; i<elements.length; i++){';
      code += 'if(elements[i].id==\"' + elementCode +'\"){';
      code +=  'return true;};';
      code +=  '}; return false;';
      code +=  '})()';
      break;
    case 'itembackgroundcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.backgroundColor';
      break;
    case 'itemtextcolor':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.style.color';
      break;
    case 'title':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      //code += '.previousElementSibling.innerHTML';
      code += '.innerHTML';
      break;
    case 'selection':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      code = '(function() {var items = ' + elemCode + '.children;';
      // loop through children and return the selected child
      code += 'for (var i = 0; i<items.length; i++){';
      code += 'if(items[i].selected){';
      code +=   'return items[i].innerHTML;}';
      code += '}; return \"\"})()';
      break;
    case 'selectionindex':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      code = '(function() {var items = ' + elemCode + '.children;';
      code += 'var index = 0;';
      // loop through children and return index of selected child
      code += 'while (index<items.length){';
      code += 'if(items[index].selected){';
      code +=   'return (index+1);}';
      code +=   'index++;';
      code += '}; return index;})()';
      break;
    case 'elements':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      code = '(function() {var items = ' + elemCode + '.children;';
      code += 'var elementList = [];';
      //loop through children and add each child to array (represents list)
      code += 'for (i=0; i<items.length; i++){';
      code +=   'elementList[i] = items[i].innerHTML;};';
      code += 'return elementList;})()';
      break;
    case 'textsize':
      var elemCode = Blockly.JavaScript.codeHelper(elementCode, 1);
      code = '(function() {var x = ' + elemCode + '.children;';
      code += 'if(x.length>0){var s = x[0].style.fontSize;';
      code += 'return s.substring(0,s.length-1);};';
      code += 'return 100;})()';
      break;
    case 'fullscreen':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      var elemCode = code;
      var fsCode = '(function() { ' +
        'var fsBool = ' +
        ' ((' + elemCode + ' == ' + elemCode + '.fullscreenElement) || ' +
        ' (' + elemCode + ' == ' + elemCode + '.webkitFullscreenElement) || ' +
        ' (' + elemCode + ' == ' + elemCode + '.mozFullScreenElement) || ' +
        ' (' + elemCode + ' == ' + elemCode + '.msFullscreenElement)); ' +
        'return fsBool; ' +
      '})()';
      code = fsCode;
      break;
    case 'hour':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.value.substring(0,2)';
      break;
    case 'minute':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.value.substring(3,5)';
      break;

    // Format expected from datepicker -> YYYY-MM-DD
    case 'year':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.value.substring(0,4)';
      break;
    case 'month':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.value.substring(5,7)';
      break;
    case 'day':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      code += '.value.substring(8,10)';
      break;
    case 'monthintext':
      code += Blockly.JavaScript.codeHelper(elementCode, 1);
      var elemCode = code;
      var dateCode = '(function() { ' +
        'var months = [\"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\"]; ' +
        'var monthIdx = parseInt(' + elemCode + '.value.substring(5,7)) - 1; ' +
        'var monthInText = months[monthIdx]; ' +
        'return monthInText; ' +
      '})()';
      code = dateCode;
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
  var elementId = elementCode.match(/"(.*?)"/)[1];

  var code = '(' + Blockly.JavaScript.getPropertyHelper(elementId, propertyName, this.typeName) + ')';

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
