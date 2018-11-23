import 'reflect-metadata';

import Vue from 'vue';
import VueTypedi from 'vue-typedi';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueTypedi);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');
