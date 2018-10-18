import Vue from 'vue';

import VuexSimple, { getStoreBuilder, StoreBuilder } from '../../src';
import { TestModule } from './modules/TestModule';

Vue.use(VuexSimple);

// const storeBuilder = new StoreBuilder({
//   modules: {},
//   strict: false
// });

const storeBuilder = getStoreBuilder();
storeBuilder.initialize({
  modules: {},
  strict: false
});
storeBuilder.loadModules([TestModule]);

const store = storeBuilder.create();

export default store;
