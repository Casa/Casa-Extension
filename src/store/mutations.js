import * as types from './mutation-types';

export default {
  [types.SET_INTRO_FLAG](state, payload) {
    state.settings.intro = payload;
  },
  [types.SET_BASE_URL](state, payload) {
    state.settings.baseUrl = payload;
  },
  [types.SET_UNITS](state, payload) {
    state.settings.units = payload;
  },
  [types.SET_INVOICE](state, payload) {
    state.invoice = payload;
  },
  [types.SET_PAYMENT_REQUEST](state, payload) {
    state.paymentRequest = payload;
  },
  [types.SET_SEND_COINS_REQUEST](state, payload) {
    state.newTransaction = payload;
  },
  [types.SET_AUTH_LOADING](state, payload) {
    state.status = 'loading';
  },
  [types.SET_AUTH_SUCCESS](state, payload) {
    state.settings.status = 'success';
    state.settings.token = payload;
  },
  [types.SET_AUTH_ERROR](state, payload) {
    state.settings.status = 'error';
  },
  [types.SET_LOGOUT](state, payload) {
    state.settings.status = '';
    state.settings.token = '';
  },
};
