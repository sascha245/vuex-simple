import { Container } from 'typedi';
import { Module, Store, StoreOptions } from 'vuex';

import { ModuleBuilder } from './module-builder';

interface StoreBuilderOptions<R> {
  strict?: boolean;
  state: R;
}

export class StoreBuilder<State = any> {
  private _options: StoreOptions<State>;
  private _store?: Store<State>;

  constructor(options: StoreBuilderOptions<State>) {
    this._options = {
      modules: {},
      state: options.state,
      strict: options.strict
    };
  }

  public module<S, R>(namespace: string, state: S): ModuleBuilder<S, State> {
    const moduleBuilder = new ModuleBuilder(this, namespace, state);
    if (this._options.modules) {
      this._options.modules[namespace] = moduleBuilder.module;
    }
    return moduleBuilder;
  }

  public loadModules<T extends { new (...args: any[]): {} }>(modules: T[]) {
    modules.forEach(module => {
      Container.get(module);
    });
  }

  public addModule(namespace: string, moduleOptions: Module<any, any>) {
    if (this._options.modules) {
      this._options.modules[namespace] = moduleOptions;
    }
  }

  public create() {
    this._store = new Store(this._options);
    return this._store;
  }

  public get store() {
    return this._store;
  }
}

const storeBuilderSingleton = new StoreBuilder({
  state: {},
  strict: true
});
const namedStoreBuilderMap: {
  [name: string]: StoreBuilder<any>;
} = Object.create(null);

export function getStoreBuilder(name?: string): StoreBuilder {
  // the default store builder
  if (!name) {
    return storeBuilderSingleton;
  }

  // a named store builder
  const builder =
    namedStoreBuilderMap[name] ||
    (namedStoreBuilderMap[name] = new StoreBuilder({
      state: {},
      strict: true
    }));
  return builder;
}
