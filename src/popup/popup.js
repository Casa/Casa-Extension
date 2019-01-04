import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { BigNumber } from 'bignumber.js';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import VTooltip from 'v-tooltip';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// QR & Clipboard Functionality
import VueQRCodeComponent from 'vue-qrcode-component';
import VueClipboard from 'vue-clipboard2';
Vue.component('qr-code', VueQRCodeComponent);
Vue.use(VueClipboard);

// Vue Alerts/ Notifications
import Notifications from 'vue-notification';
Vue.use(Notifications);

// Register Store and Router
import App from './App';
import store from '../store';
import router from './router';

import axios from 'axios';
Vue.prototype.$http = axios;

const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

// Register Layout and Transition Components
import Default from './router/layouts/Default.vue';
import Nested from './router/layouts/Nested.vue';
import Receipt from './router/layouts/Receipt.vue';
import Home from './router/layouts/Home.vue';
import Intro from './router/layouts/Intro.vue';
import TransitionPage from './router/transitions/Transition.vue';
Vue.component('default-layout', Default);
Vue.component('nested-layout', Nested);
Vue.component('receipt-layout', Receipt);
Vue.component('home-layout', Home);
Vue.component('intro-layout', Intro);
Vue.component('transition-page', TransitionPage);

// Register Application Components
import ButtonAction from './components/ButtonAction/index.vue';
import ButtonLink from './components/ButtonLink/index.vue';
import Toggle from './components/Toggle/index.vue';
Vue.component('button-action', ButtonAction);
Vue.component('button-link', ButtonLink);
Vue.component('toggle', Toggle);

Vue.use(BootstrapVue);
Vue.use(VTooltip);
Vue.use(dayjs);

Vue.filter('howLongAgo', value => {
  return dayjs().to(dayjs(value * 1000));
});

Vue.filter('getMonth', value => {
  return dayjs(value).format('MMM');
});

Vue.filter('getDate', value => {
  return dayjs(value).format('D');
});

Vue.filter('truncate', value => {
  if (value !== undefined) {
    return value.slice(0, 25);
  } else {
    return value;
  }
});

// Convert Satoshis to Bitcoin
Vue.filter('btc', val => {
  // Never display numbers as exponents
  BigNumber.config({ EXPONENTIAL_AT: 1e9 });
  const sats = new BigNumber(val);
  const btc = sats.dividedBy(100000000);

  if (isNaN(btc)) {
    return 0;
  }

  return btc.decimalPlaces(8).toString();
});

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({ el: '#app', store, router, render: h => h(App) });
