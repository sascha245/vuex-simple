# vuex-simple

A simpler way to write your Vuex store in Typescript

## TO DO

**Note:** this module is still in development and thought for private usage</br>

As this is the first release, there is still a lot of stuff I am not happy with and can be made easier to use

For now, here the next changes that will come:

- Usage of a decorator rather than inheritance:</br>
  &rarr; Removes the constructor and pass parameter per decorator
- Using the class properties as the modules state</br>
  &rarr; Removes the need to create an interface for our state, as well as the need to create a factory for in the options
- Vuex Getters (yep, we still don't handle those)

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
// counter-module.ts

import { Mutation, VuexModule } from 'vuex-simple';

interface CounterState {
  counter: number;
}

class MyCounter extends VuexModule<MyState> {
  constructor() {
    super({
      namespace: 'counter',
      state: () => {
        return {
          counter: 0
        };
      }
    });
  }

  // A simple mutation function
  // You can only modify your state in here, or Vuex will give you an error
  @Mutation()
  public increment() {
    this.state.counter++;
  }

  @Mutation()
  public incrementBy(nb: number) {
    this.state.counter += nb;
  }

  // You can also add @Action to transform the function to a store action that will be dispatched on call
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

- First we declare a new class inheriting from `VuexService<State>`
- In its constructor we specify the namespace as well as a state factory. The state will then be available at `this.state`

- To add a mutation, we simply write a normal function and add a `@Mutation()` decorator to it. For now, mutations can only have maximum 1 parameter corresponding to the received payload.

- To add an action, we simply write a normal function and add a `@Action()` decorator to it. As for mutations, actions can, for now, only have maximum 1 parameter, also corresponding to the received payload.

**Note on actions:** vuex use actions to do their async stuff, but we don't really need an action for that, a simple function that can call our mutations is all we need, as shown above.
So for now `@Action` is still included, but as I don't see any utility in it, I may happen that it is removed in later versions.

Now that we created our module, let's see how we setup our store:

- Use `Vue.use(Vuex)` or `Vue.use(VuexSimple)` to load vuex
- We instantiate all our modules, so that they are loaded into the store builder singleton.

**Warning:** For now, if you instantiate a module multiple times, it will try to recreate a new module and throw an error as the module already exists :s

- Note that we can also add our existing vuex modules, they will still work normally, we just can't **for now** configure the root of the store :s

```
const storeBuilder = getStoreBuilder();
storeBuilder.addModule(namespace: string, module: Vuex.Module);
```

- We then finish by creating the store with `storeBuilder.create()`

**Note on module functions:** We can now call any function from our counter module as we would with normal functions, even those marked with `@Mutation()`!</br>
That allows use to implement typesafety pretty easily without having to write heavy boilerplates.

#### Container example

I conceived the module so we can easily make it into a service and inject it in our components as need arises. For that, I used the package [typedi](http://github.com/pleerock/typedi)

Here a simple example:

```
import { Container, Service } from 'typedi';
import Vue from 'vue';

import VuexSimple, { getStoreBuilder, Mutation, VuexModule } from 'vuex-simple';

interface MyState {
  counter: number;
}

@Service()
class MyCounter extends VuexModule<MyState> {
  constructor() {
    super({
      namespace: 'test',
      state: () => {
        return {
          counter: 0
        };
      }
    });
  }

  @Mutation()
  public increment() {
    this.state.counter++;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }
}

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
I will publish a small package shortly so you can use `@Inject()` in your components

## Contributors

If you are interested and want to help out, I will take your help with pleasure! There is still a lot to do and to work on.

## Bugs

As you can / will be able to see, there are still quite a lot of bugs. This module is still in development after all.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Inspired in some parts by [vuex-type-safety](https://github.com/christopherkiss/vuex-type-safety)
