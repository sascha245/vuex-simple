import { ModuleOptions, ModuleTree, Plugin, Store, StoreOptions } from 'vuex';

import { removeStaticError } from './errors';
import { transformRecursive } from './transform';
import { ModuleProvider, StoreProvider } from './types';

interface TypedStore<T> extends Store<any> {
  __vxs_root__: T;
  __vxs_modules__: Map<string, ModuleProvider>;
}

interface TypedStoreOptions<S> {
  strict: boolean;
  plugins: Array<Plugin<S>>;
  modules: ModuleTree<S>;
}

export function createVuexStore<T extends object>(
  pModule: T,
  pOptions?: Partial<TypedStoreOptions<any>>
): Store<any> {
  const storeProvider: StoreProvider = {
    modules: new Map()
  };
  const userOptions = {
    modules: {},
    plugins: [],
    strict: false,
    ...pOptions
  };
  const options: StoreOptions<any> = transformRecursive(storeProvider, pModule);
  options.strict = userOptions.strict;
  options.modules = {
    ...options.modules,
    ...userOptions.modules
  };
  options.plugins = userOptions.plugins;
  const store = new Store(options) as TypedStore<T>;
  store.__vxs_root__ = pModule;
  store.__vxs_modules__ = storeProvider.modules;
  storeProvider.store = store;
  return store;
}

export function registerModule<T extends object>(
  store: Store<any>,
  namespace: string[],
  instance: T,
  options?: ModuleOptions
) {
  const typedStore = store as TypedStore<any>;
  if (!typedStore.__vxs_modules__) {
    typedStore.__vxs_modules__ = new Map();
  }
  const storeProvider: StoreProvider = {
    modules: typedStore.__vxs_modules__
  };
  const vuexModule = transformRecursive(storeProvider, instance, namespace, true);
  store.registerModule(namespace, vuexModule, options);
  storeProvider.store = store;
}

export function unregisterModule(store: Store<any>, namespace: string[]) {
  const joinedNamespace = namespace.join('/');
  const typedStore = store as TypedStore<any>;
  if (!typedStore.__vxs_modules__) {
    typedStore.__vxs_modules__ = new Map();
  }
  const moduleProvider = typedStore.__vxs_modules__.get(joinedNamespace);
  const isDynamic = moduleProvider ? moduleProvider.dynamic : true;
  if (!isDynamic) {
    throw removeStaticError(joinedNamespace);
  }
  // Remove module
  typedStore.__vxs_modules__.delete(joinedNamespace);
  // Remove submodules
  const submodulesNamespace = joinedNamespace + '/';
  const keys = Array.from(typedStore.__vxs_modules__.keys());
  keys
    .filter(key => key.startsWith(submodulesNamespace))
    .forEach(key => typedStore.__vxs_modules__.delete(key));
  // Unregister module from vuex store
  store.unregisterModule(namespace);
}

export function useStore<T extends object>(vuexStore: Store<any>): T {
  const typedStore = vuexStore as TypedStore<T>;
  return typedStore.__vxs_root__;
}

export function useModule<T extends object>(
  vuexStore: Store<any>,
  namespace: string[] = []
): T | undefined {
  const joinedNamespace: string = namespace.join('/');
  const typedStore = vuexStore as TypedStore<T>;
  if (!typedStore.__vxs_modules__) {
    typedStore.__vxs_modules__ = new Map();
  }
  const moduleProvider = typedStore.__vxs_modules__.get(joinedNamespace);
  return moduleProvider ? (moduleProvider.module as T) : undefined;
}
