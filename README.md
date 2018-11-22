# vuex-simple

A simpler way to write your Vuex store in Typescript

## Changelog

2.0.0:
  - Remove typedi / dependency injections
  - Remove deprecated functions
  - Cleaner and easier usages
  - Submodules

## Usage

1. Install vuex
`npm install vuex --save`

2. Install module:
`npm install vuex-simple --save`

## Example

#### Module

```ts
// store/modules/foo.ts

import { Mutation, State } from 'vuex-simple';

export class FooModule {
  @State()
  public counter: number;

  constructor(nb: number = 0) {
    this.counter = nb;
  }

  @Mutation()
  public increment() {
    this.counter++;
  }

  @Mutation()
  public incrementBy(nb: number) {
    this.counter += nb;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 200));
    // call mutation function like you would any other function
    this.increment();
  }
}
```

#### Submodules

```ts
// store/modules/bar.ts

import { Getter, Module } from 'vuex-simple';
import { FooModule } from './foo';

export class BarModule {

  // create submodule 'foo1'
  @Module()
  public foo1 = new FooModule(5);

  // create submodule 'foo2'
  @Module()
  public foo2 = new FooModule(0);

  @Getter()
  public get total() {
    return this.foo1.counter + this.foo2.counter;
  }
}
```

#### Store

```ts
// store/store.ts

import { Module, State } from 'vuex-simple';
import { BarModule } from './modules/bar';

export class MyStore {

  @Module()
  public bar = new BarModule();

  @State()
  public version = "2.0.0";
}

// store/index.ts

import Vue from 'vue';
import Vuex from 'vuex';

import { createVuexStore } from 'vuex-simple';

import { MyStore } from './store';

Vue.use(Vuex);

export default createVuexStore(new MyStore(), {
  strict: false,
  modules: {},
  plugins: []
});

```

#### Usage

```ts
// In your vue component

import { useStore } from 'vuex-simple';
import { MyStore } from '@/store/store';

@Component
export default class MyComponent extends Vue {

  public store = useStore<MyStore>(this.$store);

  public get readState() {
    // access state like a property
    return this.store.version;
  }

  public get readGetter() {
    // access getter like a property
    return this.store.bar.total;
  }

  public commitIncrement() {
    // call mutation like a function
    this.store.bar.foo1.increment();
  }

  public commitIncrementBy(number: id) {
    // call with parameter / payload
    this.store.bar.foo2.incrementBy(10);
  }

  public callAction() {
    this.store.bar.foo1.asyncIncrement();
  }
}
```

## Features

#### State

To tell the module which properties of the class will compose the state of the vuex module, we need to decorate those properties with `@State()`

#### Getter

To add a getter, we simply write a normal getter and add a `@Getter()` decorator to it.

#### Mutation

To add a mutation, we simply write a normal function and add a `@Mutation()` decorator to it. For now, mutations can only have at most 1 parameter.

#### Action

To add an action, we simply write a normal function and add a `@Action()` decorator to it. As for mutations, actions can, for now, only have at most 1 parameter.

#### Module

To add submodules to your module, you can decorate a property with `@Module()`. The property name will then be used as the namespace of this module.


#### How to setup your store

1. Use `Vue.use(Vuex)`

2. Create an instance of your root module
```ts
const instance = new MyStore();
```

3. Create your store. This will transform your instance so it actually uses the state, getters, mutations, etc... from the store.

```ts
const store = createVuexStore(instance, {
  strict: false,
  modules: {},
  plugins: []
})
```

4. Your instance has been transformed and is now synchronized with the store!
```ts
// call a mutation
instance.bar.foo1.increment()
```

**Note**: You can also get the instance from the vuex store using `useStore<MyStore>(store)`.

## FAQ

**How do I split up my modules?**</br>
There are different ways to split up your modules:
1. Do all the heavy lifting (like API requests and such) in other files or services.

2. Split up your modules into multiple submodules.

3. Use inheritance to split up your state, getters, mutations etc...

```ts
class CounterState {
  @State()
  public counter: number = 10;
}

class CounterGetters extends CounterState {
  @Getter()
  public get counterPlusHundred() {
    return this.counter + 100;
  }
}

class CounterMutations extends CounterGetters {
  @Mutation()
  public increment() {
    this.counter++;
  }
}

class CounterModule extends CounterMutations {
  public async incrementAsync() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }
}
```

## Contributors

If you are interested and want to help out, don't hesitate to contact me or to create a pull request with your fixes / features.

The project now also contains samples that you can use to directly test out your features during development.

1. Clone the repository

2. Install dependencies
`npm install`

3. Launch samples
`npm run serve`

4. Launch unit tests situated in *./tests*. The unit tests are written in Jest.
`npm run test:unit`


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
