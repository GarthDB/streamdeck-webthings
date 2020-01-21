window.connectElgatoStreamDeckSocket = (inPort, inPluginUUID, inRegisterEvent, inInfo) => {
  const sdWebSocket = new WebSocket("ws://127.0.0.1:" + inPort);
  const contextArray = [];

  function registerPlugin(inPluginUUID) {
    var json = {
      "event": inRegisterEvent,
      "uuid": inPluginUUID
    };

    sdWebSocket.send(JSON.stringify(json));
  };

  sdWebSocket.onopen = function() {
    console.log('sdWebSocket opened');
    registerPlugin(inPluginUUID);
    const json = {
      "event": "setTitle",
      "context": inPluginUUID,
      "payload": {
        "title": "Garth",
        "target": 0
      }
    };
    sdWebSocket.send(JSON.stringify(json));
  };

  sdWebSocket.onerror = function(event) {
    console.error("WebSocket error observed:", event);
  };

  sdWebSocket.onmessage = function(e) {
    const jsonObj = JSON.parse(e.data);
    const event = jsonObj['event'];
    const jsonPayload = jsonObj['payload'];
    if (event == 'willAppear') {
      if (!contextArray.includes(jsonObj.context)) {
        contextArray.push(jsonObj.context);
      }
      console.log({message: "will Appear", value: jsonObj})
    }
    if (event == "sendToPlugin") {
      if (jsonPayload.type == "setTitle") {
        const json = {
          "event": "setTitle",
          "context": contextArray[0],
          "payload": {
            "title": jsonPayload.title,
            "target": 0
          }
        };
        sdWebSocket.send(JSON.stringify(json));
        console.log(jsonPayload.title)
      }
    }
    console.log(e)
  };
};
// // Global web socket
// var sdWebSocket = null;
// var pluginUUID = null;
//
// // Global settings
// var globalSettings = {};
//
// // Setup the sdWebSocket and handle communication
// function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
//   pluginUUID = inPluginUUID;
//   var jwt = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjViZjkzMzc4LWQzNTItNGZhOC05NzVkLTQyZDBlZjg5Y2RhNiJ9.eyJjbGllbnRfaWQiOiJsb2NhbC10b2tlbiIsInJvbGUiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZSI6Ii90aGluZ3M6cmVhZHdyaXRlIiwiaWF0IjoxNTc5MDQwNTU3LCJpc3MiOiJodHRwczovL2dhcnRoZGIubW96aWxsYS1pb3Qub3JnIn0.cbJFJjmT6R64oBftEDu3ay-83yY86EZl_TujEZ2k1KVTvYO-XWtTGHJWOvTGhuVhAfgZWa5HKoX84TWqSvO3DQ";
//   var thingSocket = new WebSocket('wss://garthdb.mozilla-iot.org/things/zwave-ebc6f2a9-4?jwt='+jwt, 'webthing');
//   thingSocket.onopen = function(result) {
//     console.log('things socket opened');
//     console.log(result);
//     var data = {
//       "messageType": "addEventSubscription",
//       "data": {}
//     }
//     thingSocket.send(JSON.stringify(data));
//   }
//   thingSocket.onerror = function(event) {
//     console.error("WebSocket error observed:", event);
//   };
//   // Web socked received a message
//   thingSocket.onmessage = function(inEvent) {
//     console.log('Thing Socket Message')
//     console.log(inEvent);
//   };
//   // Open the web socket to Stream Deck
//   // Use 127.0.0.1 because Windows needs 300ms to resolve localhost
//   sdWebSocket = new WebSocket("ws://127.0.0.1:" + inPort);
//
//   function registerPlugin(inPluginUUID) {
//     var json = {
//       "event": inRegisterEvent,
//       "uuid": inPluginUUID
//     };
//
//     sdWebSocket.send(JSON.stringify(json));
//   };
//
//   // Web socket is connected
//   sdWebSocket.onopen = function() {
//     console.log('sdWebSocket opened');
//     registerPlugin(pluginUUID);
//   }
//
//   sdWebSocket.onerror = function(event) {
//     console.error("WebSocket error observed:", event);
//   };
//
//   // Web socked received a message
//   sdWebSocket.onmessage = function(e) {
//     var jsonObj = JSON.parse(e.data);
//     var event = jsonObj['event'];
//     var jsonPayload = jsonObj['payload'];
//     if(event == "keyUp") {
//       var state = jsonPayload['state'];
//       console.log(state);
//       var data = {
//         "messageType": "setProperty",
//         "data": {
//           "on": (state == 1)
//         }
//       }
//       thingSocket.send(JSON.stringify(data));
//     }
//   };
// };
