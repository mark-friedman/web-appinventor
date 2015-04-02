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
    console.log(event.data + " via live editor executor");
    liveWebAppClientListener(event);
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

  return self;
})();