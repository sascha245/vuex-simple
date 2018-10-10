# vuex-simple

A simpler way to write your Vuex store in Typescript

## Usage

1. Install module:

`npm install vuex-simple --save`

2. Install reflect-metadata package:

`npm install reflect-metadata --save`

and import it somewhere in the global place of your app before any service declaration or import (for example in app.ts):

`import "reflect-metadata";`

3. Enabled following settings in tsconfig.json:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

**Note:** *vuex-simple* uses the Container from [typedi](http://github.com/pleerock/typedi).


## Example

#### Module

```ts
// store/modules/counter.ts

import { Mutation, Module, Getter, State } from 'vuex-simple';

@Module('counter')
class CounterModule {

  @State()
  public counter: number = 0;

  // A simple getter that is cached and made reactive by vuex
  @Getter()
  public get myGetter() {
    console.log('my getter!');
    return 42;
  }

  // A simple mutation function
  // You can only modify your state in here, or Vuex will give you an error
  @Mutation()
  public increment() {
    this.counter++;
  }

  @Mutation()
  public incrementBy(nb: number) {
    this.counter += nb;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    // simply call mutation function like you would any other function
    this.increment();
  }
}
```

#### Store

```ts
// store/index.ts

import Vue from 'vue';

import VuexSimple, { getStoreBuilder } from 'vuex-simple';

import CounterModule from './modules/counter';

Vue.use(VuexSimple);

const storeBuilder = getStoreBuilder();
storeBuilder.loadModules([
  CounterModule
]);
const store = storeBuilder.create();

export default store;

```

#### Usage

```ts
// In your vue component

import { Container, Inject } from 'vuex-simple';
import CounterModule from '@/store/modules/counter';

@Component
export default class MyComponent extends Vue {

  @Inject()
  public counterModule!: CounterModule;

  public get readState() {
    // access state like a property
    return this.counterModule.counter;
  }

  public get readGetter() {
    // access getter like a property
    return this.counterModule.myGetter;
  }

  public commitIncrement() {
    // call mutation like a function
    this.counterModule.increment();
  }

  public commitIncrementBy(number: id) {
    // call with parameter / payload
    this.counterModule.incrementBy(10);
  }

  public callAction() {
    counterModule.asyncIncrement();
  }

}

// Outside of a Vue component, you can also use Container to access the module
const counterModule = Container.get(CounterModule);


```

## Features

#### Module

To create a module, we declare a new class and decorate it with `@Module(namespace)`

#### Inject

Inject another module or service in your module with `@Inject()`. This feature will enable you to easily split up your code across multiple files in a logic way.

#### State

To tell the module which properties of the class will compose the state of the vuex module, we need to decorate those properties with `@State()`

#### Getter

To add a getter, we simply write a normal getter and add a `@Getter()` decorator to it.

#### Mutation

To add a mutation, we simply write a normal function and add a `@Mutation()` decorator to it. For now, mutations can only have at most 1 parameter.

#### Action

To add an action, we simply write a normal function and add a `@Action()` decorator to it. As for mutations, actions can, for now, only have at most 1 parameter.

**Note on actions:** vuex use actions to do their async stuff, but we don't really need an action for that, a simple function that can call our mutations is all we need, as shown above.</br>
So for now `@Action` is still included, but it may happen that it is removed in later versions.

#### How to setup your store

1. Use `Vue.use(VuexSimple)`
2. Use the StoreBuilder to load your modules

```ts
const storeBuilder = getStoreBuilder();
storeBuilder.loadModules([
  CounterModule
]);
```

3. (optional) Add your existing vuex modules: they will still work normally

```ts
const storeBuilder = getStoreBuilder();
storeBuilder.addModule(namespace: string, module: Vuex.Module);
```

4. We finish by creating the store with `storeBuilder.create()`


**Note:** We can't configure the root of the store **for now**. The store is also set to use strict mode by default.

#### Injections in custom classes

Sometimes you want to be able to inject a service or module in your class without it having to be a service / module itself.
You can now use `injectAll` to do this.

```ts
import { Inject, injectAll } from 'vuex-simple';

class MyInjectable {

  @Inject()
  public counterModule!: CounterModule;

  constructor() {
    // Once this function is called it will inject all your properties marked with @Inject()
    injectAll(this);
  }
}
```

## Contributors

If you are interested and want to help out, don't hesitate to contact me or to create a pull request with your fixes / features.

## Bugs

The core features presented should be stable and tested.
However, if a bug occurs, don't hesitate to open a ticket. I will try to fix it as fast as possible.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Inspired in some parts by [vuex-type-safety](https://github.com/christopherkiss/vuex-type-safety)
