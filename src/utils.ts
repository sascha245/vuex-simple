import { DecoratorHandler, DecoratorMap } from './types';

const KEY = '__decorators__';

export function createDecorator(handler: DecoratorHandler) {
  return () => (target: any, propertyName: string) => {
    const decorators = getDecorators(target);
    decorators.set(propertyName, handler);
  };
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
