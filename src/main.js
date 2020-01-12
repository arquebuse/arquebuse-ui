import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import store from './store'
import axios from 'axios'
import { iconsSet as icons } from './assets/icons/icons.js'
import { apiHost } from './config'
import {AUTH_LOGOUT} from './store/actions/auth'

// Axios configuration
axios.defaults.baseURL = apiHost;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters.bearerToken;
axios.interceptors.response.use(response => {
  return new Promise((resolve) => {
    resolve(response)
  });
}, error => {
  if (error.response.status === 401) {
    store.dispatch(AUTH_LOGOUT, 'unauthorized').then(() => {
      if (router.currentRoute.path !== '/login') {
        router.push('/login').then()
      }
    })
  }
  return Promise.reject(error);
});

// Vue configuration
Vue.config.performance = true;
Vue.config.productionTip = false;
Vue.use(CoreuiVue);

new Vue({
  el: '#app',
  router,
  icons,
  store,
  template: '<App/>',
  components: {
    App
  },
});
