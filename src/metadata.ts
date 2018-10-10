import { Action as Act, Getter, Mutation as Mut } from 'vuex';

import { ModuleBuilder } from './module-builder';
import { DecoratorType } from './types';
import { getDecorators } from './utils/decorator-util';

interface DecoratedPrototype {
  __states__: string[];
  __getters__: string[];
  __mutations__: string[];
  __actions__: string[];
}

export function collectDecorators(ctor) {
  const decorators = getDecorators(ctor);
  const proto: DecoratedPrototype = ctor.prototype;

  proto.__states__ = [];
  proto.__getters__ = [];
  proto.__mutations__ = [];
  proto.__actions__ = [];

  decorators.forEach((decorator, key) => {
    switch (decorator) {
      case DecoratorType.STATE:
        proto.__states__.push(key);
        break;
      case DecoratorType.GETTER:
        proto.__getters__.push(key);
        break;
      case DecoratorType.MUTATION:
        proto.__mutations__.push(key);
        break;
      case DecoratorType.ACTION:
        proto.__actions__.push(key);
        break;
    }
  });
}

export function applyDecorators<State>(moduleBuilder: ModuleBuilder<State, any>, instance: any) {
  const constructor = instance.constructor;
  const proto: DecoratedPrototype = constructor.prototype;

  proto.__states__.forEach(propertyName => {
    applyState(moduleBuilder, instance, propertyName);
  });

  proto.__getters__.forEach(propertyName => {
    const accessorDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);
    if (accessorDescriptor && typeof accessorDescriptor.get === 'function') {
      applyGetter(moduleBuilder, instance, accessorDescriptor, propertyName);
    }
  });

  proto.__mutations__.forEach(propertyName => {
    const descriptor = getMethodDescriptor(proto, propertyName);
    if (descriptor) {
      applyMutation<State>(moduleBuilder, instance, descriptor, propertyName);
    }
  });

  proto.__actions__.forEach(propertyName => {
    const descriptor = getMethodDescriptor(proto, propertyName);
    if (descriptor) {
      applyAction<State>(moduleBuilder, instance, descriptor, propertyName);
    }
  });
}

function getMethodDescriptor(prototype: any, propertyName: string) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
  if (descriptor && typeof descriptor.value === 'function') {
    return descriptor;
  }
  return undefined;
}

function applyState<State>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any,
  propertyName: string
) {
  const value = instance[propertyName];
  Object.defineProperty(instance, propertyName, {
    get() {
      return moduleBuilder.state()[propertyName];
    },
    set(val: any) {
      moduleBuilder.state()[propertyName] = val;
    }
  });
  instance[propertyName] = value;
}

function applyGetter<State>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any,
  descriptor: PropertyDescriptor,
  propertyName: string
) {
  let getterFunction: Function = descriptor.get ? descriptor.get : (state: any) => ({});
  getterFunction = getterFunction.bind(instance);

  const getter: Getter<State, any> = state => {
    return getterFunction();
  };
  moduleBuilder.addGetter(propertyName, getter);

  Object.defineProperty(instance, propertyName, {
    get() {
      return moduleBuilder.read(propertyName);
    }
  });
}

function applyMutation<State>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any,
  descriptor: PropertyDescriptor,
  propertyName: string
) {
  let mutationFunction: Function = descriptor.value
    ? descriptor.value
    : (payload: any) => undefined;
  mutationFunction = mutationFunction.bind(instance);

  const mutation: Mut<State> = (state, payload) => {
    mutationFunction(payload);
  };
  moduleBuilder.addMutation(propertyName, mutation);

  instance[propertyName] = (payload: any) => {
    moduleBuilder.commit(propertyName, payload);
  };
}

function applyAction<State>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any,
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

  instance[propertyName] = (payload: any) => {
    return moduleBuilder.dispatch(propertyName, payload);
  };
}
