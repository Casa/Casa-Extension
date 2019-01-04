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
    commit(types.SET_AUTH_ERROR, token);
    localStorage.removeItem('token');
  }
};

export const logout = async ({ commit, state }, payload) => {
  commit(types.SET_LOGOUT);
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  router.push('/login');
};

export const setBaseUrl = async ({ commit, state }, payload) => {
  commit(types.SET_BASE_URL, payload);
};

export const setIntroFlag = async ({ commit, state }) => {
  commit(types.SET_INTRO_FLAG, true);
};

export const setInvoice = async ({ commit, state }, payload) => {
  commit(types.SET_INVOICE, payload);
};

export const setPaymentRequest = async ({ commit, state }, payload) => {
  commit(types.SET_PAYMENT_REQUEST, payload);
};

export const setSendCoinsRequest = async ({ commit, state }, payload) => {
  commit(types.SET_SEND_COINS_REQUEST, payload);
};
