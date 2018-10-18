import { Container, ContainerInstance } from 'typedi';
import { Module, Store, StoreOptions } from 'vuex';

import { ModuleBuilder } from './module-builder';
import { ModuleInternals, StoreInternals } from './types';

interface StoreBuilderOptions<R> extends StoreOptions<R> {
  container?: ContainerInstance;
}

export class StoreBuilder<State extends Object> {
  private _container!: ContainerInstance;
  private _options!: StoreOptions<State>;
  private _store?: Store<State>;

  public get container() {
    return this._container;
  }
  public get store() {
    return this._store;
  }

  constructor(options: StoreBuilderOptions<State> = {}) {
    this.initialize(options);
  }

  public initialize(options: StoreBuilderOptions<State>) {
    this._container = options.container || Container.of(undefined);
    this._options = {
      actions: options.actions || {},
      getters: options.getters || {},
      modules: options.modules || {},
      mutations: options.mutations || {},
      plugins: options.plugins || [],
      state: options.state,
      strict: options.strict || true
    };
  }

  public useContainer(container: ContainerInstance) {
    this._container = container;
  }

  public setStrict(strict: boolean) {
    this._options.strict = strict;
  }

  public merge(options: StoreOptions<State>) {
    this._options = {
      actions: {
        ...this._options.actions!,
        ...(options.actions || {})
      },
      getters: {
        ...this._options.getters!,
        ...(options.getters || {})
      },
      modules: {
        ...this._options.modules!,
        ...(options.modules || {})
      },
      mutations: {
        ...this._options.mutations!,
        ...(options.mutations || {})
      },
      plugins: [...this._options.plugins!, ...(options.plugins || [])],
      state: {
        ...(this._options.state as any),
        ...((options.state as any) || {})
      },
      strict: options.strict || this._options.strict
    };
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
}

const storeBuilderSingleton = new StoreBuilder({
  state: {},
  strict: true
});
const namedStoreBuilderMap: {
  [name: string]: StoreBuilder<{}>;
} = {};

export function getStoreBuilder(name?: string): StoreBuilder<{}> {
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
