import { DecoratorMap, DecoratorType } from '../types';

const KEY = '__decorators__';

export function setDecorator(
  target: any,
  propertyName: string,
  type: DecoratorType,
  options?: any
) {
  const decorators = getDecorators(target);
  if (decorators) {
    decorators.set(propertyName, {
      options,
      propertyName,
      type
    });
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

  const proto = ctor.prototype as Object;
  const decorators: DecoratorMap = proto[KEY];

  if (!proto.hasOwnProperty(KEY) && decorators) {
    proto[KEY] = new Map(decorators.entries());
    return proto[KEY];
  } else if (!decorators) {
    proto[KEY] = new Map();
    return proto[KEY];
  }
  return decorators;
}
