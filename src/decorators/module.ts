import { transformRecursive } from '../transform';
import { StoreBuilder } from '../types';
import { createDecorator } from '../utils';

function bindModule(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const subModule = pModule[propertyName];
  if (!subModule) {
    return;
  }
  try {
    const moduleOptions = transformRecursive(
      pBuilder.provider,
      subModule,
      pBuilder.namespaces.concat(propertyName),
      pBuilder.dynamic
    );
    const options = pBuilder.options;
    options.modules![propertyName] = moduleOptions;
  } catch (err) {
    console.error(err);
  }
  Object.defineProperty(pModule, propertyName, {
    get() {
      return subModule;
    }
  });
}

export const Module = createDecorator(bindModule);
