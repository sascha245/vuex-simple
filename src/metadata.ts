import { Action as Act, Getter, Mutation as Mut } from 'vuex';

import { ModuleBuilder } from './module-builder';
import { StoreBuilder } from './store-builder';
import { Decorator, DecoratorType, ModuleInternals, ModuleOptions } from './types';
import { getDecorators } from './utils/decorator-util';
import * as injectUtil from './utils/inject-util';

export function instanceToModule(
  name: string,
  instance: Object,
  storeBuilder: StoreBuilder,
  parent?: ModuleBuilder
) {
  if (!instance || !(instance instanceof Object)) {
    return undefined;
  }
  const moduleBuilder = new ModuleBuilder({
    name,
    parentBuilder: parent,
    state: {},
    storeBuilder
  });
  applyDecorators(moduleBuilder, instance);

  (moduleBuilder as any).__instance__ = instance;
  (instance as ModuleInternals).__moduleBuilder__ = moduleBuilder;

  injectUtil.injectAll(instance);

  return moduleBuilder;
}

export function applyDecorators<State = any>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any
) {
  const constructor = instance.constructor;
  const decorators = getDecorators(constructor);
  decorators.forEach(decorator => {
    const { type, propertyName } = decorator;
    switch (type) {
      case DecoratorType.STATE:
        applyState(moduleBuilder, instance, propertyName);
        break;
      case DecoratorType.GETTER:
        applyGetter(moduleBuilder, instance, propertyName);
        break;
      case DecoratorType.MUTATION:
        applyMutation<State>(moduleBuilder, instance, propertyName);
        break;
      case DecoratorType.ACTION:
        applyAction<State>(moduleBuilder, instance, propertyName);
        break;
      case DecoratorType.SUBMODULE:
        applySubModule<State>(moduleBuilder, instance, decorator);
        break;
    }
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

function applySubModule<State>(
  moduleBuilder: ModuleBuilder<State, any>,
  instance: any,
  decorator: Decorator
) {
  const { type, options, propertyName, target } = decorator;

  const moduleOptions = options as ModuleOptions;
  const moduleName = moduleOptions.namespace ? moduleOptions.namespace : propertyName;

  let subInstance = instance[propertyName];
  if (!subInstance) {
    const moduleType = (Reflect as any).getMetadata('design:type', target, propertyName);
    subInstance = type ? new moduleType() : undefined;
  }
  const subModuleBuilder = instanceToModule(
    moduleName,
    subInstance,
    moduleBuilder.storeBuilder,
    moduleBuilder
  );
  instance[propertyName] = subInstance;

  if (subModuleBuilder) {
    moduleBuilder.addModule(moduleName, subModuleBuilder);
  }
}
