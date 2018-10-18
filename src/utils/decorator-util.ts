import { DecoratorMap, DecoratorType } from '../types';

const KEY = '__decorators__';

export function setDecorator(target: any, propertyName: string, decoratorType: DecoratorType) {
  const decorators = getDecorators(target);
  if (decorators) {
    decorators.set(propertyName, decoratorType);
  }
}

export function deleteDecorator(target: any, propertyName: string) {
  const decorators = getDecorators(target);
  if (decorators) {
    decorators.delete(propertyName);
  }
}

export function getDecorators(target: any): DecoratorMap {
  const ctor = typeof target === 'function' ? (target as any) : (target as any).constructor;

  const proto = ctor.prototype;
  const decorators: DecoratorMap = proto[KEY];
  if (!decorators) {
    proto[KEY] = new Map();
    return proto[KEY];
  }
  return decorators;
}
