// live web app
// this live web app implementation is for inter window/tab communication
// it has to be used with the appropriate implementation of livewebapp-client.js
//
// implementation depends on postMessage

/*
 * @author rahulmadhavan21@gmail.com (Rahul Madhavan K)
 */


var liveWebApp = (function(){
  //object reference to live editor client listener function
  liveWebAppClientListener = null;
  //object reference to live editor sender function
  liveWebAppSender = null;

  executor = function(event){	  
	var url  = window.location.href;
	var projectIDFromURL = url.split("/");
	console.log("event source"+event.source);
	console.log("event origin"+event.origin+"Project ID"+projectIDFromURL[4]+"URL =>"+url);
	var returnMessage = getTheReturnValues(event);
	event.source.postMessage(returnMessage , event.origin+"/#"+projectIDFromURL[4]);
    console.log(event.data + " via live editor executor");liveWebAppClientListener(event);
    if(liveWebAppSender != null){
        liveWebAppSender(event);
    }	
  }

  addClientListener = function(listener){
    liveWebAppClientListener = listener;
    window.addEventListener("message", executor, false);
  }

  addSender = function(sender){
    liveWebAppSender = sender;
  }
  
  getTheReturnValues = function(event){
	  try {
              var json = event.data;
                var jsonObject = JSON.parse(json);
                console.log(json);
                console.log(jsonObject);
                console.log(jsonObject.blockId);
                console.log(jsonObject.js);                
                var type = jsonObject.type;
                var blockId = jsonObject.blockId;
                var javascript = jsonObject.js;                
                var jsonresponce;
                switch (type) {                    
                    case 1:
                        jsonresponce = createJsonResponceForComponents(javascript, blockId);
                        break;
                    case 2:
                        jsonresponce = createJsonResponceForBlockly(javascript, blockId);
                        break;
                    case 3:
                        jsonresponce = createJsonResponceForDoIt(javascript,blockId);
                        break;                   
                }
				return jsonresponce;
     
            } catch (e) {
                if (e instanceof SyntaxError) {
                    console.log("ERROR WHEN USING EVAL==>" + e.message);                    
                } else {
                    console.log("ERROR WHEN USING EVAL==>" + e);                    
                }
            }
        }
		
		
        function createJsonResponceForComponents(javascript, blockId) {
            try {

                eval(javascript);
              return  buildJSONResponce(blockId,"OK","");
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    console.log("ERROR WHEN USING EVAL FOR COMPONENTS PART==>" + e.message);   
				return	buildErrorResponce(e.message);					
                } else {
                    console.log("ERROR WHEN USING EVAL FOR COMPONENTS PART==>" + e);                    
					return	buildErrorResponce(e.message);					
                }
            }
        }
        function createJsonResponceForBlockly(javascript, blockId) {
            try {

                eval(javascript);
                 return buildJSONResponce(blockId,"OK","");
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    console.log("ERROR WHEN USING EVAL FOR BLOCKLY PART==>" + e.message);
					return	buildErrorResponce(e.message);					
                } else {
                    console.log("ERROR WHEN USING EVAL FOR BLOCKLY PART==>" + e);
					return	buildErrorResponce(e.message);					
                }
            }
    }
    function createJsonResponceForDoIt(javascript, blockId) {

	
	 try {

				 if(javascript.indexOf("document.location.href") > -1){ 									
				 return buildJSONResponceToChangeTheScreen(javascript,"OK");
				 }else{
					 var retVal = eval(javascript).toString();					 					 
				 return buildJSONResponce(blockId,"OK",retVal);
				 }
                 
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    console.log("ERROR WHEN USING EVAL FOR BLOCKLY PART==>" + e.message);
					return	buildErrorResponce(e.message);					
                } else {
                    console.log("ERROR WHEN USING EVAL FOR BLOCKLY PART==>" + e);
					return	buildErrorResponce(e.message);					
                }
            }
	
	

    }
	function buildJSONResponceToChangeTheScreen(javascript,status){
		//this.response{"status":"OK","values":[{"type":"pushScreen","screen":"Screen2","status":"OK"}]}
		 var res = javascript.split("\"");
		 var screenName = res[1].replace('.html','') ;
             console.log(screenName);			
		
		 var jsonData = {};
        var fullData = {};        
        jsonData["type"] = "pushScreen";
        jsonData["screen"] = screenName;
        jsonData["status"] = status;
        fullData["status"] = status;
        fullData["values"] = jsonData;
        console.log(jsonData);
        console.log(fullData);
        var stringJSON = JSON.stringify(jsonData);
        console.log(stringJSON);
        stringJSON = JSON.stringify(fullData);
        console.log(stringJSON);
		return stringJSON;
		
	}
    function buildJSONResponce(blockId, status, value) {
        var jsonData = {};
        var fullData = {};
        jsonData["value"] = value;
        jsonData["type"] = "return";
        jsonData["blockid"] = blockId;
        jsonData["status"] = status;
        fullData["status"] = status;
        fullData["values"] = jsonData;
        console.log(jsonData);
        console.log(fullData);
        var stringJSON = JSON.stringify(jsonData);
        console.log(stringJSON);
        stringJSON = JSON.stringify(fullData);
        console.log(stringJSON);
		return stringJSON;

    }
	function buildErrorResponce(error){		 
        var errorData = {};        
        errorData["status"] = "BAD";
        errorData["values"] = error;        
        console.log(errorData);
        var errorJSON = JSON.stringify(errorData);
        console.log(errorJSON);       
		return errorJSON;
		
	}
	 function buildDOITResponce(blockId, status, value) {
        var jsonData = {};
        var fullData = {};
        jsonData["value"] = value;
        jsonData["type"] = "return";
        jsonData["blockid"] = blockId;
        jsonData["status"] = status;
        fullData["status"] = "OK";
        fullData["values"] = jsonData;
        console.log(jsonData);
        console.log(fullData);
        var stringJSON = JSON.stringify(jsonData);
        console.log(stringJSON);
        stringJSON = JSON.stringify(fullData);
        console.log(stringJSON);
		return stringJSON;

    }

  return self;
})();