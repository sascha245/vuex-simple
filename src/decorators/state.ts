import { StoreBuilder } from '../types';
import { createDecorator } from '../utils';

function getState(pState: any, pNamespace: string[]) {
  let state = pState;
  for (const namespace of pNamespace) {
    state = state[namespace];
  }
  return state;
}

function bindState(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const value = pModule[propertyName];
  const provider = pBuilder.provider;
  const options = pBuilder.options;
  Object.defineProperty(pModule, propertyName, {
    get() {
      const state = provider.store
        ? getState(provider.store.state, pBuilder.namespaces)
        : options.state;
      return state[propertyName];
    },
    set(val: any) {
      const state = provider.store
        ? getState(provider.store.state, pBuilder.namespaces)
        : options.state;
      state[propertyName] = val;
    }
  });
  pModule[propertyName] = value;
}

export const State = createDecorator(bindState);
