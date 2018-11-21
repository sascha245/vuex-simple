import Vue from 'vue';

import VuexSimple, { getStoreBuilder } from '../../src';
import { TestModule } from './modules/TestModule';

Vue.use(VuexSimple);

const storeBuilder = getStoreBuilder();
storeBuilder.initialize({
  modules: {},
  strict: false
});
storeBuilder.loadModules([TestModule]);

const store = storeBuilder.create();

export default store;
