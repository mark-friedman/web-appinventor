// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @license
 * @fileoverview Color blocks yail generators for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.JavaScript.color');

Blockly.JavaScript.color = function() {
  // Convert hex value to numeric value
  var val = window.parseInt("0x" + this.getFieldValue('COLOR').substr(1));
  // var code = -1 * (window.Math.pow(16,6) - window.parseInt("0x" + this.getFieldValue('COLOR').substr(1)));
  var code = (val).toString(16);
  while (code.length < 6) {
    code = '0' + code;
  }
  code = '#' + code;
  var code = '"' + code + '"';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['color_black'] = function() {
  // return ['"#000000"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_blue'] = function() {
  // return ['"#0000FF"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_cyan'] = function() {
  // return ['"#00FFFF"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_dark_gray'] = function() {
  // return ['"#A9A9A9"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_gray'] = function() {
  // return ['"#808080"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_green'] = function() {
  // return ['"#008000"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_light_gray'] = function() {
  // return ['"#D3D3D3"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_magenta'] = function() {
  // return ['"#FF00FF"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_pink'] = function() {
  // return ['"#FFC0CB"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_red'] = function() {
  // return ['"#FF0000"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_white'] = function() {
  // return ['"#FFFFFF"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_orange'] = function() {
  // return ['"#FFA500"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};

Blockly.JavaScript['color_yellow'] = function() {
  // return ['"#FFFF00"', Blockly.JavaScript.ORDER_ATOMIC];
  return Blockly.JavaScript.color.call(this);
};


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

Blockly.JavaScript['color_make_color'] = function() {
  var blackList = [0,0,0];
  // var blackList = "(call-yail-primitive make-yail-list (*list-for-runtime* 0 0 0)  '( any any any)  \"make a list\")";
  var argument0 = Blockly.JavaScript.valueToCode(this, 'COLORLIST', Blockly.JavaScript.ORDER_NONE) || blackList;
  var rgb = eval(argument0);
  var code;
  if (rgb.length == 0){
    code = blackList;
  } else {
    code = '\"' + rgbToHex(rgb[0],rgb[1],rgb[2]) + '\"';
  }

  if (argument0 == "[]"){
    rgb = blackList;
  } else {
    rgb = eval(argument0);
  }

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "make-color" + Blockly.JavaScript.YAIL_SPACER;
  // code += Blockly.JavaScript.YAIL_OPEN_COMBINATION
  //     + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER
  //     + argument0 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code += Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE
  //     + Blockly.JavaScript.YAIL_OPEN_COMBINATION + "list"
  //     + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code += Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "make-color"
  //     + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['color_split_color'] = function() {
  var argument0 = Blockly.JavaScript.valueToCode(this, 'COLOR', Blockly.JavaScript.ORDER_NONE) || "#000000";
  // Identify if the argument is a hex value,
  // if it is not - it has to be the result from a getter so just take the 3 values in it

  var code = '(function() { ' +
    'if (eval(\'' + argument0 + '\') == "" ){ ' +
      'return null;' +
    '}' +
    'if (eval(\'' + argument0 + '\')[0] != \"#\") { ' +
      'rgb = ' + argument0 + '.match(/[0-9]+/g); ' +
      'return \"[\" + rgb[0] + \",\" + rgb[1] + \",\" + rgb[2] + \"]\";' +
    '} else { ' +
      'var bigint = parseInt(eval(\'' + argument0 + '\').substr(1)' + ', 16); ' +
      'var r = (bigint >> 16) & 255; ' +
      'var g = (bigint >> 8) & 255; ' +
      'var b = bigint & 255; ' +
      'return \"[\" + r + \",\" + g + \",\" + b + \"]\";' +
    '} ' +
  '})()';
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};
