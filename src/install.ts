import Vuex from 'vuex';

import { StoreInternals } from './types';
import { injectUtil } from './utils';

export function install(Vue: any, options: any) {
  Vue.use(Vuex);
  Vue.mixin({
    beforeCreate() {
      let container;
      const store = this.$store;
      if (store) {
        const storeBuilder = ((this.$store as unknown) as StoreInternals).__storeBuilder__;
        container = storeBuilder ? storeBuilder.container : undefined;
      }
      injectUtil.injectAll(this, container);
    }
  });
}
