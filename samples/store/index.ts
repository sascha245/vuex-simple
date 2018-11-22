import Vue from 'vue';
import Vuex from 'vuex';

import { createVuexStore } from '../../src';
import { MyStore } from './store';

Vue.use(Vuex);

export default createVuexStore(new MyStore(), {
  strict: true
});
