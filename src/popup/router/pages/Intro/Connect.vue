<template>
  <div class="overlay container">
    <div class="overlay_inner">
      <div class="overlay-message">
        <div class="spinner-border text-light connecting" role="status"><span class="sr-only">Loading...</span></div>
        <h4 class="text-center">Searching for your Casa Node</h4>
      </div>
      <div class="buttons"><a class="btn btn-block default-button" name="button" @click.prevent="setManually">Manually Connect</a></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const delayRequest = ms => new Promise(res => setTimeout(res, ms));

export default {
  name: `Connect`,
  data() {
    return {
      baseUrl: 'http://casa-node.local',
      pending: true,
      connected: false,
      clickedManualConfig: false,
    };
  },
  async created() {
    try {
      await delayRequest(2000); // Delay so user observes connection
      await axios({ timeout: 5000, url: `${this.baseUrl}:3001/ping` });
      this.connected = true;
      // Don't show connection if using manual override
      if (!this.clickedManualConfig) {
        this.$notify({ group: 'alerts', type: 'success', title: 'Connected', text: 'Connected to casa-node.local.' });
      }
    } catch (err) {
      // Don't show error if using manual override
      if (!this.clickedManualConfig) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Connection Failed', text: 'No response from casa-node.local. Try entering the IP manually.' });
      }
    } finally {
      if (!this.clickedManualConfig) {
        this.pending = false;
        await delayRequest(2000); // delay briefly before transitioning views
        this.handleRedirect();
      }
    }
  },
  destroyed() {
    this.pending = false;
  },
  methods: {
    setManually() {
      this.clickedManualConfig = true;
      this.$router.push('/setup');
    },

    handleRedirect() {
      // update vuex store and direct to login if manual config not selected
      if (this.connected && !this.clickedManualConfig) {
        this.$store.dispatch('setBaseUrl', `${this.baseUrl}`);
        this.$store.dispatch('setIntroFlag');
        this.$router.push('/auth');
      } else {
        // redirect to setup for manual configuration
        this.$router.push('/setup');
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
  margin-top: 44%;
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
  color: #fff;
  font-weight: bold;
}

.buttons {
  position: fixed;
  bottom: 2em;
  left: 0;
  right: 0;
  padding: 0 2em 0 1.8em;
}

.default-button {
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  padding: 1rem;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-color: #38344d;
  color: #fff;
}

.connecting {
  margin: 0 auto 2rem;
  display: block;
  height: 100px;
  width: 100px;
}

#home-logo {
  width: 120px;
  height: auto;
  margin-bottom: 1.25rem;
}
</style>
