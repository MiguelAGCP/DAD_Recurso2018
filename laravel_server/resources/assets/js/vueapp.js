/*jshint esversion: 6 */

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

//import shuffle from 'shuffle-array';

import VueRouter from 'vue-router';
import VueSocketio from 'vue-socket.io';
import Vuex, { mapGetters } from 'vuex';
import {
  mapMutations
} from 'vuex'
import VuexPersistence from 'vuex-persist'
import Element from 'element-ui';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Element);
Vue.use(VueSocketio, 'http://192.168.10.10:8080');

const dash = Vue.component('user', require('./components/dashboard.vue'));
const sueca_game = Vue.component('play', require('./components/play.vue'));
const login = Vue.component('login', require('./components/login.vue'));
const index = Vue.component('index', require('./components/index.vue'));
const statistics = Vue.component('statistics', require('./components/statistics.vue'));
const useraccount = Vue.component('useraccount', require('./components/userAccount.vue'));
const register = Vue.component('register', require('./components/register.vue'));


const routes = [{
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: index
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/dash',
    component: dash
  },
  {
    path: '/play',
    component: sueca_game
  },
  { path: '/statistics',
    component: statistics},
  { 
    path: '/register',
    component: register},
    { 
      path: '/useraccount',
      component: useraccount},
];



const router = new VueRouter({
  routes: routes,
  hashbang: false,
  history: true,
  mode: 'history'


});

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
  state: {
    user: {
      id: '',
      name: '',
      nickname: '',
      avatar: '',
      admin: '',
      refreshToken: '',
      authToken: '',
      headers: {
        Accept: 'application/json',
        Authorization: ''
      }
    }
  },
  mutations: {
    setID(state, id) {
      state.user.id = id;
    },
    setNickname(state, nickname) {
      state.user.nickname = nickname;
    },
    setName(state, name) {
      state.user.name = name;
    },
    setAdmin(state, admin) {
      state.user.admin = admin;
    },
    setAuthToken(state, token) {
      state.user.authToken = token;
    },
    setRefreshToken(state, token) {
      state.user.refreshToken = token;
    },
    setHeaders(state, token) {
      state.user.headers.Authorization = 'Bearer ' + token;
    },
    setAvatar(state, avatar) {
      state.user.avatar = avatar;
    },

  },
  getters: {
    getEmail(state) {
      return state.user.email;
    },
    getName(state) {
      return state.user.email;
    },
    getID(state) {
      return state.user.id;
    },
    getNickname(state) {
      return state.user.nickname;
    },
    getAuthToken(state){
      return state.user.authToken;
    },
    getRefreshToken(state){
      return state.user.refreshToken;
    },
    getAdmin(state){
      return state.user.admin;
    },
    getHeaders(state){
      return state.user.headers;
    },
    getAvatar(state){
      return state.user.avatar;
    }
  },

  methods: {
    ...mapMutations([
      'setID',
      'setNickname',
      'setAdmin',
      'setAuthToken',
      'setRefreshToken',
      'setHeaders',
      'setAvatar'
    ])
  },
  computed: {
    ...mapGetters([
      'getName',
      'getEmail',
      'getID',
      'getNickname',
      'getAuthToken',
      'getRefreshToken',
      'getAdmin',
      'getHeaders',
      'getAvatar'
    ])
  },
  plugins: [vuexLocal.plugin]

});

const app = new Vue({
  router,
  store,
  data: {
    player1: undefined,
    player2: undefined,
    player3: undefined,
    player4: undefined
  }
}).$mount('#app');