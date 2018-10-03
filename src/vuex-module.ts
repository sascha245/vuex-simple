import { Action, Mutation } from 'vuex';

import { ModuleBuilder } from './module-builder';
import { getStoreBuilder, StoreBuilder } from './store-builder';

export abstract class VuexModule<State = any, RootState = any> {
  private _module!: ModuleBuilder<State, RootState>;
  private _state!: State;
  private _namespace!: string;

  public get state() {
    return this._state;
  }

  public get namespace() {
    return this._namespace;
  }

  constructor(options: { namespace: string; state: () => State }) {
    const storeBuilder: StoreBuilder<RootState> = getStoreBuilder();
    this._namespace = options.namespace;
    this._state = options.state();
    this._module = storeBuilder.module(options.namespace, this._state);

    this.applyDecorators();
  }

  private applyDecorators() {
    const constructor = this.constructor;

    const actions: Set<string> = (constructor as any).__actions__;
    const mutations: Set<string> = (constructor as any).__mutations__;
    const proto = constructor.prototype;

    const properties = Object.getOwnPropertyNames(proto);
    properties.forEach(key => {
      if (key === 'constructor') {
        return;
      }
      const descriptor = Object.getOwnPropertyDescriptor(proto, key);
      if (descriptor && typeof descriptor.value === 'function') {
        if (mutations && mutations.has(key)) {
          this.applyMutation(descriptor, key);
        } else if (actions && actions.has(key)) {
          this.applyAction(descriptor, key);
        }
      }
    });
  }

  private applyMutation(descriptor: PropertyDescriptor, propertyName: string) {
    let mutationFunction: Function = descriptor.value
      ? descriptor.value
      : (payload: any) => ({});
    mutationFunction = mutationFunction.bind(this);
    const mutation: Mutation<State> = (state, payload) => {
      mutationFunction(payload);
    };
    this._module.addMutation(propertyName, mutation);

    this.constructor.prototype[propertyName] = (payload: any) => {
      this._module.commit(propertyName, payload);
    };
  }

  private applyAction(descriptor: PropertyDescriptor, propertyName: string) {
    let actionFunction: Function = descriptor.value
      ? descriptor.value
      : (payload: any) => Promise.resolve();
    actionFunction = actionFunction.bind(this);
    const action: Action<State, RootState> = async (context, payload) => {
      actionFunction(payload);
    };
    this._module.addAction(propertyName, action);

    this.constructor.prototype[propertyName] = (payload: any) => {
      this._module.dispatch(propertyName, payload);
    };
  }
}
