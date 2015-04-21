// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @license
 * @fileoverview Procedure yail generators for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.JavaScript.procedures');

/**
 * Lyn's History:
 * [lyn, 10/29/13] Fixed bug in handling parameters of zero-arg procedures.
 * [lyn, 10/27/13] Modified procedure names to begin with YAIL_PROC_TAG (currently 'p$')
 *     and parameters to begin with YAIL_LOCAL_VAR_TAG (currently '$').
 *     At least on Kawa-legal first character is necessary to ensure AI identifiers
 *     satisfy Kawa's identifier rules. And the procedure 'p$' tag is necessary to
 *     distinguish procedures from globals (which use the 'g$' tag).
 * [lyn, 01/15/2013] Edited to remove STACK (no longer necessary with DO-THEN-RETURN)
 */

Blockly.JavaScript.YAIL_PROC_TAG = 'p$'; // See notes on this in generators/yail/variables.js

// Generator code for procedure call with return
// [lyn, 01/15/2013] Edited to remove STACK (no longer necessary with DO-THEN-RETURN)
Blockly.JavaScript['procedures_defreturn'] = function() {
  var argPrefix = Blockly.JavaScript.YAIL_LOCAL_VAR_TAG
                  + (Blockly.usePrefixInJavaScript && this.arguments_.length != 0 ? "param_" : "");
  var args = this.arguments_.map(function (arg) {return argPrefix + arg;}).join(' ');
  args = args.split(" ");
  args.toString();
  var procName = Blockly.JavaScript.YAIL_PROC_TAG + this.getFieldValue('NAME');
  var returnVal = Blockly.JavaScript.valueToCode(this, 'RETURN', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  // var code = Blockly.JavaScript.YAIL_DEFINE + Blockly.JavaScript.YAIL_OPEN_COMBINATION + procName
  //     + Blockly.JavaScript.YAIL_SPACER + args + Blockly.JavaScript.YAIL_CLOSE_COMBINATION
  //     + Blockly.JavaScript.YAIL_SPACER + returnVal + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Define the procedure and its return
  var code = procName + ' = ' +
    'function(' + args + ') { ' +
      'return ' + returnVal + ';' +
    '};';

  return code;
};

// Generator code for procedure call with no return
Blockly.JavaScript['procedures_defnoreturn'] = function() {
  var argPrefix = Blockly.JavaScript.YAIL_LOCAL_VAR_TAG
                  + (Blockly.usePrefixInJavaScript && this.arguments_.length != 0 ? "param_" : "");
  var args = this.arguments_.map(function (arg) {return argPrefix + arg;}).join(' ');
  args = args.split(" ");
  args.toString();
  var procName = Blockly.JavaScript.YAIL_PROC_TAG + this.getFieldValue('NAME');
  var body = Blockly.JavaScript.statementToCode(this, 'STACK', Blockly.JavaScript.ORDER_NONE)  || Blockly.JavaScript.YAIL_FALSE;
  // var code = Blockly.JavaScript.YAIL_DEFINE + Blockly.JavaScript.YAIL_OPEN_COMBINATION + procName
  //     + Blockly.JavaScript.YAIL_SPACER + args + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + body
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Define the procedure
  var code = procName + ' = ' +
    'function(' + args + ') { ' +
      body +
    '};';

  return code;
};

Blockly.JavaScript['procedure_lexical_variable_get'] = function() {
  return Blockly.JavaScript.lexical_variable_get.call(this);
}

//call the do return in control category
Blockly.JavaScript['procedures_do_then_return'] = function() {
  return Blockly.JavaScript.controls_do_then_return.call(this);
}

// Generator code for procedure call with no return
Blockly.JavaScript['procedures_callnoreturn'] = function() {
  var procName = Blockly.JavaScript.YAIL_PROC_TAG + this.getFieldValue('PROCNAME');
  var argCode = [];
  for ( var x = 0;this.getInput("ARG" + x); x++) {
    argCode[x] = Blockly.JavaScript.valueToCode(this, 'ARG' + x, Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  }
  // var code = Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_GET_VARIABLE + procName
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER + argCode.join(' ')
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Generate code to execute the procedure
  var code = procName + '(' + argCode + ');';
  return code;
};

// Generator code for procedure call with return
Blockly.JavaScript['procedures_callreturn'] = function() {
  var procName = Blockly.JavaScript.YAIL_PROC_TAG + this.getFieldValue('PROCNAME');
  var argCode = [];
  for ( var x = 0; this.getInput("ARG" + x); x++) {
    argCode[x] = Blockly.JavaScript.valueToCode(this, 'ARG' + x, Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  }
  // var code = Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_GET_VARIABLE + procName
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER + argCode.join(' ')
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Generate code to execute the procedure
  var code = procName + '(' + argCode + ')';
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};
