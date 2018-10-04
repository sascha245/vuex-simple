import untypedTest, { TestInterface } from 'ava';
import Vue from 'vue';

import { Getter } from '../decorators';
import VuexSimple, { getStoreBuilder, Module, Mutation, State } from '../index';

@Module('test')
class TestModule {
  @State()
  public counter: number = 0;

  @Getter()
  public get cachedGetter() {
    return {
      item: this.counter + 100
    };
  }

  public get normalGetter() {
    return {
      item: this.counter + 100
    };
  }

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

test('simple computed getters', t => {
  t.not(t.context.testModule.normalGetter, t.context.testModule.normalGetter);
  t.is(t.context.testModule.cachedGetter, t.context.testModule.cachedGetter);
  t.is(t.context.testModule.cachedGetter.item, 101);

  t.notThrows(() => t.context.testModule.increment());

  t.is(t.context.testModule.cachedGetter.item, 102);
});

test('simple incrementAsync', async t => {
  t.is(t.context.testModule.counter, 2);

  const p = t.context.testModule.asyncIncrement();
  t.notThrowsAsync(() => p);

  await p;

  t.is(t.context.testModule.counter, 3);
});
