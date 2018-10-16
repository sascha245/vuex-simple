import Vue from "vue";

import VuexSimple, { getStoreBuilder, StoreBuilder } from "../../src";
import { TestModule } from "./modules/TestModule";

Vue.use(VuexSimple);

const storeBuilder = getStoreBuilder();
storeBuilder.loadModules([TestModule]);

const store = storeBuilder.create();

export default store;
