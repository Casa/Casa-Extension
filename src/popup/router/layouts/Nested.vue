<template>
  <div class="popup-container">
    <transition-page> <router-view /> </transition-page>
  </div>
</template>

<script>
const browser = require('webextension-polyfill');
import { mapState, mapActions } from 'vuex';
export default {
  name: `Nested`,
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  background-color: #160c46;
  height: 600px;
}

.navbar {
  background-color: #160c46;
}

.popup-main {
  color: #fff !important;
  background-color: #160c46;
  padding-top: 0;
  padding-bottom: 0;
}

section * {
  color: white;
}

section.data-group {
  border-bottom: 3px solid #231a52;
  padding: 1rem 1.5rem;
}

h1 {
  font-size: 1.75em;
  text-align: center;
  font-weight: bold;
  color: #fff;
}

p {
  color: #fff;
  margin-bottom: 0.2em;
  margin-top: 0.2em;
}

a.btn.ext-link {
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  margin-top: -10px;
  border-radius: 20px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  font-size: 14px;
  float: right;
}

a.btn.ext-link img {
  max-height: 11px;
  margin-left: 10px;
}

#back-button {
  margin-top: 10px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
