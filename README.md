# vuex-simple

A simpler way to write your Vuex store in Typescript

## TO DO

**Note:** this module is still in development and thought for private usage</br>

- Inbuild Container support to inject modules in Vuejs components
- Vuex Getters (yep, we still don't handle those )

## Getting Started

These instructions will show you how to install and use this package.

### Installing

Install the package with npm:

```
npm install vuex-simple
```

If you use yarn:

```
yarn add vuex-simple
```

### Usage

This part will explain how to setup a basic vuex store and create modules

#### Basic example

In this part, we create a basic counter module for vuex

```ts
// modules/counter.ts

import { Mutation, Module } from 'vuex-simple';

@Module('counter')
class MyCounter {
  @State()
  public counter: number = 0;

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
```

Let's explain what we are doing here a bit:

- First we declare a new class and decorate it with `@Module(namespace)`

- To add a mutation, we simply write a normal function and add a `@Mutation()` decorator to it. For now, mutations can only have at most 1 parameter.

- To add an action, we simply write a normal function and add a `@Action()` decorator to it. As for mutations, actions can, for now, only have at most 1 parameter.

**Note on actions:** vuex use actions to do their async stuff, but we don't really need an action for that, a simple function that can call our mutations is all we need, as shown above.
So for now `@Action` is still included, but as I don't see any utility in it, it may happen that it is removed in later versions.

Now that we created our module, let's see how we setup our store:

- Use `Vue.use(Vuex)` or `Vue.use(VuexSimple)` to load vuex
- We instantiate all our modules, so that they are loaded into the store builder singleton.

**Warning:** For now, if you instantiate a module multiple times, it will cause quite a lot of problems, so be careful to only instantiate your module once :s

- Note that we can also add our existing vuex modules, they will still work normally, we just can't configure **for now** the root of the store :s The store is also set to strict by default.

```ts
const storeBuilder = getStoreBuilder();
storeBuilder.addModule(namespace: string, module: Vuex.Module);
```

- We then finish by creating the store with `storeBuilder.create()`

**Note on module functions:** We can now call any function from our counter module as we would with normal functions, even those marked with `@Mutation()`!</br>
That allows use to implement pretty easily typesafety without having to write heavy boilerplates.

#### Container example

I conceived the module so we can easily make it into a service and inject it in our components as need arises. For that, I used the package [typedi](http://github.com/pleerock/typedi)

Here a simple example:

```ts
// modules/counter.ts

import { Container, Service } from 'typedi';
import Vue from 'vue';

import VuexSimple, { getStoreBuilder, Mutation, VuexModule } from 'vuex-simple';

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

The only thing you need to change here is add the `@Service()` decorator on top of your class and instead of instantiating your class you do `Container.get(CounterModule)`

To inject your service in your Vuejs components, simply use Container.get for now.</br>
I will publish a small package shortly so you can use `@Inject()` in your components. This package will then also be included by default by this one.

## Contributors

If you are interested and want to help out, don't hesitate to contact me or to create a pull request with your fixes / features.

## Bugs

The core features presented should be stable.
But as this module is still in development, it will probably still have some bugs here and there.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Inspired in some parts by [vuex-type-safety](https://github.com/christopherkiss/vuex-type-safety)
