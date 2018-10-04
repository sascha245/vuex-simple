import { Action as Act, Mutation as Mut } from 'vuex';

import { ModuleBuilder } from './module-builder';
import { DecoratorType } from './types';
import Utils from './utils';

export function applyDecorators<State>(moduleBuilder: ModuleBuilder<State, any>, instance: any) {
  const constructor = instance.constructor;
  const decorators = Utils.getDecorators(constructor);
  const proto = constructor.prototype;

  const properties = Object.getOwnPropertyNames(proto);
  properties.forEach(key => {
    if (key === 'constructor') {
      return;
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (descriptor && typeof descriptor.value === 'function') {
      const decorator = decorators.get(key);
      if (decorator) {
        switch (decorator) {
          case DecoratorType.MUTATION:
            applyMutation<State>(moduleBuilder, instance, constructor, descriptor, key);
            break;
          case DecoratorType.ACTION:
            applyAction<State>(moduleBuilder, instance, constructor, descriptor, key);
            break;
        }
      }
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
