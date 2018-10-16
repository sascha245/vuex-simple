import Vue from 'vue';
import Vuex from 'vuex';

import { StoreInternals } from './types';
import { injectUtil } from './utils';

export function install(vue: any, options: any) {
  vue.use(Vuex);
  vue.mixin({
    beforeCreate() {
      let container;
      if (this.$store) {
        const storeBuilder = ((this.$store as unknown) as StoreInternals).__storeBuilder__;
        container = storeBuilder ? storeBuilder.container : undefined;
      }
      injectUtil.injectAll(this, container);
    }
  });
}
