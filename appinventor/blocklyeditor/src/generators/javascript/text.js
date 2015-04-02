// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @license
 * @fileoverview Color blocks yail generators for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.JavaScript.text');

Blockly.JavaScript['text'] = function() {
  // Text value.
  var code = Blockly.JavaScript.quote_(this.getFieldValue('TEXT'));
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_join'] = function() {
  // Create a string made up of elements of any type..
  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-append"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;

  // Declare the code variable to append to
  var code = '(';
  // Iterate through the number of elements to append together 
  for(var i=0;i<this.itemCount_;i++) {
    var argument = Blockly.JavaScript.valueToCode(this, 'ADD' + i, Blockly.JavaScript.ORDER_NONE) || "\"\"";
    if (i == this.itemCount_ - 1)
      code = code + argument + ')';
    else
      code = code + argument + '+';
  }

  // code += Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // for(var i=0;i<this.itemCount_;i++) {
  //   code += "text" + Blockly.JavaScript.YAIL_SPACER;
  // }
  // code += Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "join"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_length'] = function() {
  // // String length
  var argument = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-length"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "length"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  var code = argument + '.length';
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_isEmpty'] = function() {
  // Is the string null?
  var argument = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-empty?"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "is text empty?"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  var code = '(' + argument + '.length' + ' === 0 ? true : false)';
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_compare'] = function() {
  // Basic compare operators
  var mode = this.getFieldValue('OP');
  var prim = Blockly.JavaScript.text_compare.OPERATORS[mode];
  // var operator1 = prim[0];
  // var operator2 = prim[1];
  var order = prim[2];
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT1', order) || "\"\"";
  var argument1 = Blockly.JavaScript.valueToCode(this, 'TEXT2', order) || "\"\"";

  // Switch Block for possible operators
  var op;
  switch (mode) {
    case 'LT':
      op = '<'; 
      break;
    case 'GT':
      op = '>';
      break;
    case 'EQUAL':
      op = '===';
      break;
    default:
      break;
  }
  code = '(' + argument0 + op + argument1 + ')';

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + operator1
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + operator2
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_compare'].OPERATORS = {
  LT: ['string<?', 'text<', Blockly.JavaScript.ORDER_NONE],
  GT: ['string>?', 'text>', Blockly.JavaScript.ORDER_NONE],
  EQUAL: ['string=?', 'text=', Blockly.JavaScript.ORDER_NONE]
};

Blockly.JavaScript['text_trim'] = function() {
  // String trim
  var argument = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var code = argument + '.trim()';
  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-trim"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "trim"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_changeCase'] = function() {
  // String change case.
  var mode = this.getFieldValue('OP');
  var tuple = Blockly.JavaScript.text_changeCase.OPERATORS[mode];
  // var operator1 = tuple[0];
  // var operator2 = tuple[1];
  var order = tuple[2];
  var argument = Blockly.JavaScript.valueToCode(this, 'TEXT', order) || "\"\"";

  // Switch block for the 2 different case changes
  var op;
  switch (mode) {
    case 'UPCASE':
      op = '.toUpperCase()';
      break;
    case 'DOWNCASE':
      op = '.toLowerCase()';
      break;
    default:
      break;
  }

  var code = argument + op;

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + operator1
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + operator2
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_changeCase'].OPERATORS = {
  UPCASE: ['string-to-upper-case', 'upcase', Blockly.JavaScript.ORDER_NONE],
  DOWNCASE: ['string-to-lower-case', 'downcase', Blockly.JavaScript.ORDER_NONE]
};

Blockly.JavaScript.text_starts_at = function() {
  // String starts at
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var argument1 = Blockly.JavaScript.valueToCode(this, 'PIECE', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  
  // Finds the index where argument1 starts in argument0, 0 if nonexistent
  // 1 denotes the starting of the string 
  var code = argument0 + '.indexOf(' + argument1 + ') + 1';

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-starts-at"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "starts at"
      // + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_contains'] = function() {
  // String contains.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var argument1 = Blockly.JavaScript.valueToCode(this, 'PIECE', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  
  // Finds if argument0 contains argument1
  var code = '('+ argument0 + '.indexOf(' + argument1 + ') > -1)';

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-contains"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "contains"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_split'] = function() {
  // String split operations.
  // Note that the type of arg2 might be text or list, depending on the dropdown selection
  var mode = this.getFieldValue('OP');
  var tuple = Blockly.JavaScript.text_split.OPERATORS[mode];
  var operator1 = tuple[0];
  var operator2 = tuple[1];
  var order = tuple[2];
  var arg2Type = tuple[3];


  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var argument1 = Blockly.JavaScript.valueToCode(this, 'AT', Blockly.JavaScript.ORDER_NONE) || 1;
  
  // Default delimiter if no argument is passed in
  if (argument1 == 1)
    argument1 = ' ';

  // Switch block for the modes
  // SPLIT and SPLITATFIRST take argument1 as a text string
  // SPLITATANY and SLITATFIRSTOFANY take argument1 as a list of strings
  var code;
  switch (mode) {
    case 'SPLIT':
      if (arg2Type === 'text') 
        code = argument0 + '.split(' + argument1 + ')';
      break;
    case 'SPLITATFIRST':
      if (arg2Type === 'text')
        code = '(' +
          'function(text, at) { ' +
            'var idx = text.indexOf(at); ' + 
            'var first = text.substr(0,idx); ' + 
            'var second = text.substr(idx+1); ' + 
            'return [first, second]; ' +
          '})' + '(' + argument0 + ',' + argument1 + ')';
      break;
    case 'SPLITATANY':
      if (arg2Type === 'list')
        code = '(' +
          'function(text, delimiters) { ' +
            'var tokens = text.split(new RegExp(delimiters.join(\"|\"), \"g\")); ' +
            'var soln = []; ' +
            'for (var i = 0; i < tokens.length; i++) { ' +
              'if (tokens[i]) ' +
                'soln.push(tokens[i]); ' +
            '} ' +
            'return soln; ' +
          '})' + '(' + argument0 + ',' + argument1 + ')';
      break;
    case 'SPLITATFIRSTOFANY':
      if (arg2Type === 'list')
        code = '(' +
          'function(text, at) { ' + 
            'var idx = Number.MAX_VALUE; ' + 
            'for (var i = 0; i < at.length; i++) { ' +
              'if (text.indexOf(at[i]) < idx) ' +
                'idx = text.indexOf(at[i]); ' +
            '}; ' +
            'var first = text.substr(0,idx); ' + 
            'var second = text.substr(idx+1); ' + 
            'if (idx != Number.MAX_VALUE) ' +
              'return [first,second]; ' + 
            'return text; ' + 
          '})' + '(' + argument0 + ',' + argument1 + ')';      
      break;
    default:
      break;
  }

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + operator1
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text" +  Blockly.JavaScript.YAIL_SPACER + arg2Type
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + operator2
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, order ];
};

Blockly.JavaScript['text_split'].OPERATORS = {
  SPLITATFIRST : [ 'string-split-at-first', 'split at first',
      Blockly.JavaScript.ORDER_ATOMIC, 'text' ],
  SPLITATFIRSTOFANY : [ 'string-split-at-first-of-any',
      'split at first of any', Blockly.JavaScript.ORDER_ATOMIC, 'list' ],
  SPLIT : [ 'string-split', 'split', Blockly.JavaScript.ORDER_ATOMIC, 'text' ],
  SPLITATANY : [ 'string-split-at-any', 'split at any', Blockly.JavaScript.ORDER_ATOMIC, 'list' ]
};

Blockly.JavaScript['text_split_at_spaces'] = function() {
  // split at spaces
  var argument = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\""; 
  var code = argument + '.split(\" \")';

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-split-at-spaces"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "split at spaces"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_segment'] = function() {
  // Create string segment
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var argument1 = Blockly.JavaScript.valueToCode(this, 'START', Blockly.JavaScript.ORDER_NONE) || 1;
  var argument2 = Blockly.JavaScript.valueToCode(this, 'LENGTH', Blockly.JavaScript.ORDER_NONE) || 1;
  
  var code = argument0 + '.substr(' + argument1 + '-1' + ',' + argument1 + '+' + argument2 + '-2' + ')';

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-substring"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1
  //     + Blockly.JavaScript.YAIL_SPACER + argument2
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text number number"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "segment"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['text_replace_all'] = function() {
  // String replace with segment
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var argument1 = Blockly.JavaScript.valueToCode(this, 'SEGMENT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var argument2 = Blockly.JavaScript.valueToCode(this, 'REPLACEMENT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  
  var code = '(' +
    'function(arg0, arg1, arg2) { ' +
      'var len = arg1.length; ' +
      'var idx = arg0.indexOf(arg1); ' +
      'var code = arg0.substr(0,idx) + arg2 + arg0.substr(idx+len); ' +
      'return code; ' +
    '})' + '(' + argument0 + ',' + argument1 + ',' + argument2 + ')';

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "string-replace-all"
  //     + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1
  //     + Blockly.JavaScript.YAIL_SPACER + argument2
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text text text"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "replace all"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

// Blockly.JavaScript['obsufcated_text'] = function() {
//   // Deobsfucate the TEXT input argument
//   var setupObsfucation = function(input, confounder) {
//     // The algorithm below is also implemented in scheme in runtime.scm
//     // If you change it here, you have to change it there!
//     // Note: This algorithm is like xor, if applied to its output
//     // it regenerates it input.
//     var acc = [];
//     // First make sure the confounder is long enough...
//     while (confounder.length < input.length) {
//       confounder += confounder;
//     }
//     for (var i = 0; i < input.length; i++) {
//       var c = (input.charCodeAt(i) ^ confounder.charCodeAt(i)) & 0xFF;
//       var b = (c ^ input.length - i) & 0xFF;
//       var b2 = ((c >> 8) ^ i) & 0xFF;
//       acc.push(String.fromCharCode((b2 << 8 | b) & 0xFF));
//     }
//     return acc.join('');
//   }
//   var input = this.getFieldValue('TEXT');
//   var argument = Blockly.JavaScript.quote_(setupObsfucation(input, this.confounder));
//   var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "text-deobsfucate"
//       + Blockly.JavaScript.YAIL_SPACER;
//   code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION
//       + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
//       + argument + Blockly.JavaScript.YAIL_SPACER
//       + Blockly.JavaScript.quote_(this.confounder) + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
//   code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
//       + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "text text"
//       + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
//   code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "deobsfucate text"
//       + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
//   return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
// };
