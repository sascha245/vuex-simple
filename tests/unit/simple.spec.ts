import Vue from 'vue';
import Vuex from 'vuex';

import { MyStore } from '../../samples/store/store';
import { createVuexStore, useStore } from '../../src';

Vue.use(Vuex);

describe('Simple tests', () => {
  it('initial state', () => {
    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);
    const testModule = store.test;

    expect(testModule.counter).toBe(10);
    expect(testModule.name).toBe('Will');
  });

  it('simple increment', () => {
    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);
    const testModule = store.test;

    expect(testModule.counter).toBe(10);

    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    const mockIncrement = jest.fn(() => testModule.increment());
    mockIncrement();

    expect(mockIncrement).toReturn();
    expect(testModule.counter).toBe(1);
  });

  it('simple computed getters', () => {
    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);
    const testModule = store.test;

    testModule.setCounter(0);

    expect(testModule.normalGetter).not.toBe(testModule.normalGetter);
    expect(testModule.cachedGetter).toBe(testModule.cachedGetter);
    expect(testModule.cachedGetter.item).toBe(100);

    const mockIncrement = jest.fn(() => testModule.increment());
    mockIncrement();

    expect(mockIncrement).toReturn();

    expect(testModule.cachedGetter.item).toBe(101);
  });

  it('simple incrementAsync', async () => {
    expect.assertions(3);

    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);
    const testModule = store.test;

    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    const p = testModule.asyncIncrement();
    expect(p).resolves.toBeUndefined();

    await p;

    expect(testModule.counter).toBe(1);
  });

  it('store replaceState', async () => {
    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);
    const testModule = store.test;

    testModule.setCounter(0);

    // set module counter to an initial value of 3
    expect(testModule.counter).toBe(0);
    testModule.increment();
    testModule.increment();
    testModule.increment();
    expect(testModule.counter).toBe(3);

    // take a snapshot, modify and apply it
    const newState = JSON.parse(JSON.stringify($store.state));
    newState.test.counter = 1;
    $store.replaceState(newState);

    // check if replaced store values are taken into account by both the store and the module
    expect($store.state.test.counter).toBe(1);
    expect(testModule.counter).toBe(1);

    testModule.increment();

    // check if store and module is correctly synced
    expect($store.state.test.counter).toBe(2);
    expect(testModule.counter).toBe(2);
  });

  it('root store counter', async () => {
    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);

    expect(store.aRootCounter).toBe(0);
    await store.incrementRootCounter();
    await store.incrementRootCounter();
    expect(store.aRootCounter).toBe(2);
  });
});
