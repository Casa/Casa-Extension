<template>
  <div class="popup-container">
    <b-navbar> <img id="close-button" src="~assets/images/close-x.svg" class="d-inline-block align-top" alt="exit" @click.prevent="$router.push('/lightning')" /> </b-navbar>
    <main class="popup-main">
      <transition-page> <router-view /> </transition-page>
    </main>
  </div>
</template>

<script>
const browser = require('webextension-polyfill');
import { mapState, mapActions } from 'vuex';
export default {
  name: `Receipt`,
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  background-color: #fff;
  height: 600px;
}

.navbar {
  background-color: #fff;
}

.popup-main {
  color: #0a0525 !important;
  background-color: #fff;
  padding-top: 0;
  padding-bottom: 0;
}

#close-button {
  margin-top: 10px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
