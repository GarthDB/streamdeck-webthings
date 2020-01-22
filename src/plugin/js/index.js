window.connectElgatoStreamDeckSocket = (inPort, inPluginUUID, inRegisterEvent, inInfo) => {
  const sdWebSocket = new WebSocket("ws://127.0.0.1:" + inPort);
  const coordinates = {};

  function setCoordinate(col, row, payload) {
    coordinates[col] = coordinates[col] || {};
    coordinates[col][row] = coordinates[col][row] || {};
    coordinates[col][row] = {
      ...coordinates[col][row],
      ...payload
    };
    return coordinates[col][row];
  }

  function getCoordinate(col, row) {
    if (coordinates.hasOwnProperty(col) && coordinates[col].hasOwnProperty(row)) {
      return coordinates[col][row];
    } else {
      return false;
    }
  }

  function registerThing(thing, jwt, context) {
    const regex = /^wss?:\/\//;
    const url = thing.links.find(link => regex.test(link.href)).href;
    const thingWebSocket = new WebSocket(`${url}?jwt=${jwt}`, 'webthing');
    thingWebSocket.onopen = (e) => {
      console.log(`${thing.title} socket opened`);
    }
    thingWebSocket.onmessage = (e) => {
      const jsonObj = JSON.parse(e.data);
      const event = jsonObj['event'];
      if (jsonObj.messageType == "propertyStatus") {
        const state = jsonObj.data.on ? 0 : 1;
        const json = {
          event: "setState",
          context,
          payload: {
            state
          }
        };
        sdWebSocket.send(JSON.stringify(json));
      }
    };
    return thingWebSocket;
  }

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
      const res = setCoordinate(jsonPayload.coordinates.column, jsonPayload.coordinates.row, {
        context: jsonObj.context,
        ...jsonPayload.settings
      })
      if (res.hasOwnProperty('thing') && res.hasOwnProperty('bridge')) {
        const thingWebSocket = registerThing(res.thing, res.bridge.jwt, res.context);
        setCoordinate(jsonPayload.coordinates.column, jsonPayload.coordinates.row, {
          thingWebSocket
        });
      }
    }
    if (event == "didReceiveSettings") {
      const res = setCoordinate(jsonPayload.coordinates.column, jsonPayload.coordinates.row, jsonPayload.settings)
      const json = {
        "event": "setTitle",
        "context": res.context,
        "payload": {
          "title": res.thing.title,
          "target": 0
        }
      };
      sdWebSocket.send(JSON.stringify(json));
    }
    if (event == "keyUp") {
      const thingData = getCoordinate(jsonPayload.coordinates.column, jsonPayload.coordinates.row);
      const json = {
        "messageType": "setProperty",
        "data": {
          "on": !!+jsonPayload.state
        }
      }
      thingData.thingWebSocket.send(JSON.stringify(json))
    }
  };
};
