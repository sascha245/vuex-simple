import { DecoratorMap, DecoratorType } from './types';

namespace Utils {
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
    const decorators: DecoratorMap = ctor.__decorators__;
    if (!decorators) {
      ctor.__decorators__ = new Map();
      return ctor.__decorators__;
    }
    return decorators;
  }
}

export default Utils;
