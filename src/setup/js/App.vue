<template>
<div class="sdpi-wrapper">
  <form v-on:submit.prevent="submitForm">
    <div class="sdpi-heading">ADD A BRIDGE</div>
    <div class="sdpi-item">
      <label class="sdpi-item-label" for="bridgename">Bridge Name</label>
      <input class="sdpi-item-value" id="bridgename" required />
    </div>
    <div class="sdpi-item">
      <label for="serverURL" class="sdpi-item-label">Server URL</label>
      <input class="sdpi-item-value" type="url" id="serverURL" placeholder="https://example.com" pattern="https://.*" required />
    </div>
    <div type="textarea" class="sdpi-item">
      <label class="sdpi-item-label up20" for="jwt">JSON Web Token</label>
      <div class="sdpi-item-value textarea">
        <textarea type="textarea" id="jwt" required></textarea>
      </div>
    </div>
    <div class="sdpi-item">
      <div style="width: 103px;"></div>
      <input type="submit" value="Add Bridge">
    </div>
  </form>
</div>
</template>

<script>
export default {
  methods: {
    submitForm: (e) => {
      var bc = new BroadcastChannel('mozilla');
      bc.onmessage = function(ev) {
        console.log(ev);
      }
      bc.postMessage({
        type: 'New Bridge',
        name: e.target[0].value,
        baseUrl: e.target[1].value,
        jwt: e.target[2].value
      });
      return false;
    }
  }
}
</script>
