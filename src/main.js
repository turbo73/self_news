// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// import VueResource from 'vue-resource'
import Vuex from 'vuex'
import coreapi from 'coreapi'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$axios = axios;

var auth = new coreapi.auth.SessionAuthentication({
    csrfCookieName: 'csrftoken',
    csrfHeaderName: 'X-CSRFToken'
})
var client = new coreapi.Client({
    auth: auth
})
Vue.use(Vuex)
// Vue.use(VueResource);
Vue.prototype.$http = axios
window.Cookies = require('js-cookie');

import middlewares from './middlewares'
// Vue.http.interceptors.push(middlewares.csrftoken);
// axios.interceptors.response.use(middlewares.csrftoken);
axios.interceptors.request.use(
  config => {
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "delete"||
      config.method === "get"
    ) {
    }
    if (Cookies.get('token')!==undefined) {
      config.headers['Authorization']= 'Token '+Cookies.get('token');
    }
    // 这里我想在Cookies中得到 `csrftoken`，但是会直接跳过，得不到
    if (Cookies.get('csrftoken')!==undefined) {

      config.headers['x-csrftoken']= Cookies.get('csrftoken');  // 'CSRFToken'
    }
    return config;
  },
  error => {
    return Promise.reject(error.data.error.message);
  }
)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    loginName: '',
    channels: '',
    channelIndex: 0,
    channelData: '',
    newDataIndex: '',
    isActive: 0,
    load: true,
    showMy: false,
    showLogin: false,
    collection: [],
    likeImg: require("./assets/like.png")
  },
  mutations: {
    muLoginName(state, data) {
      state.loginName = data
    },
    muChannels(state, data) {
      state.channels = data
    },
    muChannelIndex(state, index) {
      state.channelIndex = index
    },
    muGetData(state, data) {
      state.channelData = data
    },
    muNewDataIndex(state, index) {
      state.newDataIndex = index
    },
    increment(state, index) {
      state.channels.splice(index, 1)
    },
    decrement(state, item) {
      state.channels.push(item)
    },
    loading(state, statu) {
      state.load = statu
    },
    muIsActive(state, index) {
      state.isActive = index
    },
    muShowMy(state, statu) {
      state.showMy = statu
    },
    muShowLogin(state, statu) {
      state.showLogin = statu
    },
    muCollect(state, data) {
      state.collection.push(data)
      // state.collection.reverse()
    },
    muLike(state, data) {
      state.collection.splice(state.collection.indexOf(data), 1)
    },
    muLikeImg(state, url) {
      state.likeImg = url
    }
  },
  actions: {
    acChannels({ commit,state }) {
      return new Promise((resolve, reject) => {
        // Vue.http.get('/api/channel')
        axios.get('/api/channel')
          .then(res => {
            commit('muChannels', res.data.result)
          })
          resolve()
      })
    },
    acGetData({ commit,state }, channel) {
      return new Promise((resolve, reject) => {
        // Vue.http.get('/api/channel/' + channel)
        axios.get('/api/channel/' + channel)
          .then(res => {
            commit('muGetData', res.data.result.list)
            store.state.load = false
          })
          resolve()
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
