<template>
  <div id="app">
    <component :is="layout"> <router-view /> </component> <notifications group="alerts" />
  </div>
</template>

<script>
import store from '../store';

const defaultLayout = 'default';

const intercept = function(err) {
  return new Promise(function(resolve, reject) {
    // handle expired JWT
    if (err.response && err.response.status === 401 && err.response.data === 'Invalid JWT') {
      store.dispatch('logout');
      this.$route.push('/login');
    }
    throw err;
  });
};

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || defaultLayout) + '-layout';
    },
  },
  created() {
    this.$http.interceptors.response.use(undefined, intercept);
  },
};
</script>

<style media="screen">
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
  -webkit-font-smoothing: subpixel-antialiased;
}

::-webkit-scrollbar {
  display: none;
}

/* Hide buttons while transitioning, prevents them from jumping around due to fixed positioning */
.slide-left-enter-active .buttons,
.slide-right-enter-active .buttons {
  opacity: 0;
}

.slide-left-leave-active .buttons,
.slide-right-leave-active .buttons {
  display: none;
}

.buttons {
  opacity: 1;
  transition: opacity 0.5s;
}

.notifications {
  z-index: 9999 !important;
  width: 100% !important;
}

.notifications .notification {
  margin: 0;
  background-color: #000 !important;
  border-left: none !important;
  border-bottom: 2px solid #393163;
  position: relative;
  padding: 1em 4em 1em 3.5em;
  font-size: 14px;
  cursor: pointer;
}

.notification:before {
  position: absolute;
  width: 1em;
  height: 1em;
  top: 1.2em;
  left: 1.5em;
  border-radius: 100%;
  content: '';
}

.notification:after {
  position: absolute;
  background-image: url('~assets/images/icon-close-round.svg');
  background-repeat: no-repeat;
  width: 2em;
  height: 2em;
  top: 1.2em;
  right: 1.5em;
  content: '';
}

.notification.error:before {
  background-color: #f0649e;
}

.notification.success:before {
  background-color: #2fb4b5;
}

.currency-group .btc,
.currency-group .usd {
  position: relative;
  font-size: 12px;
  color: #a29bbc;
}

.currency-group .btc:after {
  position: absolute;
  top: 0.8em;
  right: 1em;
  content: 'BTC';
}

.currency-group .usd:after {
  position: absolute;
  top: 0.8em;
  right: 1em;
  content: 'USD';
}

.currency-group .btc input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.currency-group .usd input {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

input {
  color: #a29bbc;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  font-size: 18px;
}

.form-control {
  color: #a29bbc;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  font-size: 18px;
}

.form-control:focus {
  color: #a29bbc;
  border: 1px solid rgba(255, 255, 255, 0.03);
  background-color: rgba(255, 255, 255, 0.03);
  box-shadow: 0 0 0 0.1rem #865efc;
}

.form-control.error:focus {
  border: 2px solid #f0649e;
  box-shadow: none;
}

.form-control:disabled {
  background-color: rgba(255, 255, 255, 0.03);
}

.btc-heartbeat {
  font-size: 16px;
}

.btc-heartbeat:before {
  content: '';
  margin-right: 5px;
  margin-left: 5px;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #ff7200;
  position: relative;
  top: 0;
}
</style>
