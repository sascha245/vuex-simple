import Vue from 'vue';
import { Action as Act, Mutation as Mut } from 'vuex';

import { ModuleBuilder } from './module-builder';
import { DecoratorType } from './types';
import Utils from './utils';

function getMethodDescriptor(prototype: any, propertyName: string) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
  if (descriptor && typeof descriptor.value === 'function') {
    return descriptor;
  }
  return undefined;
}

export function applyDecorators<State>(moduleBuilder: ModuleBuilder<State, any>, instance: any) {
  const constructor = instance.constructor;
  const decorators = Utils.getDecorators(constructor);
  const proto = constructor.prototype;

  applyStates(instance);

  const properties = Object.getOwnPropertyNames(proto);
  properties.forEach(key => {
    if (key === 'constructor') {
      return;
    }

    const decorator = decorators.get(key);
    const descriptor = getMethodDescriptor(proto, key);

    if (decorator) {
      switch (decorator) {
        case DecoratorType.MUTATION:
          if (descriptor) {
            applyMutation<State>(moduleBuilder, instance, constructor, descriptor, key);
          }
          break;
        case DecoratorType.ACTION:
          if (descriptor) {
            applyAction<State>(moduleBuilder, instance, constructor, descriptor, key);
          }
          break;
      }
    }
  });
}

function applyStates(instance: any) {
  const constructor = instance.constructor;
  const decorators = Utils.getDecorators(constructor);
  const keys = Object.keys(instance);

  keys.forEach(propertyName => {
    const decorator = decorators.get(propertyName);
    if (decorator && decorator === DecoratorType.STATE) {
      Vue.set(instance.__state__, propertyName, instance[propertyName]);
      Object.defineProperty(instance, propertyName, {
        get() {
          return instance.__state__[propertyName];
        },
        set(val: any) {
          instance.__state__[propertyName] = val;
        }
      });
    }
  });
}

function applyMutation<State>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any,
  constructor: any,
  descriptor: PropertyDescriptor,
  propertyName: string
) {
  let mutationFunction: Function = descriptor.value ? descriptor.value : (payload: any) => ({});
  mutationFunction = mutationFunction.bind(instance);
  const mutation: Mut<State> = (state, payload) => {
    mutationFunction(payload);
  };
  moduleBuilder.addMutation(propertyName, mutation);

  constructor.prototype[propertyName] = (payload: any) => {
    moduleBuilder.commit(propertyName, payload);
  };
}

function applyAction<State>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any,
  constructor: any,
  descriptor: PropertyDescriptor,
  propertyName: string
) {
  let actionFunction: Function = descriptor.value
    ? descriptor.value
    : (payload: any) => Promise.resolve();
  actionFunction = actionFunction.bind(instance);
  const action: Act<State, any> = (context, payload) => {
    return actionFunction(payload);
  };
  moduleBuilder.addAction(propertyName, action);

  constructor.prototype[propertyName] = (payload: any) => {
    return moduleBuilder.dispatch(propertyName, payload);
  };
}
