import { Mutation as VuexMutation } from 'vuex';

import { StoreBuilder } from '../types';
import { createDecorator } from '../utils';

function getMutation(pModule: any, propertyName: string): VuexMutation<any> {
  const mutation: Function = pModule[propertyName];
  const boundMutation = mutation.bind(pModule);
  return (state, payload) => boundMutation(payload);
}

function bindMutation(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const options = pBuilder.options;
  const provider = pBuilder.provider;
  options.mutations![propertyName] = getMutation(pModule, propertyName);
  const nsPath = pBuilder.namespaces.join('/');
  const mutationName = (nsPath ? nsPath + '/' : '') + propertyName;

  pModule[propertyName] = (payload: any) => {
    provider.store!.commit(mutationName, payload);
  };
}

export const Mutation = createDecorator(bindMutation);
