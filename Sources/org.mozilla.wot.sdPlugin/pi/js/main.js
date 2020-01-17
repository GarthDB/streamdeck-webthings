// Global web socket
var websocket = null;

// Global settings
var globalSettings = {};

// Setup the websocket and handle communication
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
  // Create array of currently used actions
  var actions = {};

  // Open the web socket to Stream Deck
  // Use 127.0.0.1 because Windows needs 300ms to resolve localhost
  websocket = new WebSocket("ws://127.0.0.1:" + inPort);

  function registerPlugin(inPluginUUID) {
    var json = {
      "event": inRegisterEvent,
      "uuid": inPluginUUID
    };

    websocket.send(JSON.stringify(json));
  };

  function requestGlobalSettings(inUUID) {
    var json = {
      "event": "getGlobalSettings",
      "context": inUUID
    }
    websocket.send(JSON.stringify(json));
  }

  // Web socket is connected
  websocket.onopen = function() {
    console.log('websocket pi opened');
    registerPlugin(inPluginUUID);
    requestGlobalSettings(inPluginUUID);
  }

  websocket.onerror = function(event) {
    console.error("WebSocket pi error observed:", event);
  };


  // Web socked received a message
  websocket.onmessage = function(inEvent) {
    console.log(inEvent);
  };
};
