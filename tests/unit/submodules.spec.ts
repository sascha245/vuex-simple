import Vue from 'vue';
import Vuex from 'vuex';

import { MyStore } from '../../samples/store/store';
import { createVuexStore, useStore } from '../../src';

Vue.use(Vuex);

describe('Submodules tests', () => {
  it('initial state', () => {
    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);
    const testModule = store.test;

    const my1 = testModule.my1;
    const my2 = testModule.my2;

    expect(my1).not.toBe(my2);
    expect(my1.counter).toBe(5);
    expect(my2.counter).toBe(0);
  });

  it('increment', () => {
    const $store = createVuexStore(new MyStore());
    const store = useStore<MyStore>($store);
    const testModule = store.test;

    const my1 = testModule.my1;
    const my2 = testModule.my2;

    expect(my1.counter).toBe(5);
    expect(my2.counter).toBe(0);

    my1.increment();
    my2.increment();
    my2.increment();

    expect(my1.counter).toBe(6);
    expect(my2.counter).toBe(2);
  });
});
