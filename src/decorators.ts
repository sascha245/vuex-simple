import { DecoratorType } from './types';
import { setDecorator } from './utils';

export function State() {
  return (target: any, propertyName: string) => {
    setDecorator(target, propertyName, DecoratorType.STATE);
  };
}

export function Module() {
  return (target: any, propertyName: string) => {
    setDecorator(target, propertyName, DecoratorType.MODULE);
  };
}

export function Getter() {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    setDecorator(target, propertyName, DecoratorType.GETTER);
  };
}

export function Mutation() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => void>
  ) => {
    setDecorator(target, propertyName, DecoratorType.MUTATION);
  };
}

export function Action() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => Promise<any>>
  ) => {
    setDecorator(target, propertyName, DecoratorType.ACTION);
  };
}
