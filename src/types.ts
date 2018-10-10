import { Token } from 'typedi';

export enum DecoratorType {
  STATE = 1,
  ACTION,
  MUTATION,
  GETTER
}

export type DecoratorMap = Map<string, DecoratorType>;

export type InjectType = ((type?: any) => Function) | string | Token<any>;

export interface Injection {
  typeOrName: () => any;
  propertyName: string;
  index?: number;
}

export interface ModuleOptions {
  namespace: string;
}
