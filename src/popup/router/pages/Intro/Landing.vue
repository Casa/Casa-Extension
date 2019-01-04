<template>
  <div class="overlay container h-100">
    <div class="overlay_inner">
      <div class="overlay-message">
        <img id="home-logo" src="~assets/images/home-logo.svg" alt="home" />
        <h2 class="text-center">Hello there.</h2>
        <h4 class="text-center">Welcome to Casa Extension.</h4>
        <img id="home-bg" src="~assets/images/home-bg.png" alt="background" style="display:none;" />
      </div>
      <div class="overlay-background"></div>

      <div class="buttons">
        <a class="btn btn-block default-button" name="button" href="https://store.casa/lightning-node/" target="_blank" rel="noopener">Get a Casa Node for $299</a>
        <a class="btn btn-block casa-button" name="button" @click.prevent="enter">Connect Your Casa Node</a>
      </div>
    </div>
  </div>
</template>

<script>
const ipRegex = /^((http:\/\/|https:\/\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

export default {
  name: `Landing`,
  data() {
    return {};
  },
  methods: {
    enter() {
      const baseUrl = this.$store.state.settings.baseUrl;

      // check that user's ip meets formatting requirements
      if (baseUrl.indexOf('casa-node.local') || ipRegex.test(baseUrl)) {
        if (this.$store.getters.isLoggedIn) {
          this.$router.push('/lightning');
        } else {
          this.$router.push('/connect');
        }
      } else {
        this.$router.push('/settings');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay * {
  color: #fff;
}
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: scroll;
  background: #0a0525;
  z-index: 9999;

  &_inner {
    position: relative;
    max-width: 42em;
    margin-right: auto;
    margin-left: auto;
    padding: 1em;
  }
}

.overlay-message {
  margin-top: 4vh;
}

.overlay-message img {
  display: block;
  width: 50px;
  margin: 0 auto 1rem;
}

.overlay-message h2 {
  font-size: 38px;
  font-size: #fff;
}

.overlay-message h4 {
  font-size: 22px;
  margin-bottom: 0.75rem;
  color: #a29bbc;
}

.overlay-background {
  height: 100vh;
  background-image: url('~assets/images/home-bg.png');
  background-repeat: no-repeat;
  background-position-y: 0px;
  background-size: 320px 320px;
  background-position-x: 10px;
}

.buttons {
  position: fixed;
  bottom: 2em;
  left: 0;
  right: 0;
  padding: 0 2em 0 1.8em;
}

.casa-button {
  padding: 1rem;
  margin: 10px 2px 2px 2px;
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  color: #fff;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
}

.default-button {
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  padding: 1rem;
  margin: 2px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-color: #38344d;
  color: #fff;
}

#home-logo {
  width: 120px;
  height: auto;
  margin-bottom: 1.25rem;
}
</style>
