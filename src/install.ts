import Vuex from 'vuex';

import { injectUtil } from './utils';

export function install(Vue: any, options: any) {
  Vue.use(Vuex);
  Vue.mixin({
    beforeCreate() {
      injectUtil.injectAll(this.constructor, this);
    }
  });
}
