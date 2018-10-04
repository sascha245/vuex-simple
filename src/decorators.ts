import { Action, Mutation } from 'vuex';

import { applyDecorators } from './metadata';
import { getStoreBuilder, StoreBuilder } from './store-builder';
import { DecoratorType, ModuleOptions } from './types';
import Utils from './utils';

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
    return function(...args: any[]) {
      const instance = new target(...args);
      (instance as any).__state__ = {};

      const options = handleOptions(pOptions);
      const storeBuilder: StoreBuilder<any> = getStoreBuilder();
      const moduleBuilder = storeBuilder.module(options.namespace, (instance as any).__state__);

      applyDecorators<any>(moduleBuilder, instance);

      return instance;
    } as any;
  };
}

export function State<T>() {
  return (target: T, propertyName: string) => {
    Utils.setDecorator(target, propertyName, DecoratorType.STATE);
  };
}

export function Mutation<T>() {
  return (
    target: T,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => void>
  ) => {
    Utils.setDecorator(target, propertyName, DecoratorType.MUTATION);
  };
}

export function Action<T>() {
  return (
    target: T,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => Promise<any>>
  ) => {
    Utils.setDecorator(target, propertyName, DecoratorType.ACTION);
  };
}
