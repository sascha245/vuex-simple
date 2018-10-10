import { Container, Token } from 'typedi';
import { Action, Mutation } from 'vuex';

import { applyDecorators, collectDecorators } from './metadata';
import { ModuleBuilder } from './module-builder';
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
    collectDecorators(target);

    const options = handleOptions(pOptions);

    const moduleWrapper = function(...args: any[]) {
      const instance = new target(...args);

      const moduleBuilder = new ModuleBuilder(options.namespace, {});

      applyDecorators<any>(moduleBuilder, instance);

      (instance as any).$module = moduleBuilder;

      injectUtil.injectAll(instance);

      if (!Container.get(target)) {
        Container.set(target, instance);
      }

      return instance;
    } as any;

    moduleWrapper.prototype = target.prototype;
    return moduleWrapper;
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
