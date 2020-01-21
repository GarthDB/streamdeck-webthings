<template>
<div class="sdpi-wrapper" id="pi">
  <div class="sdpi-item" v-if="bridges && bridges.length == 0">
    <label class="sdpi-item-label" for="bridge-select">Bridge</label>
    <div class="sdpi-item-value select">No Bridges</div>
  </div>
  <div class="sdpi-item" v-else>
    <label class="sdpi-item-label" for="bridge-select">Bridge</label>
    <select class="sdpi-item-value select" id="bridge-select" v-model="selectedBridge" v-on:change="changeBridge">
      <option v-for="(bridge, bridgeIndex) in bridges" :value="bridgeIndex">{{bridge.name}}</option>
    </select>
  </div>
  <div class="sdpi-item">
    <label class="sdpi-item-label">Bridge Actions</label>
    <button class="sdpi-item-value" v-on:click="addBridge">Add Bridge</button>
    <button class="sdpi-item-value" v-on:click="clearBridges">Clear Bridges</button>
  </div>
  <div class="sdpi-item">
    <label class="sdpi-item-label" for="thing-select">Things</label>
    <select class="sdpi-item-value select" id="thing-select" v-model="selectedThing" v-on:change="changeThing">
      <option v-for="(thing, thingIndex) in things" :value="thingIndex">{{thing.title}}</option>
    </select>
  </div>
</div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  computed: {
    ...mapState({
      bridges: state => state.bridges,
      things: state => state.currentThings,
    })
  },
  methods: {
    addBridge(e) {
      window.open("../setup/index.html");
    },
    changeBridge(e) {
      if (this.bridges[e.target.value] && this.bridges[e.target.value].things) {
        this.$store.commit('loadThings', this.bridges[e.target.value].things);
      }
    },
    changeThing(e) {
      const thing = this.things[e.target.value];
      this.updateTitle(thing.title);
    },
    ...mapMutations(['clearBridges','updateTitle'])
  }
}
</script>

<style>
</style>
