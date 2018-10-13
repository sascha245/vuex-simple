import { Container, ContainerInstance } from 'typedi';
import { Module, Store, StoreOptions } from 'vuex';

import { ModuleBuilder } from './module-builder';
import { ModuleInternals, StoreInternals } from './types';

interface StoreBuilderOptions<R> {
  container?: ContainerInstance;
  strict?: boolean;
  state: R;
}

export class StoreBuilder<State = any> {
  private _options: StoreOptions<State>;
  private _store?: Store<State>;
  private _container: ContainerInstance;

  constructor(options: StoreBuilderOptions<State>) {
    this._container = options.container || Container.of(undefined);
    this._options = {
      modules: {},
      state: options.state,
      strict: options.strict
    };
  }

  public get container() {
    return this._container;
  }

  public useContainer(container: ContainerInstance) {
    this._container = container;
  }

  public loadModules<T extends { new (...args: any[]): {} }>(modules: T[]) {
    modules.forEach(moduleClass => {
      this.loadModule(moduleClass);
    });
  }

  public loadModule<T extends { new (...args: any[]): {} }>(moduleClass: T) {
    let instance = this._container.get(moduleClass);
    if (!instance) {
      instance = new moduleClass();
      this._container.set(moduleClass, instance);
    }
    const moduleBuilder: ModuleBuilder = (instance as ModuleInternals).__moduleBuilder__;
    if (this._options.modules) {
      moduleBuilder.setStoreBuilder(this);
      this._options.modules[moduleBuilder.namespace] = moduleBuilder.module;
    }
  }

  public addModule(namespace: string, moduleOptions: Module<any, any>) {
    if (this._options.modules) {
      this._options.modules[namespace] = moduleOptions;
    }
  }

  public create() {
    this._store = new Store(this._options);
    ((this._store as unknown) as StoreInternals).__storeBuilder__ = this;
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
} = {};

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
