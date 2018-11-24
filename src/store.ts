import { Action, Getter, Module, ModuleTree, Mutation, Plugin, Store, StoreOptions } from 'vuex';

import { DecoratorType } from './types';
import { getDecorators } from './utils';

interface StoreProvider {
  store?: Store<any>;
}

interface StoreBuilder {
  namespaces: string[];
  options: Module<any, any>;
  provider: StoreProvider;
}

interface TypedStore<T> extends Store<any> {
  __root__: T;
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
    store: undefined
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
  store.__root__ = pModule;
  storeProvider.store = store;
  return store;
}

export function useStore<T extends object>(vuexStore: Store<any>): T {
  const typedStore = vuexStore as TypedStore<T>;
  return typedStore.__root__;
}

function transformRecursive(
  pStoreProvider: StoreProvider,
  pModule: any,
  pNamespace: string[] = []
): Module<any, any> {
  const storeOptions: Module<any, any> = {
    actions: {},
    getters: {},
    modules: {},
    mutations: {},
    namespaced: true,
    state: {}
  };

  const builder: StoreBuilder = {
    namespaces: pNamespace,
    options: storeOptions,
    provider: pStoreProvider
  };

  const constructor = pModule.constructor;
  const decorators = getDecorators(constructor);
  decorators.forEach(decorator => {
    const { type, propertyName } = decorator;
    switch (type) {
      case DecoratorType.STATE:
        return bindState(builder, pModule, propertyName);
      case DecoratorType.GETTER:
        return bindGetter(builder, pModule, propertyName);
      case DecoratorType.MUTATION:
        return bindMutation(builder, pModule, propertyName);
      case DecoratorType.ACTION:
        return bindAction(builder, pModule, propertyName);
      case DecoratorType.MODULE:
        return bindModule(builder, pModule, propertyName);
        break;
    }
  });
  return storeOptions;
}

function getState(pState: any, pNamespace: string[]) {
  let state = pState;
  for (const namespace of pNamespace) {
    state = state[namespace];
  }
  return state;
}

function bindState(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const value = pModule[propertyName];
  const provider = pBuilder.provider;
  const options = pBuilder.options;
  Object.defineProperty(pModule, propertyName, {
    get() {
      const state = provider.store
        ? getState(provider.store.state, pBuilder.namespaces)
        : options.state;
      return state[propertyName];
    },
    set(val: any) {
      const state = provider.store
        ? getState(provider.store.state, pBuilder.namespaces)
        : options.state;
      state[propertyName] = val;
    }
  });
  pModule[propertyName] = value;
}

function getGetter(pModule: any, propertyName: string): Getter<any, any> {
  const getter = pModule.__lookupGetter__(propertyName);
  if (!getter) {
    const className = pModule.constructor.name;
    throw {
      code: 'getter_not_found',
      message: `Could not find getter "${propertyName}" for module ${className}`,
      params: {
        className,
        propertyName
      }
    };
  }
  const boundGetter = getter.bind(pModule);
  return state => boundGetter();
}

function bindGetter(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const options = pBuilder.options;
  const provider = pBuilder.provider;
  options.getters![propertyName] = getGetter(pModule, propertyName);
  const getterName = pBuilder.namespaces.join('/') + '/' + propertyName;

  Object.defineProperty(pModule, propertyName, {
    get() {
      return provider.store!.getters[getterName];
    }
  });
}

function getMutation(pModule: any, propertyName: string): Mutation<any> {
  const mutation: Function = pModule[propertyName];
  const boundMutation = mutation.bind(pModule);
  return (state, payload) => boundMutation(payload);
}

function bindMutation(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const options = pBuilder.options;
  const provider = pBuilder.provider;
  options.mutations![propertyName] = getMutation(pModule, propertyName);
  const mutationName = pBuilder.namespaces.join('/') + '/' + propertyName;

  pModule[propertyName] = (payload: any) => {
    provider.store!.commit(mutationName, payload);
  };
}

function getAction(pModule: any, propertyName: string): Action<any, any> {
  const action: Function = pModule[propertyName];
  const boundAction = action.bind(pModule);
  return (state, payload) => boundAction(payload);
}

function bindAction(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const options = pBuilder.options;
  const provider = pBuilder.provider;
  options.actions![propertyName] = getAction(pModule, propertyName);
  const actionName = pBuilder.namespaces.join('/') + '/' + propertyName;

  pModule[propertyName] = (payload: any) => {
    provider.store!.dispatch(actionName, payload);
  };
}

function bindModule(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const subModule = pModule[propertyName];
  if (!subModule) {
    return;
  }
  const moduleOptions = transformRecursive(
    pBuilder.provider,
    subModule,
    pBuilder.namespaces.concat(propertyName)
  );
  const options = pBuilder.options;
  options.modules![propertyName] = moduleOptions;

  Object.defineProperty(pModule, propertyName, {
    get() {
      return subModule;
    }
  });
}
