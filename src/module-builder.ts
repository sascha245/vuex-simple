import { Action, Getter, Module, Mutation } from 'vuex';

import { StoreBuilder } from './store-builder';

export interface ModuleBuilderOptions<State, RootState> {
  storeBuilder: StoreBuilder<RootState>;
  parentBuilder?: ModuleBuilder;
  name: string;
  state: State;
}

export class ModuleBuilder<State = any, RootState = any> {
  private _storeBuilder: StoreBuilder<RootState>;
  private _parentBuilder?: ModuleBuilder;

  private _module: Module<State, RootState>;
  private _namespace: string;
  private _name: string;

  constructor(options: ModuleBuilderOptions<State, RootState>) {
    this._storeBuilder = options.storeBuilder;
    this._name = options.name;
    this._parentBuilder = options.parentBuilder;
    this._namespace = this._parentBuilder
      ? `${this._parentBuilder.namespace}/${this._name}`
      : this._name;

    if (this._parentBuilder) {
      this._parentBuilder.state()[this._name] = options.state;
    }
    this._module = {
      actions: {},
      getters: {},
      modules: {},
      mutations: {},
      namespaced: true,
      state: options.state
    };
  }

  public addAction(name: string, action: Action<State, RootState>) {
    if (this._module.actions) {
      this._module.actions[name] = action;
    }
  }
  public addMutation(name: string, mutation: Mutation<State>) {
    if (this._module.mutations) {
      this._module.mutations[name] = mutation;
    }
  }
  public addGetter(name: string, getter: Getter<State, RootState>) {
    if (this._module.getters) {
      this._module.getters[name] = getter;
    }
  }
  public addModule(name: string, moduleBuilder: ModuleBuilder) {
    if (this._module.modules) {
      this._module.modules[name] = moduleBuilder.module;
    }
  }

  public state() {
    if (!this._storeBuilder.store) {
      return this._module.state;
    }
    if (this._parentBuilder) {
      return this._parentBuilder.state()[this._name];
    }
    return this._storeBuilder.store.state[this._name];
  }

  public commit(name: string, payload: any) {
    if (this._storeBuilder && this._storeBuilder.store) {
      return this._storeBuilder.store.commit(this.namespace + '/' + name, payload);
    } else {
      throw new Error('Could not commit: no store created');
    }
  }

  public read(name: string) {
    if (this._storeBuilder && this._storeBuilder.store) {
      return this._storeBuilder.store.getters[this.namespace + '/' + name];
    } else {
      throw new Error('Could not commit: no store created');
    }
  }

  public dispatch(name: string, payload: any) {
    if (this._storeBuilder && this._storeBuilder.store) {
      return this._storeBuilder.store.dispatch(this.namespace + '/' + name, payload);
    } else {
      throw new Error('Could not dispatch: no store created');
    }
  }

  public get module() {
    return this._module;
  }

  public get namespace() {
    return this._namespace;
  }

  public get storeBuilder() {
    return this._storeBuilder;
  }

  public get parentBuilder() {
    return this._parentBuilder;
  }
}
