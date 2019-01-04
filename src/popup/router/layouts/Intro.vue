<template>
  <div class="popup-container">
    <b-navbar> <img id="back-button" src="~assets/images/back.svg" class="d-inline-block align-top" alt="back" @click.prevent="$router.back()" /> </b-navbar>
    <main class="popup-main">
      <transition-page> <router-view /> </transition-page>
    </main>
  </div>
</template>

<script>
export default {
  name: `Intro`,
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.6;
  color: #333;
  background-color: #160c46;
  font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
}

.logo-center {
  display: block;
  margin: 0 auto;
  width: 100px;
  margin-top: 1em;
}

.popup-container {
  margin-right: auto;
  margin-left: auto;
  width: 400px;
  height: 600px;
  background-color: #0a0525;
}

.navbar {
  background-color: #0a0525;
  padding: 8px 16px;
}

.popup-main {
  padding-top: 1em;
  padding-bottom: 2.5em;
}

.router-link-exact-active {
  font-weight: bold;
}

#back-button {
  margin-top: 10px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
