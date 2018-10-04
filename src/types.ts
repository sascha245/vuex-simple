export enum DecoratorType {
  STATE = 1,
  ACTION,
  MUTATION,
  GETTER
}

export type DecoratorMap = Map<string, DecoratorType>;

export interface ModuleOptions {
  namespace: string;
}
