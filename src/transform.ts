import { Module } from 'vuex';

import { alreadyExistsError } from './errors';
import { StoreBuilder, StoreProvider } from './types';
import { getDecorators } from './utils';

export function transformRecursive<T extends object>(
  pStoreProvider: StoreProvider,
  pModule: T,
  pNamespace: string[] = [],
  dynamic: boolean = false
): Module<any, any> {
  const joinedNamespace = pNamespace.join('/');
  if (pStoreProvider.modules.has(joinedNamespace)) {
    throw alreadyExistsError(joinedNamespace);
  }
  pStoreProvider.modules.set(joinedNamespace, {
    dynamic,
    module: pModule
  });

  const storeOptions: Module<any, any> = {
    actions: {},
    getters: {},
    modules: {},
    mutations: {},
    namespaced: true,
    state: {}
  };

  const builder: StoreBuilder = {
    dynamic,
    namespaces: pNamespace,
    options: storeOptions,
    provider: pStoreProvider
  };

  const constructor = pModule.constructor;
  const decorators = getDecorators(constructor);
  decorators.forEach((decorator, propertyName) => decorator(builder, pModule, propertyName));
  return storeOptions;
}
