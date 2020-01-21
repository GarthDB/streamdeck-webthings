import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let websocket;
let pUUID;

const store = new Vuex.Store({
  state: {
    bridges: [],
    currentThings: []
  },
  mutations: {
    addBridge (state, bridge) {
      state.bridges.push(bridge);
      const json = {
        "event": "setGlobalSettings",
        "context": pUUID,
        "payload": {"bridges": state.bridges}
      }
      websocket.send(JSON.stringify(json));
    },
    loadBridges (state, bridges) {
      state.bridges = bridges;
    },
    clearBridges (state) {
      state.bridges.splice(0, state.bridges.length);
      const json = {
        "event": "setGlobalSettings",
        "context": pUUID,
        "payload": {"bridges": state.bridges}
      }
      websocket.send(JSON.stringify(json));
    },
    loadThings (state, things) {
      state.currentThings = things;
    },
    updateTitle (state, title) {
      console.log(title);
      const json = {
        "action": "org.mozilla.wot.properties.on",
        "event": "sendToPlugin",
        "context": pUUID,
        "payload": {"type":"setTitle", title}
      }
      websocket.send(JSON.stringify(json));
    }
  }
})

window.connectElgatoStreamDeckSocket = (inPort, inPluginUUID, inRegisterEvent, inInfo) => {
  const actions = {};
  pUUID = inPluginUUID;
  websocket = new WebSocket("ws://127.0.0.1:" + inPort);
  const registerPlugin = (inPluginUUID) => {
    const json = {
      "event": inRegisterEvent,
      "uuid": inPluginUUID
    };
    websocket.send(JSON.stringify(json));
  };

  const requestGlobalSettings = (inUUID) => {
    const json = {
      "event": "getGlobalSettings",
      "context": inUUID
    }
    websocket.send(JSON.stringify(json));
  }

  websocket.onopen = () => {
    console.log('websocket pi opened');
    registerPlugin(inPluginUUID);
    requestGlobalSettings(inPluginUUID);
  }

  websocket.onerror = (event) => {
    console.error("WebSocket pi error observed:", event);
  };

  websocket.onmessage = (evt) => {
    console.log(evt);
    const jsonObj = JSON.parse(evt.data);
    const event = jsonObj['event'];
    const jsonPayload = jsonObj['payload'];
    if (event == "didReceiveGlobalSettings") {
      store.commit('loadBridges', jsonPayload.settings.bridges)
      console.log("didReceiveGlobalSettings");
      console.log(jsonPayload);
    }
  };
};

var bc = new BroadcastChannel('mozilla');
bc.onmessage = (ev) => {
  console.log(ev);
  if (ev.data.type == 'New Bridge') {
    fetch(`${ev.data.baseUrl}/things`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ev.data.jwt}`
      }
    }).then(res => {
      return res.json();
    }).then(things => {
      store.commit('addBridge', {name: ev.data.name, jwt: ev.data.jwt, baseUrl: ev.data.baseUrl, things})
      console.log(things);
    });
  }
}

new Vue({
  store,
  render: createElement => createElement(App)
}).$mount('#app');
