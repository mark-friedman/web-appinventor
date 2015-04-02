// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @license
 * @fileoverview Lists blocks yail generators for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.JavaScript.lists');

// Blockly.JavaScript.emptyListCode = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "make-yail-list" + Blockly.JavaScript.YAIL_SPACER;
// Blockly.JavaScript.emptyListCode += Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
// Blockly.JavaScript.emptyListCode += Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
// Blockly.JavaScript.emptyListCode += Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
// Blockly.JavaScript.emptyListCode += Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "make a list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

Blockly.JavaScript.emptyListCode = "[]";


Blockly.JavaScript['lists_create_with'] = function() {

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "make-yail-list" + Blockly.JavaScript.YAIL_SPACER;
  // code += Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  var itemsAdded = 0;
  var code = "[";
  for(var i=0;i<this.itemCount_;i++) {
    var argument = Blockly.JavaScript.valueToCode(this, 'ADD' + i, Blockly.JavaScript.ORDER_NONE) || null;
    if(argument != null){
      if (itemsAdded + 1 == this.itemCount_ ){
        code += argument;
      } else {
        code += argument + ",";
      }
      itemsAdded++;
    }
  }
  code += "]";
  // code += Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // for(var i=0;i<itemsAdded;i++) {
  //   code += "any" + Blockly.JavaScript.YAIL_SPACER;
  // }
  // code += Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code += Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "make a list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.JavaScript['lists_select_item'] = function() {
  // Select from list an item.

  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'NUM', Blockly.JavaScript.ORDER_NONE) || 0;
  
  var substring = argument0.substring(1, argument0.length - 1);
  var array = substring.split(",");

  var code = array[argument1];

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-get-item" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + argument1 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list number" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "select list item" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_replace_item'] = function() {
  // Replace Item in list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'NUM', Blockly.JavaScript.ORDER_NONE) || 0;
  var argument2 = Blockly.JavaScript.valueToCode(this, 'ITEM', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  var code = "";

  if (argument0[1] == "$"){
    code = argument0 + "[" + argument1 + "]= " + argument2 + ";";
  } 
  else {
    // assuming it is an array represented as a list

    code =  "var array = " + argument0 + ";\n";
    code +=  "array[" + argument1 +"] = " + argument2 + ";"
  }

  
  
  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-set-item!" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1
  // code = code + Blockly.JavaScript.YAIL_SPACER + argument2 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list number any" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "replace list item" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return code;
};

Blockly.JavaScript['lists_remove_item'] = function() {
  // Remove Item in list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'INDEX', Blockly.JavaScript.ORDER_NONE) || 1;
  
  var code = "var list = " + argument0 + ";\n" + "list.splice(" + argument1 + ", 1);";

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-remove-item!" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + argument1 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list number" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "remove list item" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return code;
};

Blockly.JavaScript['lists_insert_item'] = function() {
  // Insert Item in list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'INDEX', Blockly.JavaScript.ORDER_NONE) || 1;
  var argument2 = Blockly.JavaScript.valueToCode(this, 'ITEM', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  var code = "";


  if (argument0 == "[]"){
    // can't insert into a new element in an empty list
  }
  else if (argument0[1] == "$"){
    code = argument0 + ".splice(" + argument1 + ", 0, " + argument2+ ");";
  } else {
    code = "var list = " + argument0 + ";\n" + "list.splice(" + argument1 + ", 0, " + argument2+ ");";
  }


  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-insert-item!" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1;
  // code = code + Blockly.JavaScript.YAIL_SPACER + argument2 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list number any" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "insert list item" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return code;
};

Blockly.JavaScript['lists_length'] = function() {
  // Length of list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var code = "";


  
  if (argument0[1] == "$"){
    code = argument0 + ".length;";
  } else if (argument0 == "[]"){
    code = 0;
  } else {
    code = (argument0.match(/,/g) || []).length + 1;  
  }

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-length" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "length of list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_append_list'] = function() {
  // Append to list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST0', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'LIST1', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;


  var code = argument0 + ".concat(" + argument1 + ")";

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-append!" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument1 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "append to list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return code;
};

Blockly.JavaScript['lists_add_items'] = function() {
  // Add items to list.
  // TODO: (Andrew) Make this handle multiple items.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'ITEM', Blockly.JavaScript.ORDER_NONE) || 1;
  var itemsAdded;
  var code = "";

  // handles empty list
  if (argument0 == "[]"){
    code = Blockly.JavaScript.valueToCode(this, 'ITEM' + 0, Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
    code = "["+ code +"]";
  }

  // handles variables
  else if (argument0[1] == "$"){
    for(var i=0;i<this.itemCount_; i++){
      var argument = Blockly.JavaScript.valueToCode(this, 'ITEM' + i, Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
      code += argument0 + ".push(" + argument + ");\n";
    }
  } 
  // a generic list is passed
  else {
    var code = argument0.substring(0,argument0.length -1);

    for(var i=0;i<this.itemCount_; i++){
      var argument = Blockly.JavaScript.valueToCode(this, 'ITEM' + i, Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
      if (itemsAdded + 1 == this.itemCount_ ){
          code += argument;
      } else {
          code += "," + argument;
      }
      itemsAdded++;
    }
    code += "]";
  }

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-add-to-list!" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0 + Blockly.JavaScript.YAIL_SPACER;

  // for(var i=0;i<this.itemCount_;i++) {
  //   var argument = Blockly.JavaScript.valueToCode(this, 'ITEM' + i, Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  //   code += argument + Blockly.JavaScript.YAIL_SPACER;
  // }

  // code += Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list ";
  // for(var i=0;i<this.itemCount_;i++) {
  //   code += "any" + Blockly.JavaScript.YAIL_SPACER;
  // }
  // code += Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "add items to list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return code;
};

Blockly.JavaScript['lists_is_in'] = function() {
  // Is in list?.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'ITEM', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;

  var substring = argument1.substring(1, argument1.length - 1);
  var array = substring.split(",");

  var code = (array.indexOf(argument0) > -1);

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-member?" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + argument1 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "any list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "is in list?" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_position_in'] = function() {
  // Postion of item in list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'ITEM', Blockly.JavaScript.ORDER_NONE) || 1;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var code = "";

  // list is a variable
  if(argument0[1] == "$"){
    code = argument0 + ".indexOf(" + argument1 + ");";
  } else {

    // makes the string of the list into an array
    var substring = argument0.substring(1, argument0.length - 1);
    var array = substring.split(",");

    code = array.indexOf(argument1);
  }
  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-index" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + argument1 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "any list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "position in list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_pick_random_item'] = function() {
  // Pick random item
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  
  // gets length of array
  var len = (argument0.match(/,/g) || []).length + 1;  

  // makes the string of the list into an array
  var substring = argument0.substring(1, argument0.length - 1);
  var array = substring.split(",");
  
  // gets a random number to pick from the list
  var index = Math.floor((Math.random() * len) + 1);
  var code = array[index];

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-pick-random" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "pick random item" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_is_empty'] = function() {
  // Is the list empty?.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;

  var code = (argument0.match(/,/g) || []).length > 0;

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-empty?" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "is list empty?" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_copy'] = function() {
  // Make a copy of list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;

  var code = argument0;

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-copy" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "copy list" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_is_list'] = function() {
  // Create an empty list.
  // TODO:(Andrew) test whether thing is var or text or number etc...
  var argument0 = Blockly.JavaScript.valueToCode(this, 'ITEM', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;

  var code = "Array.isArray(" + argument0 + ");";

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list?" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "any" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "is a list?" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_to_csv_row'] = function() {
  // Make a csv row from list.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  
  var code = "[" + argument0 + "];";

  // var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-to-csv-row" + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  // code = code + argument0;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  // code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  // code = code + "list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  // code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "list to csv row" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_to_csv_table'] = function() {
  // Make a csv table from list
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
  var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-to-csv-table" + Blockly.JavaScript.YAIL_SPACER;
  code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  code = code + argument0;
  code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  code = code + "list" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "list to csv table" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_from_csv_row'] = function() {
  // Make list from csv row.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-from-csv-row" + Blockly.JavaScript.YAIL_SPACER;
  code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  code = code + argument0;
  code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  code = code + "text" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "list from csv row" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.JavaScript['lists_from_csv_table'] = function() {
  // Make list from csv table.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "\"\"";
  var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-list-from-csv-table" + Blockly.JavaScript.YAIL_SPACER;
  code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
  code = code + argument0;
  code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
  code = code + "text" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
  code = code + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "list from csv table" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

 Blockly.JavaScript['lists_lookup_in_pairs'] = function() {
   // Lookup in pairs in list of lists (key, value).
   var argument0 = Blockly.JavaScript.valueToCode(this, 'KEY', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_FALSE;
   var argument1 = Blockly.JavaScript.valueToCode(this, 'LIST', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.emptyListCode;
   var argument2 = Blockly.JavaScript.valueToCode(this, 'NOTFOUND', Blockly.JavaScript.ORDER_NONE) || Blockly.JavaScript.YAIL_NULL;
   var code = Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE + "yail-alist-lookup" + Blockly.JavaScript.YAIL_SPACER;
   code = code + Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR + Blockly.JavaScript.YAIL_SPACER;
   code = code + argument0 + Blockly.JavaScript.YAIL_SPACER + argument1 + Blockly.JavaScript.YAIL_SPACER + argument2 + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
   code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + Blockly.JavaScript.YAIL_OPEN_COMBINATION;
   code = code + "any list any" + Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;
   code = code + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + "lookup in pairs" + Blockly.JavaScript.YAIL_DOUBLE_QUOTE + Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
   return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
 };
