import { Token } from 'typedi';

import { ModuleBuilder } from './module-builder';
import { StoreBuilder } from './store-builder';

export enum DecoratorType {
  STATE = 1,
  ACTION,
  MUTATION,
  GETTER,
  CLASS,
  SUBMODULE
}

export interface Decorator {
  target: any;
  propertyName: string;
  type: DecoratorType;
  options?: any;
}

export type DecoratorMap = Map<string, Decorator>;

export type InjectType = ((type?: any) => Function) | string | Token<any>;

export interface Injection {
  typeOrName: () => any;
  propertyName: string;
  index?: number;
}

export interface ModuleInternals {
  __moduleBuilder__: ModuleBuilder;
}
export interface StoreInternals {
  __storeBuilder__: StoreBuilder<any>;
}

export interface ModuleOptions {
  namespace: string;
}
