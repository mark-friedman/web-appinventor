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

  var DBG = true;
  // string identifier for live editor window
  var liveWebAppWindowIdentifier = "liveWebApp";
  //url for live editor webpage
  var liveWebAppUrl = null;
  //object reference to live editor window
  var liveWebAppWindow = null;
  //object reference to live editor listener function
  var liveWebAppListener = null;


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
    /*console.log("------ updateLiveWebAppComponent : " + componentInfo +
    " propName: " + propertyName + " propVal: " + propertyValue);
    var component = JSON.parse(componentInfo);
    var js = Blockly.ComponentJSGenerator.generateJSForPropertyChange(component, propertyName, propertyValue);
    console.log("------ JS: " + js + " string length: " + js.length);
    if(js.length > 0){
        sendMessage(js);
    }*/
  }

  addLiveWebAppComponent = function(componentInfo) {
    /*console.log("------ addLiveWebAppComponent: " + componentInfo);
    var component = JSON.parse(componentInfo);
    var js = Blockly.ComponentJSGenerator.generateJSForAddingComponent(component);
    console.log("####### JS: " + js);
    if(js.length > 0){
        sendMessage(js);
    }*/
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

        js += Blockly.JavaScript.blockToCode(block);
    }
    if(DBG) console.log("======= Designer and Blocks JS: " + js);
    if(js.length > 0){
       sendMessage(js);
    }
  }

  removeLiveWebAppComponents = function() {
    var js = "document.body.innerHTML = ''";
    sendMessage(js);
  }

    sendDesignerData = function(formJson) {
    removeLiveWebAppComponents();
    var jsonObject = JSON.parse(formJson);
    var properties = jsonObject.Properties;
    var screenName = properties.$Name;

    if(updateLiveWebAppUrl(screenName)){
        //if url is updated we need to send message to change location
        liveWebAppWindow.location.assign(location.origin + liveWebAppUrl);
        return;
    }else{
        var js = this.setScreenProperties(properties);
     if(properties) {
          var components = properties.$Components;
            for(var i = 0; i < components.length; i++) {
                if(js == undefined)
                    js = Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);
                else
                    js += Blockly.ComponentJSGenerator.generateJSForAddingComponent(components[i]);
            if(DBG) console.log("Adding Component JS: " + js);

            // generate javascript for all the set properties
            for(var key in components[i]) {
              js += Blockly.ComponentJSGenerator.generateJSForPropertyChange(components[i], key, components[i][key]);
              if(DBG) console.log("Property Change JS: " + js);
            }
          }
          //Send blockly changes to the web app
          sendBlocklyData(js,screenName);
        }

    }
  }

  setScreenProperties = function(screenInfo) {
      var screenProps="";
      if (screenInfo.hasOwnProperty('BackgroundColor')) {
          var propValue = screenInfo["BackgroundColor"];
          screenProps += "document.body.style.backgroundColor =\"#" +
            propValue.substring(4) + "\";";
      }if (screenInfo.hasOwnProperty('AlignVertical')) {
          var propValue = screenInfo["AlignVertical"];
          screenProps += "document.body.style.verticalAlign =\"" + this.getVerticalAlign(propValue)+ "\";";
      }if (screenInfo.hasOwnProperty('AlignHorizontal')) {
          var propValue = screenInfo["AlignHorizontal"];
          screenProps += "document.body.style.horizontalAlign =\"" +this.getHorizontalAlign(propValue)+ "\";";
      }if (screenInfo.hasOwnProperty('Title')) {
          var propValue = screenInfo["Title"];
          screenProps += "document.title =\"" +propValue+ "\";";
      }if (screenInfo.hasOwnProperty('Image')) {
          var propValue = screenInfo["Image"];
          screenProps += "document.body.style.backgroundImage = \"url(assets/" +
          (propValue) + ")\";";
      }
        return screenProps;
  }

   getVerticalAlign = function(propVal){
       if(propVal==1){
          return "Top";
       }else if(propVal==2){
          return "center";
       }else{
          return "Bottom";
       }
   }

    
	getHorizontalAlign= function(propVal){
        if(propVal==1){
            return "Left";
        }else if(propVal==2){
            return "center";
        }else{
            return "Right";
        }
    }
  removeLiveWebAppComponent = function(componentInfo) {
    /*console.log("------ removeLiveWebAppComponent: " + componentInfo);
    var component = JSON.parse(componentInfo);
    var js = Blockly.ComponentJSGenerator.generateJSForRemovingComponent(component);
    console.log("####### JS: " + js);
    if(js.length > 0){
        sendMessage(js);
    }*/
  }

  sendMessage = function(data){
    if(DBG) console.log("window location: " + window.location);
    if(liveWebAppWindow !=null){
        liveWebAppWindow.postMessage(data,location.origin + liveWebAppUrl);
    }
  }

   checkLiveEditOpen = function checkWin() {
	   var msg ;
	        if (!liveWebAppWindow || liveWebAppWindow.closed) {
	            msg = false;
	        } else {
	            msg = true;	            	       
	        }	
	        return msg;
	    }
  
  return self;

})();