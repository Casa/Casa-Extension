import axios from 'axios';
import * as types from './mutation-types';
import router from '../popup/router';

export const login = async ({ commit, state }, payload) => {
  commit(types.SET_AUTH_LOADING);
  try {
    const response = await axios({ method: 'post', url: `${state.settings.baseUrl}:3000/v1/accounts/login`, auth: { username: 'user', password: payload.password } });
    const token = response.data.jwt;
    localStorage.setItem('token', `JWT ${token}`);
    axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
    commit(types.SET_AUTH_SUCCESS, token);
  } catch (e) {
    commit(types.SET_AUTH_ERROR);
    localStorage.removeItem('token');
  }
};

export const logout = async ({ commit }) => {
  commit(types.SET_LOGOUT);
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  router.push('/login');
};

export const setBaseUrl = async ({ commit }, payload) => {
  commit(types.SET_BASE_URL, payload);
};

export const setUnits = async ({ commit }, payload) => {
  commit(types.SET_UNITS, payload);
};

export const setIntroFlag = async ({ commit }) => {
  commit(types.SET_INTRO_FLAG, true);
};

export const setInvoice = async ({ commit }, payload) => {
  // eliminate copy/pasted white space
  const invoice = payload.trim();
  commit(types.SET_INVOICE, invoice);
};

export const setPaymentRequest = async ({ commit }, payload) => {
  commit(types.SET_PAYMENT_REQUEST, payload);
};

export const setSendCoinsRequest = async ({ commit }, payload) => {
  commit(types.SET_SEND_COINS_REQUEST, payload);
};
