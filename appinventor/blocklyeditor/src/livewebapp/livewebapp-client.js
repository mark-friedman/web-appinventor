// live web App client
// this client is for inter window/tab communication on the same browser
// it has to be used with the appropriate implementation of livewebapp.js
//
// implementation depends on postMessage

/*
 * @author rahulmadhavan21@gmail.com (Rahul Madhavan K)
 */

'use strict';

goog.provide('Blockly.LiveWebAppClient');

goog.require('Blockly.Generator');
goog.require('Blockly.ComponentJSGenerator');



Blockly.liveWebAppClient = (function(){

  var DBG = false;
  // string identifier for live editor window
  var liveWebAppWindowIdentifier = "liveWebApp";
  //url for live editor webpage
  var liveWebAppUrl = null;
  //object reference to live editor window
  var liveWebAppWindow = null;
  //object reference to live editor listener function
  var liveWebAppListener = null;
  // screen to blocks map
  var blocksMap = {};

  var projectName = null;


  var MSG_BLOCKLY = 2;
  var MSG_COMPONENT_ADD = 1;
  var MSG_COMPONENT_REMOVE = 1;
  var MSG_COMPONENT_PROP = 1;
  var MSG_DO_IT = 3;

  var JSON_MESSAGE = true;

  executor = function(event){
    console.log(event.data + " via client executor");
    liveWebAppListener(event);
  }


  initLiveWebApp = function(url){
    liveWebAppUrl = url;
    console.log('assigned url for live web app');
    if(liveWebAppUrl){

        if(!liveWebAppWindow){

            liveWebAppWindow = window.parent.open(liveWebAppUrl,
                                                  liveWebAppWindowIdentifier,
                                                  "_blank, height=1000, width=800");
            console.log("assigned url: " +  liveWebAppUrl + "to newly created live web app window");

        }else{

            if(liveWebAppWindow.closed){

                liveWebAppWindow = window.parent.open(liveWebAppUrl,liveWebAppWindowIdentifier);
                console.log('assigned url to newly created live web app window again');

            }else{
                liveWebAppWindow.location.assign(location.origin + liveWebAppUrl);
                console.log('assigned url to existing live web app window');
            }
        }

    }else{
        throw 'live web app url is undefined';
    }
  };

  addListener = function(listener){
    liveWebAppListener = listener;
    window.addEventListener("message", executor, false);
  }

  updateLiveWebAppComponent = function(componentInfo, propertyName, propertyValue) {
    if(checkLiveEditOpen()){
        console.log("------ updateLiveWebAppComponent : " + componentInfo +
        " propName: " + propertyName + " propVal: " + propertyValue);
        var component = JSON.parse(componentInfo);
        var js = Blockly.ComponentJSGenerator.generateJSForPropertyChange(component, propertyName, propertyValue);
        console.log("------ JS: " + js + " string length: " + js.length);
        if(js.length > 0){
            sendMessage(js,MSG_COMPONENT_PROP);
        }
    }
  }

  addLiveWebAppComponent = function(componentInfo) {
    if(checkLiveEditOpen()){
        console.log("------ addLiveWebAppComponent: " + componentInfo);
        var component = JSON.parse(componentInfo);
        var js = Blockly.ComponentJSGenerator.generateJSForAddingComponent(component);
        console.log("####### JS: " + js);
        if(js.length > 0){
            sendMessage(js,MSG_COMPONENT_ADD);
        }
    }
  }
    // next screen Name is just the name it does not have .html appended to it
  updateLiveWebAppUrl = function(nextScreenName){
    if(liveWebAppUrl){
        var urlElements = liveWebAppUrl.split("/");
        var currentScreenName = urlElements[urlElements.length - 1];

        if(currentScreenName == nextScreenName + ".html"){
            return false;
        }else{
            urlElements[urlElements.length - 1] = nextScreenName + ".html";
            liveWebAppUrl= urlElements.join("/");
            return true;
        }

    }else{
        console.log("liveWebAppUrl is not initialized")
    }

    return false

  }


  sendBlocklyData = function(js,screenName) {

    projectId = Object.keys(window.parent.Blocklies).pop().split("_")[0];
    blockly = window.parent.Blocklies[projectId + "_" + screenName];
    var block, blocks = blockly.mainWorkspace.getTopBlocks(true);
    if(DBG) console.log("Blocks: " + blocks);
    var allBlocks = [];
    var addedBlocks = [];
    var blocksToBeSent = [];
    var diff = [];

    if(blocksMap[screenName] === undefined){
      blocksMap[screenName] = [];
    }

    for (var x = 0; (block = blocks[x]); x++) {
        if (!block.category || (block.hasError && !block.replError)) { // Don't send blocks with
            continue;           // Errors, unless they were errors signaled by the repl
        }
        if (block.disabled) {   // Don't send disabled blocks
            continue;
        }
        if (block.blockType != "event" &&
            block.type != "global_declaration" &&
            block.type != "procedures_defnoreturn" &&
            block.type != "procedures_defreturn")
            continue;

        var blockJs = Blockly.JavaScript.blockToCode(block);
        if(!checkIfBlockExists(blockJs,screenName)){
            //blocksMap[screenName].push(blockJs);
            addedBlocks.push(js);
        }
        allBlocks.push(blockJs)
    }

    if(allBlocks.length >= blocksMap[screenName].length && blocksMap[screenName].length != 0){
        diff = minus(allBlocks,blocksMap[screenName]);
        blocksToBeSent = diff;
    }else{
        //blocks have been removed
        blocksToBeSent = allBlocks;
    }

    blocksMap[screenName] = allBlocks;

//    var diff = minus(blocksMap[screenName],allBlocks);
//
//    if(diff.length > 0){
//        //blocks have been removed
//        blocksMap[screenName] = allBlocks;
//        blockToBeSent = allBlocks;
//    }else{
//        blockToBeSent = addedBlocks;
//    }

    if(JSON_MESSAGE){
        js += blocksToBeSent.join("");
    }else{
        js += blocksToBeSent.join("");
    }

    console.log("======= Designer and Blocks JS: " + js);

    if(js.length > 0){
       sendMessage(js,MSG_BLOCKLY);
    }
  }


  checkIfBlockExists = function(js,screenName){
      return blocksMap[screenName].some(function (v,i,a){ return v == js });
  }

  var minus = function ( a, b ) {
      return a.filter(function ( v,i ,a ) {
          return b.indexOf(v) === -1;
      });
  };



  removeLiveWebAppComponents = function() {
    var js = "document.body.innerHTML = ''";
    sendMessage(js);
  }

//  sendDesignerData = function(formJson) {
//    removeLiveWebAppComponents();
//    var jsonObject = JSON.parse(formJson);
//    var properties = jsonObject.Properties;
//    var screenName = properties.$Name;
//
//    if(updateLiveWebAppUrl(screenName)){
//        //if url is updated we need to send message to change location
//        liveWebAppWindow.location.assign(location.origin + liveWebAppUrl);
//        return;
//    }else{
//     if(properties) {
//          var components = properties.$Components;
//            var js;
//            for(var i = 0; i < components.length; i++) {
//            if(DBG) console.log("Component: " + JSON.stringify(components[i]));
//                if(js == undefined)
//                    js = Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);
//                else
//                    js += Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);
//            if(DBG) console.log("Adding Component JS: " + js);
//
//            // generate javascript for all the set properties
//            for(var key in components[i]) {
//              js += Blockly.ComponentJSGenerator.generateJSForPropertyChange(components[i], key, components[i][key]);
//              if(DBG) console.log("Property Change JS: " + js);
//            }
//          }
//          //Send blockly changes to the web app
//          sendBlocklyData(js,screenName);
//        }
//
//    }
//
//
//  }
	
  onBlocksAreaChange = function (screenNameWithProjectId){
    if(checkLiveEditOpen()){
        screenName = screenNameWithProjectId.split("_")[1];
        if(updateLiveWebAppUrl(screenName)){
          //if url is updated we need to send message to change location
          liveWebAppWindow.location.assign(location.origin + liveWebAppUrl);
          return;
        }else{
            sendBlocklyData("",screenName);
        }
    }

  }



  removeLiveWebAppComponent = function(componentInfo) {
    if(checkLiveEditOpen()){
        console.log("------ removeLiveWebAppComponent: " + componentInfo);
        var component = JSON.parse(componentInfo);
        var js = Blockly.ComponentJSGenerator.generateJSForRemovingComponent(component);
        console.log("####### JS: " + js);
        if(js.length > 0){
            sendMessage(js,MSG_COMPONENT_REMOVE);
        }
    }
  }

  sendMessage = function(data,messageType,blockId){
      message = generateMessageForType(data,messageType,blockId)
      var sMessage = data
      if(JSON_MESSAGE){
        sMessage  = JSON.stringify(message)
      }
      sendMessageRaw(sMessage)
  }

  generateMessageForType = function(data,messageType,blockId){
      var message = {}
      var TYPE = "type";
      var BLOCK_ID = "blockId";
      var DEFAULT_BLOCK_ID = -1;
      var JS = "js";
    data = data.replace(/"/g, "\'");
      switch(messageType){
        case MSG_COMPONENT_ADD :
        case MSG_COMPONENT_REMOVE :
        case MSG_COMPONENT_PROP:
        case MSG_BLOCKLY:
            message[TYPE] = messageType;
            message[BLOCK_ID] = DEFAULT_BLOCK_ID;
            message[JS] = data;
            return message;
        case MSG_DO_IT:
            message[TYPE] = messageType;
            message[BLOCK_ID] = blockId;
            message[JS] = data;
            return message;
        default:
            throw "live-webapp cannot generate message for given messageType : "+messageType;


      }
  }

  sendMessageRaw = function(data){
    if(DBG) console.log("window location: " + window.location);
    if(liveWebAppWindow !=null){
        liveWebAppWindow.postMessage(data,location.origin + liveWebAppUrl);
    }
  }

   checkLiveEditOpen = function() {
	   var msg ;
	        if (!liveWebAppWindow || liveWebAppWindow.closed) {
	            msg = false;
	        } else { 	            
	            msg = true;	            	       
	        }	
	        return msg;
	    }

  doItAction = function(block) {
     var js  = Blockly.JavaScript.blockToCode1(block);

     console.log(" myBlock: " + block + " JS: " +
        js + " block id: " + block.id);

     if(Array.isArray(js)){
        js = js[0];
     }
     sendMessage(js,MSG_DO_IT,block.id);
  }

  setProject = function(project){
    this.projectName = project;
  }

  getProject = function(){
      return this.projectName;
  }

  return self;

})();