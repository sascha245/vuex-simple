import 'reflect-metadata';

import test from 'ava';
import { Container } from 'typedi';
import Vue from 'vue';

import { MyComponent } from '../example/test-component';
import { TestModule } from '../example/test-module';
import VuexSimple, { StoreBuilder } from '../index';

const myContainer = Container.of('myContainer');

Vue.use(VuexSimple);

function loadSnapshot(t) {
  (t as any).context.store.replaceState(JSON.parse((t as any).context.snapshot));
}

test.before(t => {
  const storeBuilder = new StoreBuilder({
    container: myContainer,
    state: {},
    strict: true
  });
  storeBuilder.loadModules([TestModule]);
  const store = storeBuilder.create();

  (t as any).context.store = store;
  // create snapshot of initial state
  (t as any).context.snapshot = JSON.stringify(store.state);
});

test.beforeEach(t => {
  // reset store
  loadSnapshot(t);
});

test.serial('initial state', t => {
  const testModule = myContainer.get(TestModule);

  t.is(testModule.counter, 10);
  t.is(testModule.name, 'Will');
});

test.serial('simple increment', t => {
  const testModule = myContainer.get(TestModule);

  t.is(testModule.counter, 10);

  testModule.setCounter(0);

  t.is(testModule.counter, 0);
  t.notThrows(() => testModule.increment());
  t.is(testModule.counter, 1);
});

test.serial('simple computed getters', t => {
  const testModule = myContainer.get(TestModule);
  testModule.setCounter(0);

  t.not(testModule.normalGetter, testModule.normalGetter);
  t.is(testModule.cachedGetter, testModule.cachedGetter);
  t.is(testModule.cachedGetter.item, 100);

  t.notThrows(() => testModule.increment());

  t.is(testModule.cachedGetter.item, 101);
});

test.serial('simple incrementAsync', async t => {
  const testModule = myContainer.get(TestModule);
  testModule.setCounter(0);

  t.is(testModule.counter, 0);

  const p = testModule.asyncIncrement();
  t.notThrowsAsync(() => p);

  await p;

  t.is(testModule.counter, 1);
});

test.serial('store replaceState', async t => {
  const testModule = myContainer.get(TestModule);
  testModule.setCounter(0);

  t.is(testModule.counter, 0);
  testModule.increment();
  testModule.increment();
  testModule.increment();
  t.is(testModule.counter, 3);

  const store = (t as any).context.store;

  const newState = JSON.parse(JSON.stringify(store.state));
  newState.test.counter = 1;
  store.replaceState(newState);

  t.is(store.state.test.counter, 1);
  t.is(testModule.counter, 1);

  testModule.increment();

  t.is(store.state.test.counter, 2);
  t.is(testModule.counter, 2);
});

test.serial('injection in module', async t => {
  const testModule = myContainer.get(TestModule);
  testModule.setCounter(0);

  t.is(testModule.counter, 0);

  const p = testModule.countItems();
  await t.notThrowsAsync(() => p);

  t.is(testModule.counter, 42);
});

test.serial('injection in non vue component', async t => {
  const myComponent1 = new MyComponent(myContainer);
  t.not(myComponent1.testModule, undefined);

  myComponent1.testModule.increment();

  const myComponent2 = new MyComponent();

  // check that myComponent2.testModule is either undefined or not the same module instance as myComponent1.testModule
  t.not(myComponent2.testModule, myComponent1.testModule);
  if (myComponent2.testModule) {
    t.not(myComponent1.testModule.counter, myComponent2.testModule.counter);
  }
});
