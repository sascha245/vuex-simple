import { Token } from 'typedi';
import { Action, Mutation } from 'vuex';

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
  const options = handleOptions(pOptions);
  return <T extends { new (...args: any[]): {} }>(target: T) => {
    decoratorUtil.setClassDecorator(target, options);
    return target;
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

export function State() {
  return (target: any, propertyName: string) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.STATE);
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

export function Submodule(pOptions: ModuleOptions | string) {
  const options = handleOptions(pOptions);

  return (target: any, propertyName: string) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.SUBMODULE, options);
  };
}
