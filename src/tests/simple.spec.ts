import 'reflect-metadata';

import test from 'ava';
import { Container } from 'typedi';
import Vue from 'vue';

import { MyComponent } from '../example/test-component';
import { TestModule } from '../example/test-module';
import VuexSimple, { getStoreBuilder } from '../index';

Vue.use(VuexSimple);

test.before(t => {
  const storeBuilder = getStoreBuilder();
  storeBuilder.loadModules([TestModule]);
  const store = storeBuilder.create();

  // create snapshot of initial state
  (t as any).context.snapshot = JSON.stringify(store.state);
});

test.beforeEach(t => {
  const storeBuilder = getStoreBuilder();
  const store = storeBuilder.create();

  // reset store
  store.replaceState(JSON.parse((t as any).context.snapshot));
});

test.serial('initial state', t => {
  const testModule = Container.get(TestModule);

  t.is(testModule.counter, 10);
  t.is(testModule.name, 'Will');
});

test.serial('simple increment', t => {
  const testModule = Container.get(TestModule);

  t.is(testModule.counter, 10);

  testModule.setCounter(0);

  t.is(testModule.counter, 0);
  t.notThrows(() => testModule.increment());
  t.is(testModule.counter, 1);
});

test.serial('simple computed getters', t => {
  const testModule = Container.get(TestModule);
  testModule.setCounter(0);

  t.not(testModule.normalGetter, testModule.normalGetter);
  t.is(testModule.cachedGetter, testModule.cachedGetter);
  t.is(testModule.cachedGetter.item, 100);

  t.notThrows(() => testModule.increment());

  t.is(testModule.cachedGetter.item, 101);
});

test.serial('simple incrementAsync', async t => {
  const testModule = Container.get(TestModule);
  testModule.setCounter(0);

  t.is(testModule.counter, 0);

  const p = testModule.asyncIncrement();
  t.notThrowsAsync(() => p);

  await p;

  t.is(testModule.counter, 1);
});

test.serial('store replaceState', async t => {
  const testModule = Container.get(TestModule);
  testModule.setCounter(0);

  t.is(testModule.counter, 0);
  testModule.increment();
  testModule.increment();
  testModule.increment();
  t.is(testModule.counter, 3);

  const storeBuilder = getStoreBuilder();
  const store = storeBuilder.store;

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
  const testModule = Container.get(TestModule);
  testModule.setCounter(0);

  t.is(testModule.counter, 0);

  const p = testModule.countItems();
  await t.notThrowsAsync(() => p);

  t.is(testModule.counter, 42);
});

test.serial('injection in non vue component', async t => {
  const testModule = Container.get(TestModule);
  const myComponent = new MyComponent();

  t.not(myComponent.testModule, undefined);
  t.is(myComponent.testModule, testModule);
});
