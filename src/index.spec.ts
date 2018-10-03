import test from 'ava';
import Vue from 'vue';

import VuexSimple, { getStoreBuilder, Mutation, VuexModule } from './index';

interface MyState {
  counter: number;
}

class TestModule extends VuexModule<MyState> {
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

const testModule = new TestModule();

Vue.use(VuexSimple);

const storeBuilder = getStoreBuilder();
storeBuilder.create();

test('increment', t => {
  t.is(testModule.state.counter, 0);
  t.notThrows(() => testModule.increment());
  t.is(testModule.state.counter, 1);
});

test('incrementAsync', async t => {
  t.is(testModule.state.counter, 1);

  const asyncIncrement = testModule.asyncIncrement();
  t.notThrowsAsync(() => asyncIncrement);

  await asyncIncrement;

  t.is(testModule.state.counter, 2);
});
