import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE, AUTH_RENEW, AUTH_LOGOUT } from '../actions/auth'
import axios from "axios"

const state = {
  bearerToken: localStorage.getItem('user-token') || '',
  fullName: localStorage.getItem('fullName') || '',
  status: '',
};

const getters = {
  isAuthenticated: state => !!state.bearerToken,
  status: state => state.status,
  bearerToken: state => state.bearerToken,
  fullName: state => state.fullName,
};

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {

    return new Promise((resolve, reject) => {
      axios({ method: "POST", "url": "/authentication/login", "data": user, "headers": { "content-type": "application/json" }}).then(resp => {
        commit(AUTH_SUCCESS, resp);
        resolve(resp)
      })
      .catch(err => {
        commit(AUTH_FAILURE);
        reject(err)
      })
    })
  },
  [AUTH_RENEW]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      axios({ method: "GET", "url": "/authentication/renew"}).then(resp => {
        commit(AUTH_SUCCESS, resp);
        resolve(resp)
      })
      .catch(err => {
        commit(AUTH_FAILURE);
        reject(err)
      })
    })
  },
  [AUTH_LOGOUT]: ({commit}, reason) => {
    return new Promise((resolve) => {
      if (reason === 'unauthorized') {
        commit(AUTH_FAILURE);
      }
      else {
        commit(AUTH_LOGOUT);
      }
      resolve()
    })
  }
};

const mutations = {
  [AUTH_SUCCESS]: (state, resp) => {
    state.bearerToken = resp.data.bearerToken;
    state.status = 'LOGGED_IN';
    state.fullName = resp.data.fullName;
    localStorage.setItem('user-token', resp.data.bearerToken);
    localStorage.setItem('fullName', resp.data.fullName);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + resp.data.bearerToken;
  },
  [AUTH_FAILURE]: (state) => {
    state.bearerToken = '';
    state.status = 'DISCONNECTED';
    state.fullName = '';
    localStorage.removeItem('user-token');
    localStorage.removeItem('fullName');
    axios.defaults.headers.common['Authorization'] = '';
  },
  [AUTH_LOGOUT]: (state) => {
    state.bearerToken = '';
    state.status = 'LOGGED_OUT';
    state.fullName = '';
    localStorage.removeItem('user-token');
    localStorage.removeItem('fullName');
    axios.defaults.headers.common['Authorization'] = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
}
