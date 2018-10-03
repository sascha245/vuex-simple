import { Container, Service } from 'typedi';
import Vue from 'vue';

import VuexSimple, { getStoreBuilder, Mutation, VuexModule } from '../src/index';

interface MyState {
  counter: number;
}

// To inject your service in your Vuejs component, simply use Container.get or use my vue-typedi package
@Service()
class MyModule extends VuexModule<MyState> {
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
const myModule = Container.get(MyModule);

Vue.use(VuexSimple);

const storeBuilder = getStoreBuilder();
storeBuilder.create();

// simply use service as you would normally do
myModule.increment();

myModule.asyncIncrement();
