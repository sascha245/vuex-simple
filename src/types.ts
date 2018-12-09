import { Module, Store } from 'vuex';

export type DecoratorHandler = (builder: StoreBuilder, instance: any, propertyName: string) => void;
export type DecoratorMap = Map<string, DecoratorHandler>;

export interface ModuleProvider {
  module: object;
  dynamic: boolean;
}

export interface StoreProvider {
  store?: Store<any>;
  modules: Map<string, ModuleProvider>;
}
export interface StoreBuilder {
  namespaces: string[];
  options: Module<any, any>;
  provider: StoreProvider;
  dynamic: boolean;
}
