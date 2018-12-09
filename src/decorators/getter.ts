import { Getter as VuexGetter } from 'vuex';

import { getterNotFoundError } from '../errors';
import { StoreBuilder } from '../types';
import { createDecorator } from '../utils';

function getGetter(pModule: any, propertyName: string): VuexGetter<any, any> {
  const getter = pModule.__lookupGetter__(propertyName);
  if (!getter) {
    const className = pModule.constructor.name;
    throw getterNotFoundError(propertyName, className);
  }
  const boundGetter = getter.bind(pModule);
  return state => boundGetter();
}

function bindGetter(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const options = pBuilder.options;
  const provider = pBuilder.provider;
  options.getters![propertyName] = getGetter(pModule, propertyName);
  const nsPath = pBuilder.namespaces.join('/');
  const getterName = (nsPath ? nsPath + '/' : '') + propertyName;

  Object.defineProperty(pModule, propertyName, {
    get() {
      return provider.store!.getters[getterName];
    }
  });
}

export const Getter = createDecorator(bindGetter);
