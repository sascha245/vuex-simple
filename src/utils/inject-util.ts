import { Container, ContainerInstance, Token } from 'typedi';

import { Injection } from '../types';

const KEY = '__injections__';

/**
 * Thrown when DI cannot inject value into property decorated by @Inject decorator.
 */
export class CannotInjectError extends Error {
  public name = 'CannotInjectError';

  constructor(target: Object, propertyName: string) {
    super(
      `Cannot inject value into "${target.constructor.name}.${propertyName}". ` +
        `Please make sure you setup reflect-metadata properly and you don't use interfaces without service tokens as injection value.`
    );
    Object.setPrototypeOf(this, CannotInjectError.prototype);
  }
}

export function registerInjection(
  target: any,
  propertyName: string,
  typeOrName?: any,
  index?: number
) {
  let injections = getInjections(target.constructor);
  if (!injections) {
    injections = initializeInjections(target.constructor);
  }
  if (!typeOrName) {
    typeOrName = () => (Reflect as any).getMetadata('design:type', target, propertyName);
  }
  injections.push({
    index,
    propertyName,
    typeOrName
  });
}

/**
 * Inject all properties marked with @Inject() for the given class instance
 * @param instance Class instance
 */
export function injectAll(instance: any, container?: ContainerInstance): void {
  const target = instance.constructor;
  const injections = getInjections(target);

  if (injections) {
    injections.forEach(injection => {
      const { typeOrName, propertyName } = injection;

      let identifier: any;
      if (typeof typeOrName === 'string') {
        identifier = typeOrName;
      } else if (typeOrName instanceof Token) {
        identifier = typeOrName;
      } else if (typeOrName) {
        identifier = typeOrName();
      }

      if (identifier === Object) {
        throw new CannotInjectError(this, propertyName);
      }

      if (container && container.has(identifier)) {
        instance[propertyName] = container.get<any>(identifier);
      } else {
        instance[propertyName] = Container.get<any>(identifier);
      }
    });
  }
}

export function initializeInjections(ctor: any): Injection[] {
  return (ctor[KEY] = []);
}

export function getInjections(ctor: any): Injection[] | undefined {
  return ctor[KEY];
}
