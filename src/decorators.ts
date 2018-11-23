import { DecoratorType } from './types';
import * as decoratorUtil from './utils/decorator-util';

export function State() {
  return (target: any, propertyName: string) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.STATE);
  };
}

export function Module() {
  return (target: any, propertyName: string) => {
    decoratorUtil.setDecorator(target, propertyName, DecoratorType.MODULE);
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
