export enum DecoratorType {
  STATE,
  ACTION,
  MUTATION
}

export type DecoratorMap = Map<string, DecoratorType>;

export interface ModuleOptions {
  namespace: string;
}
