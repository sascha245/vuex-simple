import Vue from 'vue';
import { Container } from 'vue-typedi';
import Vuex from 'vuex';

import { createVuexStore } from '../../src';
import { MyStore } from './store';
import tokens from './tokens';

Vue.use(Vuex);

const instance = new MyStore();

Container.set(tokens.MY, instance.my);
Container.set(tokens.TEST, instance.test);
Container.set(tokens.TEST_MY1, instance.test.my1);
Container.set(tokens.TEST_MY2, instance.test.my2);

export default createVuexStore(instance, {
  strict: true
});
