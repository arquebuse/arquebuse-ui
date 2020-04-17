import {AUTH_FAILURE, AUTH_LOGOUT, AUTH_RENEW, AUTH_REQUEST, AUTH_SUCCESS} from '../actions'
import axios from "axios"
import jwt_decode from "jwt-decode"

const state = {
  bearerToken: localStorage.getItem('user-token') || '',
  expire: localStorage.getItem('expire') || 0,
  fullName: localStorage.getItem('fullName') || '',
  status: '',
  username: localStorage.getItem('username') || '',
};

const getters = {
  bearerToken: state => state.bearerToken,
  expire: state => state.expire,
  fullName: state => state.fullName,
  isAuthenticated: state => !!state.bearerToken,
  status: state => state.status,
  username: state => state.username,
};

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        "url": "/authentication/login",
        "data": user,
        "headers": {"content-type": "application/json"}
      }).then(resp => {
        commit(AUTH_SUCCESS, resp);
        resolve(resp)
      }).catch(err => {
        commit(AUTH_FAILURE);
        reject(err)
      })
    })
  },
  [AUTH_RENEW]: ({commit}) => {
    // Renew jwt token if expiration is less than 5 minutes
    let now = new Date().getTime() / 1000;
    if (state.expire - now < 300) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          "url": "/authentication/renew"
        }).then(resp => {
          commit(AUTH_SUCCESS, resp);
          resolve(resp)
        }).catch(err => {
          commit(AUTH_FAILURE);
          reject(err)
        })
      })
    }
  },
  [AUTH_LOGOUT]: ({commit}, reason) => {
    return new Promise((resolve) => {
      if (reason === 'unauthorized') {
        commit(AUTH_FAILURE);
      } else {
        commit(AUTH_LOGOUT);
      }
      resolve()
    })
  }
};

const mutations = {
  [AUTH_SUCCESS]: (state, resp) => {
    let decodedToken = jwt_decode(resp.data.bearerToken);
    state.bearerToken = resp.data.bearerToken;
    state.expire = decodedToken.exp;
    state.fullName = resp.data.fullName;
    state.status = 'LOGGED_IN';
    state.username = resp.data.username;
    localStorage.setItem('user-token', state.bearerToken);
    localStorage.setItem('expire', state.expire);
    localStorage.setItem('fullName', state.fullName);
    localStorage.setItem('username', state.username);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + state.bearerToken;
  },
  [AUTH_FAILURE]: (state) => {
    state.bearerToken = '';
    state.expire = 0;
    state.fullName = '';
    state.status = 'DISCONNECTED';
    state.username = '';
    localStorage.removeItem('user-token');
    localStorage.removeItem('expire');
    localStorage.removeItem('fullName');
    localStorage.removeItem('username');
    axios.defaults.headers.common['Authorization'] = '';
  },
  [AUTH_LOGOUT]: (state) => {
    state.bearerToken = '';
    state.expire = 0;
    state.fullName = '';
    state.status = 'LOGGED_OUT';
    state.username = '';
    localStorage.removeItem('user-token');
    localStorage.removeItem('expire');
    localStorage.removeItem('fullName');
    localStorage.removeItem('username');
    axios.defaults.headers.common['Authorization'] = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
}
