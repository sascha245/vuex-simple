import 'reflect-metadata';

import { Container } from 'typedi';
import Vue from 'vue';

import { TestModule } from '../../samples/store/modules/TestModule';
import VuexSimple, { getStoreBuilder, StoreBuilder } from '../../src';

Vue.use(VuexSimple);

describe('Store creation', () => {
  beforeEach(() => {
    Container.reset();
  });

  it('getStoreBuilder simple', () => {
    const storeBuilder = getStoreBuilder('store1');
    storeBuilder.loadModules([TestModule]);
    storeBuilder.create();

    const testModule = Container.get(TestModule);

    // we verify we can call mutations
    testModule.setCounter(20);

    expect(testModule.counter).toBe(20);
    expect(testModule.name).toBe('Will');
  });

  it('getStoreBuilder with initialize ', () => {
    const storeBuilder = getStoreBuilder('store2');
    storeBuilder.initialize({
      modules: {},
      state: {
        version: '1.0.0'
      },
      strict: false
    });
    storeBuilder.loadModules([TestModule]);
    storeBuilder.create();

    const testModule = Container.get(TestModule);

    expect(testModule.counter).toBe(10);
    expect(testModule.name).toBe('Will');

    // we verify we can call mutations
    testModule.setCounter(20);

    expect(testModule.counter).toBe(20);
  });

  it('StoreBuilder simple', () => {
    const storeBuilder = new StoreBuilder();
    storeBuilder.loadModules([TestModule]);
    storeBuilder.create();

    const testModule = Container.get(TestModule);

    expect(testModule.counter).toBe(10);
    expect(testModule.name).toBe('Will');

    // we verify we can call mutations
    testModule.setCounter(20);

    expect(testModule.counter).toBe(20);
  });

  it('StoreBuilder with options', () => {
    const storeBuilder = new StoreBuilder({
      modules: {},
      state: {
        version: '1.0.0'
      },
      strict: false
    });
    storeBuilder.loadModules([TestModule]);
    storeBuilder.create();

    const testModule = Container.get(TestModule);

    // we verify we can call mutations
    testModule.setCounter(20);

    expect(testModule.counter).toBe(20);
    expect(testModule.name).toBe('Will');
  });

  it('StoreBuilder merge', () => {
    const storeBuilder = new StoreBuilder();
    storeBuilder.loadModules([TestModule]);
    storeBuilder.merge({
      modules: {},
      strict: false
    });

    storeBuilder.create();

    const testModule = Container.get(TestModule);

    // we verify we can call mutations
    testModule.setCounter(20);

    expect(testModule.counter).toBe(20);
    expect(testModule.name).toBe('Will');
  });
});
