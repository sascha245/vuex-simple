# vuex-simple

A simpler way to write your Vuex store in Typescript

## Changelog

2.0.0:
  - Remove typedi / dependency injections: now available in a separate package [vue-typedi](https://github.com/sascha245/vue-typedi)
  - Remove deprecated functions
  - Cleaner and easier usages
  - Submodules

## Install

1. Install vuex
`npm install vuex --save`

2. Install module:
`npm install vuex-simple --save`

## Example

This section shows how to create a simple store with *vuex-simple*.

#### Module

To define our modules, we just write normal typescript classes. This means that we can use everything that would normally be possible, which also includes inheritance and generics. The decorators don't apply any logic and just store some metadata used later on by the library.

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

To create submodules, you first create a property decorated by `@Module()` and initialize it with a new instance of your module class.
The module will be namespaced by the name of the property.

We can also have multiple instances of the same module if necessary. The code below would give us two submodules 'foo1' and 'foo2' with different initial values.

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

To create a new store, you instantiate one of your module classes and pass it to `createVuexStore`.
The instance is then transformed and bound to the store.

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

// create our module class instance
const instance = new MyStore();

// create and export our store
export default createVuexStore(instance, {
  strict: false,
  modules: {},
  plugins: []
});

// instance is now bound to the store: we can now call our mutations, getters and such as we would normally with our class instance
instance.bar.foo2.increment();

```

**Warning**: You need to create one module instance per store. Don't use an already transformed instance for `createVuexStore`.

#### Usage

You can use the `useStore(store)` function to get the bound module class instance from your store.

```ts
// In your vue component

import { useStore } from 'vuex-simple';
import { MyStore } from '@/store/store';
import { FooModule } from '@/store/modules/foo';

@Component
export default class MyComponent extends Vue {

  // get the module instance from the created store
  public store: MyStore = useStore(this.$store);

  // get the module instance with the given namespace
  public foo1?: FooModule = useModule(this.$store, ['bar', 'foo1']);

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

## Dynamic modules

To add a dynamic module to your store, you can use the `registerModule` function from this package:

```ts
registerModule($store, ['dynamic_foo'], new FooModule(6));
```

You can then use `useModule`, to get the bound class instance of the given namespace:

```ts
const foo = useModule<FooModule>($store, ['dynamic_foo']);
```

To remove the dynamic module from the store, you can use the `unregisterModule` function from this package:

```ts
unregisterModule($store, ['dynamic_foo']);
```

**Note**: You can also those functions on a standard Vuex store.

## Example with dependency injections

This section shows how to use dependency injection with this library.
In the following examples I will be using [vue-typedi](https://github.com/sascha245/vue-typedi) that makes use of the library [typedi](http://github.com/pleerock/typedi), but you can choose any other dependency injection library if you want.

Note that this step is completely optional and is in no case required for this library to work.

#### Module with dependency injection

You start by decorating your class with `@Injectable`, which injects all your properties marked with `@Inject` when the class is instantiated.

You can then freely use `@Inject` in this class.

```ts
// store/modules/foo.ts

import { Mutation, State } from 'vuex-simple';
import { Inject, Injectable } from 'vue-typedi';
import { MyService } from '...';

@Injectable()
export class FooModule {

  @Inject()
  public myService!: MyService;

  ...
}
```

#### Vue component with module injection

As dependency injection has been completely removed from this library, it is up to the user to setup and bind the values he needs in the container.

In this example, as we are using *typedi*, I will use their `Token` class to generate unique keys for our values.
You can then bind these keys to the appropriate values / modules in your container.

```ts
// store/tokens.ts

import { Token } from 'vue-typedi';

// generate some unique keys to bind our values to
export default {
  BAR: new Token(),
  BAR_FOO1: new Token(),
  BAR_FOO2: new Token()
};

// store/index.ts

import Vue from 'vue';
import Vuex from 'vuex';
import { Container } from 'vue-typedi';

import { createVuexStore } from 'vuex-simple';

import { MyStore } from './store';

import tokens from './tokens'

Vue.use(Vuex);

const instance = new MyStore()

// bind tokens/keys to the appropriate module
Container.set(tokens.BAR, instance.bar);
Container.set(tokens.BAR_FOO1, instance.bar.foo1);
Container.set(tokens.BAR_FOO2, instance.bar.foo2);

export default createVuexStore(instance, {
  strict: false,
  modules: {},
  plugins: []
});

// In your vue component

import { Inject } from 'vue-typedi';
import { FooModule } from '@/store/modules/foo';
import tokens from '@/store/tokens';

@Component
export default class MyComponent extends Vue {

  @Inject(tokens.BAR_FOO1)
  public foo1!: FooModule;

  ...
}
```

## Decorators

#### State

To tell the module which properties of the class will compose the state of the vuex module, we need to decorate those properties with `@State()`

#### Getter

To add a getter, we simply write a normal getter and add a `@Getter()` decorator to it.

As with Vuex getters, they don't take any arguments. You can however pass arguments to getters by returning a function, like how it is described on the official documentations of vuex:<br/>
https://vuex.vuejs.org/guide/getters.html#method-style-access

```ts
// Getter
@Getter()
public get numberButIncreased() {
    return (someNumber: string) => {
        return someNumber + 1;
    }
}

// Usage
myModule.numberButIncreased(5); // returns 6
```

#### Mutation

To add a mutation, we simply write a normal function and add a `@Mutation()` decorator to it. Mutations can only have at most 1 parameter.

**Note**: You can call mutations from any other function in your class, even if it is not an action.

#### Action

To add an action, we simply write a normal function and add a `@Action()` decorator to it. Actions can only have at most 1 parameter.

#### Module

To add submodules to your module, you can decorate a property with `@Module()`. The property name will then be used as the namespace of this module.

### How to

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


#### How to split up your modules

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
