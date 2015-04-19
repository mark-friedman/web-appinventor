/**
 * Visual Blocks Language
 *
 * Copyright 2012 Massachusetts Institute of Technology. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview List generators for Blockly, modified for App Inventor
 * @author fraser@google.com (Neil Fraser)
 * @author andrew.f.mckinney@gmail.com (Andrew F. McKinney)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

/**
 * Lyn's History:
 * [lyn, 10/27/13] Modified for loop index variables to begin with YAIL_LOCAL_VAR_TAG (currently '$').
 *     At least on Kawa-legal first character is necessary to ensure AI identifiers
 *     satisfy Kawa's identifier rules.
 * [lyn, 01/15/2013] Added do_then_return, eval_but_ignore, and nothing.
 * [lyn, 12/27/2012] Made code generation of forRange and forEach consistent with parameter change.
 */

'use strict';

goog.provide('Blockly.JavaScript.control');

Blockly.JavaScript['controls_if'] = function() {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.JavaScript.valueToCode(this, 'IF' + n,
      Blockly.JavaScript.ORDER_NONE) || 'false';

  var branch = Blockly.JavaScript.statementToCode(this, 'DO' + n) || 'false';
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= this.elseifCount_; n++) {
    argument = Blockly.JavaScript.valueToCode(this, 'IF' + n,
        Blockly.JavaScript.ORDER_NONE) || 'false';
    branch = Blockly.JavaScript.statementToCode(this, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (this.elseCount_) {
    branch = Blockly.JavaScript.statementToCode(this, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

// [lyn, 01/15/2013] Edited to make consistent with removal of "THEN-DO" and "ELSE-DO"
Blockly.JavaScript['controls_choose'] = function() {
  // Choose.
  var test = Blockly.JavaScript.valueToCode(this, 'TEST', Blockly.JavaScript.ORDER_NONE)  || Blockly.JavaScript.YAIL_FALSE;
  var thenReturn = Blockly.JavaScript.valueToCode(this, 'THENRETURN', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  var elseReturn = Blockly.JavaScript.valueToCode(this, 'ELSERETURN', Blockly.JavaScript.ORDER_NONE)  || Blockly.JavaScript.YAIL_FALSE;

  var code =
    '(function() { ' +
      'if ' + test + ' { ' + 'return ' + thenReturn + ';} ' + 'else { ' + 'return ' + elseReturn + ';} ' +
    '})()';

  // var code = Blockly.JavaScript.YAIL_IF + test
  //            + Blockly.JavaScript.YAIL_SPACER +  thenReturn
  //            + Blockly.JavaScript.YAIL_SPACER +  elseReturn
  //            + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [code,Blockly.JavaScript.ORDER_ATOMIC];
};

// [lyn, 12/27/2012]
Blockly.JavaScript['controls_forEach'] = function() {
  // For each loop.
  // var emptyListCode = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "make-yail-list" + Blockly.JavaScript.YAIL_SPACER;
  // emptyListCode += Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;

  // emptyListCode += Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // emptyListCode += Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // emptyListCode += Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "make a list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;


  // var loopIndexName = Blockly.JavaScript.YAIL_LOCAL_VAR_TAG + this.getFieldValue('VAR');

  var loopIndexName = Blockly.JavaScript.YAIL_LOCAL_VAR_TAG + this.getFieldValue('VAR');
  var listCode = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE); // || emptyListCode;
  var bodyCode = Blockly.JavaScript.statementToCode(this, 'DO', Blockly.JavaScript.ORDER_NONE); // ||  Blockly.JavaScript.YAIL_FALSE;

  // Wrap the for-each loop within a function and execute
  var code = '(' +
    'function() { ' +
      listCode + '.forEach(function(' + loopIndexName + ') { ' +
        bodyCode +
          '}) ' +
      '})()';

  return code;

  // return Blockly.JavaScript.YAIL_FOREACH + loopIndexName + Blockly.JavaScript.YAIL_SPACER
  //        + Blockly.JavaScript.YAIL_BEGIN + bodyCode + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER
  //        + listCode + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
};

// [lyn, 12/27/2012]
Blockly.JavaScript['controls_forRange'] = function() {
  // For range loop.
  var loopIndexName = Blockly.JavaScript.YAIL_LOCAL_VAR_TAG + this.getFieldValue('VAR');
  var startCode = Blockly.JavaScript.valueToCode(this, 'START', Blockly.JavaScript.ORDER_NONE) || 0;
  var endCode = Blockly.JavaScript.valueToCode(this, 'END', Blockly.JavaScript.ORDER_NONE) || 0;
  var stepCode = Blockly.JavaScript.valueToCode(this, 'STEP', Blockly.JavaScript.ORDER_NONE) || 0;
  var bodyCode = Blockly.JavaScript.statementToCode(this, 'DO', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;

  // Eliminate the '$' character from the fetched index name
  loopIndexName = loopIndexName.substr(1);

  // Create the for loop to be used
  var code =
      'for (var '  + loopIndexName + '=' + startCode + '; ' +
        loopIndexName + '<=' + endCode + ';' +
        loopIndexName +  '=' + loopIndexName + '+' + stepCode + ') { ' +
        bodyCode +
      '}';

  return code;
};

Blockly.JavaScript['for_lexical_variable_get'] = function() {
  return Blockly.JavaScript.lexical_variable_get.call(this);
}

Blockly.JavaScript['controls_while'] = function() {
  // While condition.
  var test = Blockly.JavaScript.valueToCode(this, 'TEST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  var toDo = Blockly.JavaScript.statementToCode(this, 'DO') || Blockly.JavaScript.YAIL_FALSE;
  // var code = Blockly.JavaScript.YAIL_WHILE + test + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_BEGIN + toDo + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Create the while loop
  var code =
    'while (' + test + ') {' +
      toDo +
    '}';

  return code;
};

// [lyn, 01/15/2013] Added
Blockly.JavaScript['controls_do_then_return'] = function() {
  var stm = Blockly.JavaScript.statementToCode(this, 'STM', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  var value = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  // var code = Blockly.JavaScript.YAIL_BEGIN + stm + Blockly.JavaScript.YAIL_SPACER + value + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Create the function
  var code = '(' +
    'function() { ' +
      stm +
      'return ' + value + ';'
    '})()';

  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

 // [lyn, 01/15/2013] Added
// adding 'ignored' here is only for the printout in Do-It.  The value will be ignored because the block shape
// has no output
Blockly.JavaScript['controls_eval_but_ignore'] = function() {
  var toEval = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  // var code = Blockly.JavaScript.YAIL_BEGIN + toEval + Blockly.JavaScript.YAIL_SPACER + '"ignored"' + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // Wrap the string to be evaluated and return nothing
  var code = '(' +
    'function() { ' +
      toEval + '; ' +
    '})()';

  return code;
};

// // [lyn, 01/15/2013] Added
// Blockly.JavaScript['controls_nothing'] = function() {
//   return ['*the-null-value*', Blockly.JavaScript.ORDER_NONE];
// };



// SCREEN MANAGEMENT
// The DOMs local storage will be utilized to maintain key-values
// -> window.sessionStorage

Blockly.JavaScript['controls_openAnotherScreen'] = function() {
  // Open another screen

  // argument which represents the new screen address
  var argument0 = Blockly.JavaScript.valueToCode(this, 'SCREEN', Blockly.JavaScript.ORDER_NONE) || null;
  argument0 = '\"' + argument0.substring(1,argument0.length - 1) + '.html' + '\"';

  // Lambda function to handle storage and screen switch
  // Function has no returns
  var code = '(function() { ' +

    // If the current screen is the first screen, create the stack
    'if (window.sessionStorage.getItem(\"_stack\") == undefined) { ' +
    '   var screenStack = []; ' +
    '   screenStack.push(document.title + \".html\"); ' +

    '}  else { ' +
    // Fetched value from the key is returned as a string so split it and convert to array
    '   screenStack = window.sessionStorage.getItem(\"_stack\"); ' +
    '   screenStack = screenStack.split(\",\"); ' +
    '   screenStack.push(document.title + \".html\"); ' +
    '} ' +

    // This key for the stack is hard coded in and must change in all functions that use it
    // if a change to it is implemented
    'window.sessionStorage.setItem(\"_stack\", screenStack); ' +

    // Do the screen switch
    'document.location.href = ' + argument0 + '; ' +

  '})()';

  return code;
};

Blockly.JavaScript['controls_openAnotherScreenWithStartValue'] = function() {
  // Open another screen with start value
  var argument0 = Blockly.JavaScript.valueToCode(this, 'SCREENNAME', Blockly.JavaScript.ORDER_NONE) || null;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'STARTVALUE', Blockly.JavaScript.ORDER_NONE) || null;

  // Open another screen
  // This routine will also create a global value that is passed to this screen
  // The variable is stored in the sessionStorage
  var targetScreenName = argument0;
  argument0 = '\"' + argument0.substring(1,argument0.length - 1) + '.html' + '\"';

  // Lambda function to handle storage and screen switch
  // Function has no returns
  var code = '(function() { ' +

    // Store the variable into storage using the targetScreen's name as an identifier
    'window.sessionStorage.setItem(' + targetScreenName + '+ \"StartKey\", ' + argument1 + '); ' +

    // If the current screen is the first screen, create the stack
    'if (window.sessionStorage.getItem(\"_stack\") == undefined) { ' +
    '   var screenStack = []; ' +
    '   screenStack.push(document.title + \".html\"); ' +

    '}  else { ' +
    // Fetched value from the key is returned as a string so split it and convert to array
    '   screenStack = window.sessionStorage.getItem(\"_stack\"); ' +
    '   screenStack = screenStack.split(\",\"); ' +
    '   screenStack.push(document.title + \".html\"); ' +
    '} ' +

    // This key for the stack is hard coded in and must change in all functions that use it
    // if a change to it is implemented
    'window.sessionStorage.setItem(\"_stack\", screenStack); ' +

    // Do the screen switch
    'document.location.href = ' + argument0 + '; ' +

  '})()';

  return code;
};

Blockly.JavaScript['controls_getStartValue'] = function() {
  // Fetches the start value for this screen
  var code = '(function() { ' +
    'var startValue = window.sessionStorage.getItem(document.title + \"StartKey\"); ' +
    'return startValue; ' +
  '})();';

  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['controls_closeScreen'] = function() {
  // Close screen

  // Lambda function to handle the screen closing
  // Screen closing represents the back button and if current screen is the first screen
  // the window will close
  // Function has no returns
  var code = '(function() { ' +

    // Wipe the key-values that is pertinent for this current screen because it is closing
    'window.sessionStorage.removeItem(document.title + \"StartKey\"); ' +
    'window.sessionStorage.removeItem(document.title + \"ReturnKey\"); ' +

    // Fetch the stored stack
    'screenStack = window.sessionStorage.getItem(\"_stack\"); ' +

    // Check if this screen is the very first screen
    'if (screenStack == undefined) { ' +
    ' window.close(); ' +
    ' return; ' +
    '} ' +

    // Check if this current screen is the last screen
    'if (screenStack.length == 0) { ' +
    ' window.close(); ' +
    ' return; ' +
    '} ' +

    // It is not the very first screen so a value exists for the key, split the return
    'screenStack = screenStack.split(\",\"); ' +

    // Fetch the previous screens URL
    'var targetScreen = screenStack.pop(); ' +

    // Push the remaining history back into storage
    'window.sessionStorage.setItem(\"_stack\", screenStack); ' +

    // Do the screen switch
    'document.location.href = targetScreen; ' +

  '})()';

  return code;
};

Blockly.JavaScript['controls_closeScreenWithValue'] = function() {
  // Close screen with value
  var argument0 = Blockly.JavaScript.valueToCode(this, 'SCREEN', Blockly.JavaScript.ORDER_NONE) || null;

   var code = '(function() { ' +

    // Wipe the key-values that is pertinent for this current screen because it is closing
    'window.sessionStorage.removeItem(document.title + \"StartKey\"); ' +
    'window.sessionStorage.removeItem(document.title + \"ReturnKey\"); ' +

    // Fetch the stored stack
    'screenStack = window.sessionStorage.getItem(\"_stack\"); ' +

    // Check if this screen is the very first screen
    'if (screenStack == undefined) { ' +
    ' window.close(); ' +
    ' return; ' +
    '} ' +

    // Check if this current screen is the last screen
    'if (screenStack.length == 0) { ' +
    ' window.close(); ' +
    ' return; ' +
    '} ' +

    // It is not the very first screen so a value exists for the key, split the return
    'screenStack = screenStack.split(\",\"); ' +

    // Fetch the previous screens URL
    'var targetScreen = screenStack.pop(); ' +

    // Push a return variable identifiable by the previous screen
    'targetScreenName = targetScreen.substring(0, targetScreen.length-5); ' +
    'window.sessionStorage.setItem(targetScreenName + \"ReturnKey\", ' + argument0 + '); ' +

    // Push the remaining history back into storage
    'window.sessionStorage.setItem(\"_stack\", screenStack); ' +

    // Do the screen switch
    'document.location.href = targetScreen; ' +

  '})()';

  return code;
};

Blockly.JavaScript['controls_closeApplication'] = function() {
  // Close application
  var code = 'window.close();';
  return code;
};

// Blockly.JavaScript['controls_getPlainStartText'] = function() {
//   // Get plain start text
//   var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "get-plain-start-text" + Blockly.JavaScript.YAIL_SPACER;
//   code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
//   code = code + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
//   code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
//   code = code + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
//   code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "get plain start text" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
//   return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
// };

// Blockly.JavaScript['controls_closeScreenWithPlainText'] = function() {
//   // Close screen with plain text
//   var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
//   var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "close-screen-with-plain-text" + Blockly.JavaScript.YAIL_SPACER;
//   code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
//   code = code + argument0 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
//   code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
//   code = code + "text" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
//   code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "close screen with plain text" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
//   return code;
// };
