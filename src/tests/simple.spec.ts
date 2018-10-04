import untypedTest, { TestInterface } from 'ava';
import Vue from 'vue';

import VuexSimple, { getStoreBuilder, Module, Mutation, State } from '../index';

@Module('test')
class TestModule {
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

Vue.use(VuexSimple);

interface TestContext {
  testModule: TestModule;
}

const test: TestInterface<TestContext> = untypedTest;

test.before(t => {
  t.context.testModule = new TestModule();
  const storeBuilder = getStoreBuilder();
  storeBuilder.create();
});

test('simple increment', t => {
  t.is(t.context.testModule.counter, 0);
  t.notThrows(() => t.context.testModule.increment());
  t.is(t.context.testModule.counter, 1);
});

test('simple incrementAsync', async t => {
  t.is(t.context.testModule.counter, 1);

  const p = t.context.testModule.asyncIncrement();
  t.notThrowsAsync(() => p);

  await p;

  t.is(t.context.testModule.counter, 2);
});
