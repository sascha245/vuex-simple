import { Container, Handler } from 'typedi';

const KEY = '__injections__';

/**
 * Inject all properties marked with @Inject() for the given class instance
 * @param instance Class instance
 */
export function injectAll(instance: any): void {
  if (!instance) {
    throw new Error('Invalid instance passed to injectAll: instance is undefined');
  }
  const ctr = instance.constructor;
  let injections = getInjections(ctr);
  if (!injections) {
    injections = initializeInjections(ctr);
    // saving handlers so we don't need to search them each time we instantiate our components
    Container.handlers.forEach(handler => {
      if (typeof handler.index === 'number') {
        return;
      }
      if (
        handler.object.constructor !== ctr &&
        !(ctr.prototype instanceof handler.object.constructor)
      ) {
        return;
      }
      injections.push(handler);
    });
  }

  injections.forEach(handler => {
    instance[handler.propertyName] = handler.value((Container as any).globalInstance);
  });
}

export function initializeInjections(ctor: any): Handler[] {
  return (ctor[KEY] = []);
}

export function getInjections(ctor: any): Handler[] | undefined {
  return ctor[KEY];
}
