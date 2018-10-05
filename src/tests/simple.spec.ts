import 'reflect-metadata';

import test from 'ava';
import { Container } from 'typedi';
import Vue from 'vue';

import { TestModule } from '../example/test-module';
import VuexSimple, { getStoreBuilder } from '../index';

Vue.use(VuexSimple);

test.before(t => {
  const storeBuilder = getStoreBuilder();
  storeBuilder.loadModules([TestModule]);
  storeBuilder.create();
});

test.beforeEach(t => {
  const testModule = Container.get(TestModule);
  testModule.setCounter(0);
});

test.serial('simple increment', t => {
  const testModule = Container.get(TestModule);
  t.is(testModule.counter, 0);
  t.notThrows(() => testModule.increment());
  t.is(testModule.counter, 1);
});

test.serial('simple computed getters', t => {
  const testModule = Container.get(TestModule);
  t.not(testModule.normalGetter, testModule.normalGetter);
  t.is(testModule.cachedGetter, testModule.cachedGetter);
  t.is(testModule.cachedGetter.item, 100);

  t.notThrows(() => testModule.increment());

  t.is(testModule.cachedGetter.item, 101);
});

test.serial('simple incrementAsync', async t => {
  const testModule = Container.get(TestModule);

  t.is(testModule.counter, 0);

  const p = testModule.asyncIncrement();
  t.notThrowsAsync(() => p);

  await p;

  t.is(testModule.counter, 1);
});

test.serial('simple injection test', async t => {
  const testModule = Container.get(TestModule);

  t.is(testModule.counter, 0);

  const p = testModule.countItems();
  t.notThrowsAsync(() => p);

  await p;

  t.is(testModule.counter, 42);
});
