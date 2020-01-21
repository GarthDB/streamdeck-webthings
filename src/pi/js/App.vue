<template>
  <DeviceSelector/>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import DeviceSelector from './DeviceSelector.vue'

export default {
  components: {
    DeviceSelector
  }
}
</script>

<style lang="scss" scoped>
.container {
    color: orange;
}
</style>
