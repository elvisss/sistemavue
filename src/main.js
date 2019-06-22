import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:57116/'
axios.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = store.state.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
