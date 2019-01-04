import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    settings: {
      baseUrl: '',
      intro: '',
      status: '',
      token: localStorage.getItem('token') || '',
    },
    invoice: '',
    newTransaction: '',
    paymentRequest: '',
  },
  actions,
  getters,
  mutations,
});
