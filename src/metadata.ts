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
    applyGetter(moduleBuilder, instance, propertyName);
  });

  proto.__mutations__.forEach(propertyName => {
    applyMutation<State>(moduleBuilder, instance, propertyName);
  });

  proto.__actions__.forEach(propertyName => {
    applyAction<State>(moduleBuilder, instance, propertyName);
  });
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
  propertyName: string
) {
  let getterFunction = instance.__lookupGetter__(propertyName) || ((state: any) => ({}));
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
  propertyName: string
) {
  let mutationFunction: Function = instance[propertyName] || ((payload: any) => undefined);
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
  propertyName: string
) {
  let actionFunction: Function = instance[propertyName] || ((payload: any) => Promise.resolve());
  actionFunction = actionFunction.bind(instance);

  const action: Act<State, any> = (context, payload) => {
    return actionFunction(payload);
  };

  moduleBuilder.addAction(propertyName, action);

  instance[propertyName] = (payload: any) => {
    return moduleBuilder.dispatch(propertyName, payload);
  };
}
