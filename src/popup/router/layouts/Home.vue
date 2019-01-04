<template>
  <div class="popup-container">
    <main class="popup-main">
      <transition-page> <router-view /> </transition-page>
    </main>
  </div>
</template>

<script>
export default {
  name: `Home`,
};
</script>

<style lang="scss">
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
  background-color: #160c46;
}

.popup-main {
  padding-top: 1em;
  padding-bottom: 2.5em;
}

.router-link-exact-active {
  font-weight: bold;
}
</style>
