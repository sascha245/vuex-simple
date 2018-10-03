import Vue from 'vue';

import VuexSimple, { getStoreBuilder, Mutation, VuexModule } from '../src/index';

interface MyState {
  counter: number;
}

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
  // For now @Action is still included, however as I don't see any utility in it, I will probably remove it in later versions
  // @Action()
  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }
}

// simply instantiate to add module to the store builder singleton
const myModule = new MyCounter();

Vue.use(VuexSimple);

const storeBuilder = getStoreBuilder();
storeBuilder.create();

// simply use mutations or actions as standard functions
// your editor should be able to autocomplete everything
myModule.increment();
myModule.incrementBy(10);

myModule.asyncIncrement();
