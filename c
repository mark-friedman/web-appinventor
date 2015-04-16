[1mdiff --git a/appinventor/appengine/war/blocklyframe.html b/appinventor/appengine/war/blocklyframe.html[m
[1mindex 89700b3..bbf153b 100644[m
[1m--- a/appinventor/appengine/war/blocklyframe.html[m
[1m+++ b/appinventor/appengine/war/blocklyframe.html[m
[36m@@ -95,24 +95,11 @@[m
 [m
       function createLiveWebApp(projectName){[m
          var liveWebAppClient = Blockly.liveWebAppClient;[m
[31m-         window.parent.liveWebAppClient = liveWebAppClient[m
[32m+[m[32m         window.parent.liveWebAppClient = liveWebAppClient;[m
          liveWebAppClient.setProject(projectName);[m
[32m+[m		[32m liveWebAppClient.listnerReceiveMessage();[m
       }[m
[31m-	  window.addListener(receiveMessage);[m
[31m-function receiveMessage(event){ [m
[31m-console.log(event.data);[m
[31m-[m
[31m-var json = goog.json.parse(event.data);[m
[31m-					console.log("json.status"+json.status);[m
[31m-					[m
[31m-					console.log("json"+json);[m
[31m-                    if (json.status == 'OK') {[m
[31m-						console.log("json.values"+json.values);                        [m
[31m-						Blockly.ReplMgr.processRetvals([json.values]);[m
[31m-                    }else if(json.status == 'BAD'){[m
[31m-					console.log("json.values"+json.values);   [m
[31m-					}[m
[31m- }[m
[32m+[m[41m	[m
  [m
     </script>[m
   </head>[m
[1mdiff --git a/appinventor/blocklyeditor/src/livewebapp/livewebapp-client.js b/appinventor/blocklyeditor/src/livewebapp/livewebapp-client.js[m
[1mindex c3b8b45..4edf529 100644[m
[1m--- a/appinventor/blocklyeditor/src/livewebapp/livewebapp-client.js[m
[1m+++ b/appinventor/blocklyeditor/src/livewebapp/livewebapp-client.js[m
[36m@@ -347,7 +347,23 @@[m [mBlockly.liveWebAppClient = (function(){[m
      }[m
      sendMessage(js,MSG_DO_IT,block.id);[m
   }[m
[31m-[m
[32m+[m[41m	[m
[32m+[m[41m	[m
[32m+[m[32m  listnerReceiveMessage = function(){[m
[32m+[m[32m   window.addListener(receiveMessage);[m
[32m+[m[32m }[m
[32m+[m[32m receiveMessage = function(event){[m[41m [m
[32m+[m	[32mconsole.log(event.data);[m
[32m+[m	[32mvar json = goog.json.parse(event.data);[m
[32m+[m		[32mconsole.log("json.status"+json.status);[m
[32m+[m		[32mconsole.log("json"+json);[m
[32m+[m		[32mif (json.status == 'OK') {[m
[32m+[m		[32mconsole.log("json.values"+json.values);[m[41m                        [m
[32m+[m		[32mBlockly.ReplMgr.processRetvals([json.values]);[m
[32m+[m		[32m}else if(json.status == 'BAD'){[m
[32m+[m		[32mconsole.log("json.values"+json.values);[m[41m   [m
[32m+[m		[32m}[m
[32m+[m	[32m }[m
   setProject = function(project){[m
     this.projectName = project;[m
   }[m
