import Login from './pages/Login';
import Unlock from './pages/Unlock';
import Settings from './pages/Settings';

import Connect from './pages/Intro/Connect';
import Landing from './pages/Intro/Landing';
import Auth from './pages/Intro/Auth';

import Bitcoin from './pages/Bitcoin/Bitcoin';
import BitcoinSend from './pages/Bitcoin/BitcoinSend';
import BitcoinReview from './pages/Bitcoin/BitcoinReview';
import BitcoinDeposit from './pages/Bitcoin/Overlays/BitcoinDeposit';
import BitcoinWithdrawn from './pages/Bitcoin/Overlays/BitcoinWithdrawn';
import BitcoinReceipt from './pages/Bitcoin/Overlays/BitcoinReceipt';

import Lightning from './pages/Lightning/Lightning';
import LightningPayment from './pages/Lightning/LightningPayment';
import LightningReview from './pages/Lightning/LightningReview';
import LightningRequest from './pages/Lightning/LightningRequest';
import OpenChannel from './pages/Lightning/OpenChannel';

import PaymentSent from './pages/Lightning/Overlays/PaymentSent';
import PaymentRequest from './pages/Lightning/Overlays/PaymentRequest';
import LightningReceipt from './pages/Lightning/Overlays/LightningReceipt';

import store from '../../store';

export default [
  {
    path: `/`,
    name: `landing`,
    component: Landing,
    beforeEnter: (to, from, next) => {
      if (store.getters.hasCompletedIntro && store.getters.isLoggedIn) {
        next('/lightning');
        return;
      } else if (store.getters.hasCompletedIntro && !store.getters.isLoggedIn) {
        next('/login');
        return;
      } else {
        next();
        return;
      }
    },
    meta: { requiresAuth: false, transitionName: 'slide', layout: 'home' },
  },
  {
    path: `/connect`,
    name: `connect`,
    component: Connect,
    meta: { requiresAuth: false, transitionName: `slide`, layout: 'home' },
  },
  {
    path: `/settings`,
    name: `settings`,
    component: Settings,
    meta: { requiresAuth: false, transitionName: `slide`, layout: 'intro' },
  },
  {
    path: `/auth`,
    name: `auth`,
    component: Auth,
    meta: { requiresAuth: false, transitionName: 'slide', layout: 'intro' },
  },
  {
    path: `/unlock`,
    name: `unlock`,
    component: Unlock,
    meta: { requiresAuth: false, transitionName: 'slide', layout: 'home' },
  },
  {
    path: `/login`,
    name: `login`,
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.getters.hasCompletedIntro && store.getters.isLoggedIn) {
        next('/lightning');
        return;
      } else if (store.getters.hasCompletedIntro && !store.getters.isLoggedIn) {
        if (to.path === '/login') {
          next();
          return;
        } else {
          next('/login');
          return;
        }
      } else {
        next('/');
        return;
      }
    },
    meta: { requiresAuth: false, transitionName: 'slide', layout: 'home' },
  },
  {
    path: `/lightning`,
    name: `lightning`,
    component: Lightning,
    meta: { requiresAuth: true, transitionName: `slide` },
  },
  {
    path: `/lightning/pay`,
    name: `lightningPay`,
    component: LightningPayment,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/lightning/pay/review`,
    name: `lightningReview`,
    component: LightningReview,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/lightning/pay/success`,
    name: `overlayPaymentSuccess`,
    component: PaymentSent,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/lightning/pay/receipt`,
    name: `lightningReceipt`,
    component: LightningReceipt,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'receipt' },
  },
  {
    path: `/lightning/request`,
    name: `lightningRequest`,
    component: LightningRequest,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/lightning/request/success`,
    name: `overlayRequestSuccess`,
    component: PaymentRequest,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/lightning/channels/new`,
    name: `openChannel`,
    component: OpenChannel,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/bitcoin`,
    name: `bitcoin`,
    component: Bitcoin,
    meta: { requiresAuth: true, transitionName: `slide` },
  },
  {
    path: `/bitcoin/send`,
    name: `bitcoinSend`,
    component: BitcoinSend,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/bitcoin/send/review`,
    name: `bitcoinReview`,
    component: BitcoinReview,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: '/bitcoin/send/success',
    name: 'bitcoinWithdrawn',
    component: BitcoinWithdrawn,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
  {
    path: `/bitcoin/send/receipt`,
    name: `bitcoinReceipt`,
    component: BitcoinReceipt,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'receipt' },
  },
  {
    path: `/bitcoin/deposit`,
    name: `bitcoinDeposit`,
    component: BitcoinDeposit,
    meta: { requiresAuth: true, transitionName: `slide`, layout: 'nested' },
  },
];
