import { Action as VuexAction } from 'vuex';

import { StoreBuilder } from '../types';
import { createDecorator } from '../utils';

function getAction(pModule: any, propertyName: string): VuexAction<any, any> {
  const action: Function = pModule[propertyName];
  const boundAction = action.bind(pModule);
  return (state, payload) => boundAction(payload);
}

function bindAction(pBuilder: StoreBuilder, pModule: any, propertyName: string) {
  const options = pBuilder.options;
  const provider = pBuilder.provider;
  options.actions![propertyName] = getAction(pModule, propertyName);
  const nsPath = pBuilder.namespaces.join('/');
  const actionName = (nsPath ? nsPath + '/' : '') + propertyName;

  pModule[propertyName] = (payload: any) => {
    return provider.store!.dispatch(actionName, payload);
  };
}

export const Action = createDecorator(bindAction);
