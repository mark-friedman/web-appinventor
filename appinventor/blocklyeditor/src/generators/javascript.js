// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @fileoverview Helper functions for generating JavaScript for blocks.
 * @author andrew.f.mckinney@gmail.com (Andrew F. McKinney)
 * @author sharon@google.com (Sharon Perl)
 */

'use strict';

goog.provide('Blockly.JavaScript');

goog.require('Blockly.Generator');

Blockly.JavaScript = new Blockly.Generator('JavaScript');

/**
 * List of illegal variable names. This is not intended to be a security feature.  Blockly is
 * 100% client-side, so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 *
 * TODO: fill this in or remove it.
 * @private
 */
Blockly.JavaScript.RESERVED_WORDS_ = '';

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/JavaScript/Reference/Operators/Operator_Precedence
 */
Blockly.JavaScript.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.JavaScript.ORDER_NONE = 99;          // (...)

Blockly.JavaScript.YAIL_ADD_COMPONENT = "(add-component ";
Blockly.JavaScript.YAIL_ADD_TO_LIST = "(add-to-list ";
Blockly.JavaScript.YAIL_BEGIN = "(begin ";
Blockly.JavaScript.YAIL_CALL_COMPONENT_METHOD = "(call-component-method ";
Blockly.JavaScript.YAIL_CALL_COMPONENT_TYPE_METHOD = "(call-component-type-method ";
Blockly.JavaScript.YAIL_CALL_YAIL_PRIMITIVE = "(call-yail-primitive ";
Blockly.JavaScript.YAIL_CLEAR_FORM = "(clear-current-form)";
// The lines below are complicated because we want to support versions of the
// Companion older then 2.20ai2 which do not have set-form-name defined
Blockly.JavaScript.YAIL_SET_FORM_NAME_BEGIN = "(try-catch (let ((attempt (delay (set-form-name \"";
Blockly.JavaScript.YAIL_SET_FORM_NAME_END = "\")))) (force attempt)) (exception java.lang.Throwable 'notfound))";
Blockly.JavaScript.YAIL_CLOSE_COMBINATION = ")";
Blockly.JavaScript.YAIL_CLOSE_BLOCK = ")\n";

Blockly.JavaScript.YAIL_COMMENT_MAJOR = "// ";

Blockly.JavaScript.YAIL_COMPONENT_REMOVE = "(remove-component ";
Blockly.JavaScript.YAIL_COMPONENT_TYPE = "component";
Blockly.JavaScript.YAIL_DEFINE = "(def ";
Blockly.JavaScript.YAIL_DEFINE_EVENT = "(define-event ";
Blockly.JavaScript.YAIL_DEFINE_FORM = "(define-form ";
Blockly.JavaScript.YAIL_DO_AFTER_FORM_CREATION = "(do-after-form-creation ";
Blockly.JavaScript.YAIL_DOUBLE_QUOTE = "\"";
Blockly.JavaScript.YAIL_FALSE = "false";
Blockly.JavaScript.YAIL_FOREACH = "(foreach ";
Blockly.JavaScript.YAIL_FORRANGE = "(forrange ";
Blockly.JavaScript.YAIL_GET_COMPONENT = "(get-component ";
Blockly.JavaScript.YAIL_GET_PROPERTY = "(get-property ";
Blockly.JavaScript.YAIL_GET_COMPONENT_TYPE_PROPERTY = "(get-property-and-check  ";
Blockly.JavaScript.YAIL_GET_VARIABLE = "(get-var ";
Blockly.JavaScript.YAIL_AND_DELAYED = "(and-delayed ";
Blockly.JavaScript.YAIL_OR_DELAYED = "(or-delayed ";
Blockly.JavaScript.YAIL_IF = "(if ";
Blockly.JavaScript.YAIL_INIT_RUNTIME = "(init-runtime)";
Blockly.JavaScript.YAIL_INITIALIZE_COMPONENTS = "(call-Initialize-of-components";
Blockly.JavaScript.YAIL_LET = "(let ";
Blockly.JavaScript.YAIL_LEXICAL_VALUE = "(lexical-value ";
Blockly.JavaScript.YAIL_SET_LEXICAL_VALUE = "(set-lexical! ";
Blockly.JavaScript.YAIL_LINE_FEED = "\n";
Blockly.JavaScript.YAIL_NULL = "(get-var *the-null-value*)";
Blockly.JavaScript.YAIL_EMPTY_LIST = "'()";
Blockly.JavaScript.YAIL_OPEN_BLOCK = "(";
Blockly.JavaScript.YAIL_OPEN_COMBINATION = "(";
Blockly.JavaScript.YAIL_QUOTE = "'";
Blockly.JavaScript.YAIL_RENAME_COMPONENT = "(rename-component ";
Blockly.JavaScript.YAIL_SET_AND_COERCE_PROPERTY = "(set-and-coerce-property! ";
Blockly.JavaScript.YAIL_SET_AND_COERCE_COMPONENT_TYPE_PROPERTY = "(set-and-coerce-property-and-check! ";
Blockly.JavaScript.YAIL_SET_SUBFORM_LAYOUT_PROPERTY = "(%set-subform-layout-property! ";
Blockly.JavaScript.YAIL_SET_VARIABLE = "(set-var! ";
Blockly.JavaScript.YAIL_SET_THIS_FORM = "(set-this-form)\n ";
Blockly.JavaScript.YAIL_SPACER = " ";
Blockly.JavaScript.YAIL_TRUE = "true";
Blockly.JavaScript.YAIL_WHILE = "(while ";
Blockly.JavaScript.YAIL_LIST_CONSTRUCTOR = "*list-for-runtime*";

Blockly.JavaScript.SIMPLE_HEX_PREFIX = "&H";
Blockly.JavaScript.YAIL_HEX_PREFIX = "#x";

// permit leading and trailing whitespace for checking that strings are numbers
Blockly.JavaScript.INTEGER_REGEXP = "^[\\s]*[-+]?[0-9]+[\\s]*$";
Blockly.JavaScript.FLONUM_REGEXP = "^[\\s]*[-+]?([0-9]*)((\\.[0-9]+)|[0-9]\\.)[\\s]*$";


/**
 * Generate the JavaScript code for this blocks workspace, given its associated form specification.
 *
 * @param {String} formJson JSON string describing the contents of the form. This is the JSON
 *    content from the ".scm" file for this form.
 * @param {String} packageName the name of the package (to put in the define-form call)
 * @param {Boolean} forRepl  true if the code is being generated for the REPL, false if for an apk
 * @returns {String} the generated code if there were no errors.
 */
Blockly.JavaScript.getFormJavaScript = function(formJson, packageName, forRepl) {
  var jsonObject = JSON.parse(formJson);
  // TODO: check for JSON parse error
  var componentNames = [];
  var formProperties;
  var formName;
  var code = [];
  if (jsonObject.Properties) {
    formProperties = jsonObject.Properties;
    formName = formProperties.$Name;
  } else {
    throw "Cannot find form properties";
  }
  if (!formName) {
    throw "Unable to determine form name";
  }

  // if (!forRepl) {
  //   code.push(Blockly.JavaScript.getJavaScriptPrelude(packageName, formName));
  // }

  // Generate a Component mapping of the workspace
  // Mapping will contain Procedure blocks and/or Component blocks
  // These are the only possible "root" blocks available
  var componentMap = Blockly.Component.buildComponentMap([], [], false, false);

  // Fetch all the names of the components in the mapping
  // These names will be used to "access" the components
  // e.g. componentMap.components[componentNames[0]][0].eventName
  for (var comp in componentMap.components)
    componentNames.push(comp);

  // Beginning of JS
  code.push('window.onload = function() { ');

  // Generate JavaScript code for all the Global blocks in the map
  var globalBlocks = componentMap.globals;
  for (var i = 0, block; block = globalBlocks[i]; i++) {
    code.push(Blockly.JavaScript.blockToCode(block));
  }

  // Begin looking into the JSON - there may be children blocks
  // This section essentially generates all the JavaScript
  if (formProperties) {
    var sourceType = jsonObject.Source;
    if (sourceType == "Form") {
      code = code.concat(Blockly.JavaScript.getComponentLines(formName, formProperties, null /*parent*/,
        componentMap, false /*forRepl*/));
    } else {
      throw "Source type " + sourceType + " is invalid.";
    }

    // // Fetch all of the components in the form, this may result in duplicates
    // componentNames = Blockly.JavaScript.getDeepNames(formProperties, componentNames);
    // // Remove the duplicates
    // var uniqueNames = componentNames.filter(function(elem, pos) {
    //     return componentNames.indexOf(elem) == pos});
    // componentNames = uniqueNames;

    // // Add runtime initializations
    // code.push(Blockly.JavaScript.YAIL_INIT_RUNTIME);

    // if (forRepl) {
    //   code = Blockly.JavaScript.wrapForRepl(formName, code, componentNames);
    // }

    // TODO?: get rid of empty property assignments? I'm not convinced this is necessary.
    // The original code in YABlockCompiler.java attempts to do this, but it matches on
    // "set-property" rather than "set-and-coerce-property" so I'm not sure it is actually
    // doing anything. If we do need this, something like the call below might work.
    //
    // finalCode = code.join('\n').replace(/\\(set-property.*\"\"\\)\\n*/mg, "");
  }
  // Finalize and close
  code.push('};');

  code = code.join('\n');  // Blank line between each section.
  code = this.finish(code);
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  // return code.join('\n');  // Blank line between each section.
  console.log(code);
  return code;
};

Blockly.JavaScript.getDeepNames = function(componentJson, componentNames) {
  if (componentJson.$Components) {
    var children = componentJson.$Components;
    for (var i = 0, child; child = children[i]; i++) {
      componentNames.push(child.$Name);
      componentNames = Blockly.JavaScript.getDeepNames(child, componentNames);
    }
  }
  return componentNames;
}


/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.JavaScript.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.JavaScript.definitions_) {
    definitions.push(Blockly.JavaScript.definitions_[name]);
  }
  return definitions.join('\n\n') + '\n\n\n' + code;
};



/**
 * Generate the beginning JavaScript code for an APK compilation (i.e., not the REPL)
 *
 * @param {String} packageName  the name of the package for the app
 *     (e.g. "appinventor.ai_somebody.myproject.Screen1")
 * @param {String} formName  (e.g., "Screen1")
 * @returns {String} JavaScript code
 * @private
*/
Blockly.JavaScript.getJavaScriptPrelude = function(packageName, formName) {
 return "#|\n$Source $JavaScript\n|#\n\n"
     + Blockly.JavaScript.YAIL_DEFINE_FORM
     + packageName
     + Blockly.JavaScript.YAIL_SPACER
     + formName
     + Blockly.JavaScript.YAIL_CLOSE_BLOCK
     + "(require <com.google.youngandroid.runtime>)\n";
}

/**
 * Wraps JavaScript code for use in the REPL and returns the new code as an array of strings
 *
 * @param {String} formName
 * @param {Array} code  code strings to be wrapped
 * @param {Array} componentNames array of component names
 * @returns {Array} wrapped code strings
 * @private
 */
Blockly.JavaScript.wrapForRepl = function(formName, code, componentNames) {
  var replCode = [];
  replCode.push(Blockly.JavaScript.YAIL_BEGIN);
  replCode.push(Blockly.JavaScript.YAIL_CLEAR_FORM);
  if (formName != "Screen1") {
    // If this form is not named Screen1, then the REPL won't be able to resolve any references
    // to it or to any properties on the form itself (such as Title, BackgroundColor, etc) unless
    // we tell it that "Screen1" has been renamed to formName.
    // By generating a call to rename-component here, the REPL will rename "Screen1" to formName
    // in the current environment. See rename-component in runtime.scm.
    replCode.push(Blockly.JavaScript.getComponentRenameString("Screen1", formName));
  }
  replCode = replCode.concat(code);
  replCode.push(Blockly.JavaScript.getComponentInitializationString(formName, componentNames));
  replCode.push(Blockly.JavaScript.YAIL_CLOSE_BLOCK);
  return replCode;
}

/**
 * Return code to initialize all components in componentMap.
 *
 * @param {Array} componentNames array of names of components in the workspace
 * @returns {Array} code strings
 * @private
 */
Blockly.JavaScript.getComponentInitializationString = function(formName, componentNames) {
  var code = Blockly.JavaScript.YAIL_INITIALIZE_COMPONENTS;
  code += " " + Blockly.JavaScript.YAIL_QUOTE + formName;
  for (var i = 0, cName; cName = componentNames[i]; i++) {  // TODO: will we get non-component fields this way?
    if (cName != formName)                                  // Avoid duplicate initialization of the form
      code = code + " " + Blockly.JavaScript.YAIL_QUOTE + cName;
  }
  code = code + ")";
  return code;
}

/**
 * Generate JavaScript code for the component described by componentJson, and all of its child
 * components (if it has any). componentJson may describe a Form or a regular component. The
 * generated code includes adding each component to the form, as well as generating code for
 * the top-level blocks for that component.
 *
 * @param {String} formName
 * @param {String} componentJson JSON string describing the component
 * @param {String} parentName  the name of the component that contains this component (which may be
 *    its Form, for top-level components).
 * @param {Object} componentMap map from component names to the top-level blocks for that component
 *    in the workspace. See the Blockly.Component.buildComponentMap description for the structure.
 * @param {Boolean} forRepl true iff we're generating code for the REPL rather than an apk.
 * @returns {Array} code strings
 * @private
 */
Blockly.JavaScript.getComponentLines = function(formName, componentJson, parentName, componentMap,
  forRepl) {
  var code = [];
  var componentName = componentJson.$Name;
  // if (componentJson.$Type == 'Form') {
  //   code = Blockly.JavaScript.getFormPropertiesLines(formName, componentJson, !forRepl);
  // } else {
  // code = Blockly.JavaScript.getComponentPropertiesLines(formName, componentJson, parentName, !forRepl);
  // }

  if (!forRepl) {
    // Generate code for all top-level blocks related to this component
    if (componentMap.components && componentMap.components[componentName]) {
      var componentBlocks = componentMap.components[componentName];
      for (var i = 0, block; block = componentBlocks[i]; i++) {
        code.push(Blockly.JavaScript.blockToCode(block));
      }
    }
  }

  // Generate code for child components of this component
  if (componentJson.$Components) {
    var children = componentJson.$Components;
    for (var i = 0, child; child = children[i]; i++) {
      code = code.concat(Blockly.JavaScript.getComponentLines(formName, child, componentName,
        componentMap, forRepl));
    }
  }
  return code;
};

/**
 * Generate JavaScript to add the component described by componentJson to its parent, followed by
 * the code that sets each property of the component (for all its properties listed in
 * componentJson).
 *
 * @param {String} formName
 * @param {String} componentJson JSON string describing the component
 * @param {String} parentName  the name of the component that contains this component (which may be
 *    its Form, for top-level components).
 * @param {Boolean} whether to include comments in the generated code
 * @returns {Array} code strings
 * @private
 */
Blockly.JavaScript.getComponentPropertiesLines = function(formName, componentJson, parentName,
  includeComments) {
  var code = [];
  var componentName = componentJson.$Name;
  var componentType = componentJson.$Type;
  // generate the yail code that adds the component to its parent, followed by the code that
  // sets each property of the component
  if (includeComments) {
    code.push(Blockly.JavaScript.YAIL_COMMENT_MAJOR + componentName + Blockly.JavaScript.YAIL_LINE_FEED);
  }
  code.push(Blockly.JavaScript.YAIL_ADD_COMPONENT + parentName + Blockly.JavaScript.YAIL_SPACER +
    componentType + Blockly.JavaScript.YAIL_SPACER + componentName + Blockly.JavaScript.YAIL_SPACER);
  code = code.concat(Blockly.JavaScript.getPropertySettersLines(componentJson, componentName));
  code.push(Blockly.JavaScript.YAIL_CLOSE_BLOCK);
  return code;
}

/**
 * Generate JavaScript to set the properties for the Form described by componentJson.
 *
 * @param {String} formName
 * @param {String} componentJson JSON string describing the component
 * @param {Boolean} whether to include comments in the generated code
 * @returns {Array} code strings
 * @private
 */
Blockly.JavaScript.getFormPropertiesLines = function(formName, componentJson, includeComments) {
  var code = [];
  if (includeComments) {
    code.push(Blockly.JavaScript.YAIL_COMMENT_MAJOR + formName + Blockly.JavaScript.YAIL_LINE_FEED);
  }
  var yailForComponentProperties = Blockly.JavaScript.getPropertySettersLines(componentJson, formName);
  if (yailForComponentProperties.length > 0) {
    // getPropertySettersLine returns an array of lines.  So we need to
    // concatenate them (using join) before pushing them onto the JavaScript expression.
    // WARNING:  There may be other type errors of this sort in this file, which
    // (hopefully) will be uncovered in testing. Please
    // be alert for these errors and check carefully.
    code.push(Blockly.JavaScript.YAIL_DO_AFTER_FORM_CREATION + yailForComponentProperties.join(" ") +
      Blockly.JavaScript.YAIL_CLOSE_BLOCK);
  }
  return code;
}

/**
 * Generate the code to set property values for the specifed component.
 *
 * @param {Object} componentJson JSON String describing the component
 * @param {String} componentName the name of the component (also present in the $Name field in
 *    componentJson)
 * @returns {Array} code strings
 * @private
 */
Blockly.JavaScript.getPropertySettersLines = function(componentJson, componentName) {
  var code = [];
  for (var prop in componentJson) {
    if (prop.charAt(0) != "$" && prop != "Uuid") {
      code.push(Blockly.JavaScript.getPropertySetterString(componentName, componentJson.$Type, prop,
        componentJson[prop]));
    }
  }
  return code;
}

/**
 * Generate the code to set a single property value.
 *
 * @param {String} componentName
 * @param {String} propertyName
 * @param {String} propertyValue
 * @returns code string
 * @private
 */
Blockly.JavaScript.getPropertySetterString = function(componentName, componentType, propertyName,
  propertyValue) {
  var code = Blockly.JavaScript.YAIL_SET_AND_COERCE_PROPERTY + Blockly.JavaScript.YAIL_QUOTE +
    componentName + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + propertyName +
    Blockly.JavaScript.YAIL_SPACER;
  var propType = Blockly.JavaScript.YAIL_QUOTE +
    Blockly.ComponentTypes[componentType].properties[propertyName].type;
  var value = Blockly.JavaScript.getPropertyValueString(propertyValue, propType);
  code = code.concat(value + Blockly.JavaScript.YAIL_SPACER + propType + Blockly.JavaScript.YAIL_CLOSE_BLOCK);
  return code;
}

/**
 * Generate the JavaScript code for a property value. Special case handling when propertyType is
 * "'number", "'boolean", "'component", the empty string, or null. For all other property values
 * it returns the value as converted by Blockly.JavaScript.quotifyForREPL().
 *
 * @param {String} propertyValue
 * @param {String} propertyType
 * @returns code string
 * @private
 */
Blockly.JavaScript.getPropertyValueString = function(propertyValue, propertyType) {
  if (propertyType == "'number") {
    if (propertyValue.match(Blockly.JavaScript.INTEGER_REGEXP)
            || propertyValue.match(Blockly.JavaScript.FLONUM_REGEXP)) { // integer
      return propertyValue;
    } else if (propertyValue.match(Blockly.JavaScript.SIMPLE_HEX_PREFIX + "[0-9A-F]+")) { // hex
      return Blockly.JavaScript.YAIL_HEX_PREFIX +
        propertyValue.substring(Blockly.JavaScript.SIMPLE_HEX_PREFIX.length);
    }
  } else if (propertyType == "'boolean") {
    if (-1 != propertyValue.indexOf("False")) {
      return "#f";
    } else if (-1 != propertyValue.indexOf("True")) {
      return "#t";
    }
  } else if (propertyType == "'component") {
    if (propertyValue == "") {
      return "\"\"";
    } else {
      return Blockly.JavaScript.YAIL_GET_COMPONENT + propertyValue + ")";
    }
  }

  if (propertyValue == "" || propertyValue == "null") {  // empty string
    return "\"\"";
  }
  return Blockly.JavaScript.quotifyForREPL(propertyValue);
}

/**
 * Generate the code to rename a component
 *
 * @param {String} oldName
 * @param {String} newName
 * @returns {String} code
 * @private
 */
Blockly.JavaScript.getComponentRenameString = function(oldName, newName) {
  return Blockly.JavaScript.YAIL_RENAME_COMPONENT + Blockly.JavaScript.quotifyForREPL(oldName)
    + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.quotifyForREPL(newName)
    + Blockly.JavaScript.YAIL_CLOSE_BLOCK;
}

/**
 * Transform a string to the Kawa input representation of the string, for sending to
 * the REPL, by using backslash to escape quotes and backslashes. But do not escape a backslash
 * if it is part of \n. Then enclose the result in quotes.
 * TODO: Extend this to a complete transformation that deals with the full set of formatting
 * characters.
 *
 * @param {String} s string to be quotified
 * @returns {String}
 * @private
 */
Blockly.JavaScript.quotifyForREPL = function(s) {
  if (!s) {
    return null;
  } else {
    var sb = [];
    sb.push('"');
    var len = s.length;
    var lastIndex = len - 1;
    for (var i = 0; i < len; i++) {
      c = s.charAt(i);
      if (c == '\\') {
        // If this is \n don't slashify the backslash
        // TODO(user): Make this cleaner and more general
        if (!(i == lastIndex) && s.charAt(i + 1) == 'n') {
          sb.push(c);
          sb.push(s.charAt(i + 1));
          i = i + 1;
        } else {
          sb.push('\\');
          sb.push(c);
        }
      } else if (c == '"') {
        sb.push('\\');
        sb.push(c);
      } else {
        var u = s.charCodeAt(i);  // unicode of c
        if (u < ' '.charCodeAt(0) || u > '~'.charCodeAt(0)) {
          // Replace any special chars with \u1234 unicode
          var hex = "000" + u.toString(16);
          hex = hex.substring(hex.length - 4);
          sb.push("\\u" + hex);
        } else {
          sb.push(c);
        }
      }
    }
    sb.push('"');
    return sb.join("");
  }
}

/**
 * Encode a string as a properly escaped JavaScript string, complete with quotes.
 * @param {String} string Text to encode.
 * @return {String} JavaScript string.
 * @private
 */

Blockly.JavaScript.quote_ = function(string) {
  string = Blockly.JavaScript.quotifyForREPL(string);
  if (!string) {                // quotifyForREPL can return null for
    string = '""';              // empty string
  }
  return string;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.JavaScript.scrubNakedValue = function(line) {
  return line;
};

/**
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The JavaScript code created for this block.
 * @param {thisOnly} if true, only return code for this block and not any following statements
 *   note that calls of scrub_ with no 3rd parameter are equivalent to thisOnly=false, which
 *   was the behavior before this parameter was added.
 * @return {string} JavaScript code with comments and subsequent blocks added.
 * @private
 */
Blockly.JavaScript.scrub_ = function(block, code, thisOnly) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  /* TODO: fix for JavaScript comments?
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Generator.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].targetBlock();
        if (childBlock) {
          var comment = Blockly.Generator.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Generator.prefixLines(comment, '// ');
          }
        }
      }
    }
  }*/
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = thisOnly ? "" : this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

Blockly.JavaScript.getDebuggingJavaScript = function() {
  var code = [];
  var componentMap = Blockly.Component.buildComponentMap([], [], false, false);

  var globalBlocks = componentMap.globals;
  for (var i = 0, block; block = globalBlocks[i]; i++) {
    code.push(Blockly.JavaScript.blockToCode(block));
  }

  var blocks = Blockly.mainWorkspace.getTopBlocks(true);
  for (var x = 0, block; block = blocks[x]; x++) {

    // generate JavaScript for each top-level language block
    if (!block.category) {
      continue;
    }
    code.push(Blockly.JavaScript.blockToCode(block));
  }
  return code.join('\n\n');
};

/**
 * Generate code for the specified block but *not* attached blocks.
 * @param {Blockly.Block} block The block to generate code for.
 * @return {string|!Array} For statement blocks, the generated code.
 *     For value blocks, an array containing the generated code and an
 *     operator order value.  Returns '' if block is null.
 */
Blockly.JavaScript.blockToCode1 = function(block) {
  if (!block) {
    return '';
  }
  var func = this[block.type];
  if (!func) {
    throw 'Language "' + name + '" does not know how to generate code ' +
        'for block type "' + block.type + '".';
  }
  var code = func.call(block);
  if (code instanceof Array) {
    // Value blocks return tuples of code and operator order.
    if (block.disabled) {
      code[0] = '';
    }
    return [this.scrub_(block, code[0], true), code[1]];
  } else {
    if (block.disabled) {
      code = '';
    }
    return this.scrub_(block, code, true);
  }
};


