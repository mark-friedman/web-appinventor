// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @license
 * @fileoverview variables blocks yail generators for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.JavaScript.variables');


/**
 * Lyn's History:
 * [lyn, 10/27/13] Modified global variable names to begin with YAIL_GLOBAL_VAR_TAG (currently 'g$')
 *     and local variables to begin with YAIL_LOCAL_VAR_TAG (currently '$').
 *     At least on Kawa-legal first character is necessary to ensure AI identifiers
 *     satisfy Kawa's identifier rules. And the global 'g$' tag is necessary to
 *     distinguish globals from procedures (which use the 'g$' tag).
 * [lyn, 12/27/2012] Abstract over handling of param/local/index prefix
 */

// Variable Blocks
/**
 * The identifier rules specified in Blockly.LexicalVariable.checkIdentifier *REQUIRE*
 * a nonempty prefix (here, "tag") whose first character is a legal Kawa identifier character
 * in the character set [a-zA-Z_\!\$%&\?\^\*~\/>\=<]
 * Note this set does not include the characters [@.-\+], which are special in Kawa
 *  and cannot begin identifiers.
 *
 * Why use '$'?  Because $ means money, which is "valuable", and "valuable" sounds like "variable"!
 */
Blockly.JavaScript.YAIL_GLOBAL_VAR_TAG = 'g$';
Blockly.JavaScript.YAIL_LOCAL_VAR_TAG = '$'; // consider changing $

// Global variable definition block
Blockly.JavaScript['global_declaration'] = function() {
  var name = Blockly.JavaScript.YAIL_GLOBAL_VAR_TAG + this.getFieldValue('NAME');
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE) || '0';
  // we don't use "code = VAR name = argument0;" so we can
  // take advantage of global declaration in local environments
  var code = name + "=" + argument0 + ";";

  // doesn't return anything; only runs "code"
  return code;
};

// Global variable getter block
Blockly.JavaScript['lexical_variable_get'] = function() {
  var code = "";
  var name = this.getFieldValue('VAR');
  name = Blockly.JavaScript.getVariableName(name);
  
  return [ name, Blockly.JavaScript.ORDER_ATOMIC ];
};

// Global variable setter block
Blockly.JavaScript['lexical_variable_set'] = function() {
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_NONE) || '0';
  var name = this.getFieldValue('VAR');
  var scopeAndName = Blockly.JavaScript.setVariableScopeAndName(name);
  var scope = scopeAndName[0];
  name = scopeAndName[1];
  var code = scope + name + " = " + argument0 + ";";
  return code;
};

// [lyn, 12/27/2012] Handle prefixes abstractly
Blockly.JavaScript['getVariableName'] = function(name){
  var pair = Blockly.unprefixName(name);
  var prefix = pair[0];
  var unprefixedName = pair[1];
  if (prefix === Blockly.globalNamePrefix) { 
    name = Blockly.JavaScript.YAIL_GLOBAL_VAR_TAG + unprefixedName;
  } else {
    name = Blockly.JavaScript.YAIL_LOCAL_VAR_TAG + unprefixedName;
  }
  return name;
}

// [lyn, 12/27/2012] New
Blockly.JavaScript['setVariableScopeAndName'] = function(name){ // change to: setVariableName //return: name
  var scope = "";
  var pair = Blockly.unprefixName(name);
  var prefix = pair[0];
  var unprefixedName = pair[1];
  if (prefix === Blockly.globalNamePrefix) { // use stm?true:false
    name = Blockly.JavaScript.YAIL_GLOBAL_VAR_TAG + unprefixedName;
  } else {
    name = Blockly.JavaScript.YAIL_LOCAL_VAR_TAG + unprefixedName;
    scope = "var ";
  }
  return [scope,name];
}

Blockly.JavaScript['local_declaration_statement'] = function() {
  return Blockly.JavaScript.local_variable(this,false);
}

Blockly.JavaScript['local_declaration_expression'] = function() {
  return Blockly.JavaScript.local_variable(this,true);
}













Blockly.JavaScript['local_variable'] = function(block,isExpression) {
  /*
  var code = Blockly.JavaScript.YAIL_LET;
  code += Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_SPACER;

  for(var i=0;block.getFieldValue("VAR" + i);i++){
    code += Blockly.JavaScript.YAIL_OPEN_COMBINATION + Blockly.JavaScript.YAIL_LOCAL_VAR_TAG 
      + (Blockly.usePrefixInJavaScript ? "local_" : "") + block.getFieldValue("VAR" + i);

    code += Blockly.JavaScript.YAIL_SPACER 
      + ( Blockly.JavaScript.valueToCode(block, 'DECL' + i, Blockly.JavaScript.ORDER_NONE) || '0' );

    code += Blockly.JavaScript.YAIL_CLOSE_COMBINATION + Blockly.JavaScript.YAIL_SPACER;

  }
  code += Blockly.JavaScript.YAIL_SPACER +  Blockly.JavaScript.YAIL_CLOSE_COMBINATION;

  // [lyn, 01/15/2013] Added to fix bug in local declaration expressions:
  if(isExpression){
    if(!block.getInputTargetBlock("RETURN")){
      code += Blockly.JavaScript.YAIL_SPACER +  "0";
    } else {
      code += Blockly.JavaScript.YAIL_SPACER +  Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_NONE);
    }
  } else {
    code += Blockly.JavaScript.YAIL_SPACER +  Blockly.JavaScript.statementToCode(block, 'STACK', Blockly.JavaScript.ORDER_NONE);
  }
  code += Blockly.JavaScript.YAIL_SPACER +  Blockly.JavaScript.YAIL_CLOSE_COMBINATION;
  if(!isExpression){
    return code;
  } else {
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  }
  
  */
  ///*

  var code = "(function";
  var parameters = "(";
  var values = "(";

  for(var i=0;block.getFieldValue("VAR" + i);i++){
    parameters += Blockly.JavaScript.YAIL_LOCAL_VAR_TAG + block.getFieldValue("VAR" + i) + ",";
    values += ( Blockly.JavaScript.valueToCode(block, 'DECL' + i, Blockly.JavaScript.ORDER_NONE) || '0' ) + ",";
  }  

  parameters = parameters.substring(0, parameters.length - 1) + ")"; // due to the extra comma, we add this unused parameter
  values = values.substring(0, values.length - 1) + ")"; // value doesn't matter

  code += parameters + "{ ";

  if(isExpression){
    if(!block.getInputTargetBlock("RETURN")){
      code += ""; // do nothing
    } else {
      code += "return" + Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_NONE);
    }
  } else {
    code += Blockly.JavaScript.statementToCode(block, 'STACK', Blockly.JavaScript.ORDER_NONE);
  }

  code += " })" + values;

  if(!isExpression){
    return code;
  } else {
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  }
  //*/
};
