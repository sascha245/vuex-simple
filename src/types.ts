export enum DecoratorType {
  STATE = 1,
  ACTION,
  MUTATION,
  GETTER,
  MODULE
}

export interface Decorator {
  propertyName: string;
  type: DecoratorType;
  options?: any;
}

export type DecoratorMap = Map<string, Decorator>;
