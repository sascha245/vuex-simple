import { Container, Token } from 'typedi';
import { Action, Mutation } from 'vuex';

import { applyDecorators } from './metadata';
import { getStoreBuilder, StoreBuilder } from './store-builder';
import { DecoratorType, InjectType, ModuleOptions } from './types';
import { decoratorUtil, injectUtil } from './utils';

function handleOptions(options: ModuleOptions | string): ModuleOptions {
  if (typeof options === 'string') {
    return {
      namespace: options
    };
  }
  return options;
}

export function Module(pOptions: ModuleOptions | string) {
  return <T extends { new (...args: any[]): {} }>(target: T) => {
    let singletonInstance: any;

    return function(...args: any[]) {
      if (singletonInstance) {
        return singletonInstance;
      }

      const instance = new target(...args);

      const options = handleOptions(pOptions);
      const storeBuilder: StoreBuilder<any> = getStoreBuilder();

      const moduleBuilder = storeBuilder.module(options.namespace, {});

      applyDecorators<any>(moduleBuilder, instance);

      injectUtil.injectAll(target, instance);

      Container.set(target, instance);
      singletonInstance = instance;

      return instance;
    } as any;
  };
}

export function State() {
  return (target: any, propertyName: string) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.STATE);
  };
}

export function Inject(type?: (type?: any) => Function): Function;
export function Inject(serviceName?: string): Function;
export function Inject(token: Token<any>): Function;

export function Inject(typeOrName?: InjectType) {
  return (target: any, propertyName: string, index?: number) => {
    injectUtil.registerInjection(target, propertyName, typeOrName, index);
  };
}

export function Getter() {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.GETTER);
  };
}

export function Mutation() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => void>
  ) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.MUTATION);
  };
}

export function Action() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => Promise<any>>
  ) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.ACTION);
  };
}
