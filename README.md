# vuex-simple

A simpler way to write your Vuex store in Typescript

## TO DO

**Note:** this module is still in development and the API may change in later versions</br>

- Inbuild Container support to allow module injection in Vuejs components

## Getting Started

### Installing

Install the package with npm:

```
npm install vuex-simple
```

If you use yarn:

```
yarn add vuex-simple
```

### Example

#### Module

```ts
// modules/counter.ts

import { Mutation, Module, Getter, State } from 'vuex-simple';

@Module('counter')
class MyCounter {
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

  // You can also add @Action to transform the function to a store action that will be dispatched on call, but it's not really necessary
  // @Action()
  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    // simply call mutation function like you would any other function
    this.increment();
  }
}
```

#### Store

```ts
// store.ts

import Vue from 'vue';

import VuexSimple, { getStoreBuilder } from 'vuex-simple';

import MyCounter from './modules/counter';

// simply instantiate to add module to the store builder singleton
const myCounter = new MyCounter();

Vue.use(VuexSimple);

const store = getStoreBuilder().create();

// simply use mutations or actions as standard functions
// your editor should be able to autocomplete everything
myCounter.increment();
myCounter.incrementBy(10);

myCounter.asyncIncrement();

// call vuex getter
myCounter.myGetter;
```

### Features

#### Module
To create a module, we declare a new class and decorate it with `@Module(namespace)`

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

1. Use `Vue.use(VuexSimple)` to load vuex
2. Instantiate all our modules **once** (can also be before step 1)

**Warning:** For now, if you instantiate a module multiple times, it will cause quite a lot of problems, so be warned!

3. (optional) Add your existing vuex modules: they will still work normally

```ts
const storeBuilder = getStoreBuilder();
storeBuilder.addModule(namespace: string, module: Vuex.Module);
```

4. We finish by creating the store with `storeBuilder.create()`

**Note:** We can't configure the root of the store **for now**. The store is also set to use strict mode by default.



### Usage of a Container

For now, there is no container included by default by *vuex-simple*, so I recommand you to use [typedi](http://github.com/pleerock/typedi) if you want to use one. You will be able to easily inject your modules / services where you need them.

#### Module

```ts
// modules/counter.ts

import { Container, Service } from 'typedi';
import Vue from 'vue';

import { Mutation, Module, State } from 'vuex-simple';

@Service()
@Module('counter')
class MyCounter {
  @State()
  public counter: number = 0;

  @Mutation()
  public increment() {
    this.counter++;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }
}
```

#### Store

```ts
// store.ts

import Vue from 'vue';

import VuexSimple, { getStoreBuilder } from 'vuex-simple';

import MyCounter from './modules/counter';

// we need to get the module once so that typedi instantiates it for us
const myCounter = Container.get(MyCounter);

Vue.use(VuexSimple);

const storeBuilder = getStoreBuilder();
storeBuilder.create();

// simply use as you would normally do
myCounter.increment();

myCounter.asyncIncrement();
```

## Contributors

If you are interested and want to help out, don't hesitate to contact me or to create a pull request with your fixes / features.

## Bugs

The core features presented should be stable.
But as this module is still in development, it will probably still have some bugs here and there.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Inspired in some parts by [vuex-type-safety](https://github.com/christopherkiss/vuex-type-safety)
