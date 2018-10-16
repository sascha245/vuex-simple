import { Container, ContainerInstance, Token } from 'typedi';
import Vue from 'vue';
import { createDecorator } from 'vue-class-component';

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
  if (target instanceof Vue) {
    const decorator = createDecorator(options => {
      addInjection(target, options, propertyName, typeOrName, index);
    });
    decorator(target, propertyName, index!);
    return;
  }
  // still support injection outside of vue components for backward compatibility
  addInjection(target, target.constructor, propertyName, typeOrName, index);
}

/**
 * Inject all properties marked with @Inject() for the given class instance
 * @param instance Class instance
 */
export function injectAll(instance: any, container?: ContainerInstance): void {
  const target = instance instanceof Vue ? instance.$options : instance.constructor;
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

function initializeInjections(ctor: any): Injection[] {
  return (ctor[KEY] = []);
}

function getInjections(ctor: any): Injection[] | undefined {
  return ctor[KEY];
}

function addInjection(
  target: any,
  ctor: any,
  propertyName: string,
  typeOrName?: any,
  index?: number
): void {
  let injections = getInjections(ctor);
  if (!injections) {
    injections = initializeInjections(ctor);
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
