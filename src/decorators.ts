// import { DecoratorType } from './types';
import { VuexModule } from './vuex-module';

// function setDecorator(target: any, propertyName: string, decorator: DecoratorType) {
//   const Ctor = typeof target === 'function' ? (target as any) : (target.constructor as any);
//   let decorators: Map<string, DecoratorType> = Ctor.__decorators__;
//   if (!decorators) {
//     Ctor.__decorators__ = decorators = new Map();
//   }
//   decorators.set(propertyName, decorator);
// }

export function Mutation<T extends VuexModule>() {
  return (
    target: T,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => void>
  ) => {
    const Ctor =
      typeof target === 'function'
        ? (target as any)
        : (target.constructor as any);
    let mutations: Set<string> = Ctor.__mutations__;
    if (!mutations) {
      Ctor.__mutations__ = mutations = new Set<string>();
    }
    mutations.add(propertyName);
  };
}

export function Action<T extends VuexModule>() {
  return (
    target: T,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(payload?: any) => Promise<any>>
  ) => {
    const Ctor =
      typeof target === 'function'
        ? (target as any)
        : (target.constructor as any);
    let actions: Set<string> = Ctor.__actions__;
    if (!actions) {
      Ctor.__actions__ = actions = new Set<string>();
    }
    actions.add(propertyName);
  };
}
