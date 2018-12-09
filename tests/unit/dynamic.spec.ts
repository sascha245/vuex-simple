import Vue from 'vue';
import Vuex from 'vuex';

import { MyModule } from '../../samples/store/modules/my';
import { TestModule } from '../../samples/store/modules/test';
import { MyStore } from '../../samples/store/store';
import { createVuexStore, registerModule, unregisterModule, useModule } from '../../src';

Vue.use(Vuex);

describe('Dynamic modules', () => {
  it('register and use dynamic module', () => {
    const $store = createVuexStore(new MyStore());
    const my = new MyModule(6);
    registerModule($store, ['toto'], my);

    expect(my).not.toBe(undefined);
    expect(my!.counter).toBe(6);

    let thrownError;
    try {
      my!.increment();
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBe(undefined);
    expect(my!.counter).toBe(7);
  });

  it('register dynamic module on standard vuex store', () => {
    const $store = new Vuex.Store({
      state: {}
    });
    registerModule($store, ['toto'], new MyModule(6));

    const my = useModule<MyModule>($store, ['toto']);
    expect(my).not.toBe(undefined);
    expect(my!.counter).toBe(6);

    let thrownError;
    try {
      my!.increment();
      $store.commit('toto/increment');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBe(undefined);
    expect(my!.counter).toBe(8);
  });

  it('useModule', () => {
    const $store = createVuexStore(new MyStore());
    registerModule($store, ['toto'], new MyModule(6));

    const store = useModule<MyStore>($store, []);
    const my1 = useModule<MyModule>($store, ['test', 'my1']);
    const toto = useModule<MyModule>($store, ['toto']);

    expect(store).not.toBe(undefined);
    expect(toto).not.toBe(undefined);
    expect(my1).not.toBe(undefined);

    expect(toto!.counter).toBe(6);
  });

  it('unregister dynamic module', () => {
    const $store = createVuexStore(new MyStore());
    registerModule($store, ['toto'], new TestModule());
    unregisterModule($store, ['toto']);

    let thrownError;
    try {
      registerModule($store, ['toto'], new TestModule());
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toBe(undefined);
  });

  it('throw on override static module', () => {
    const $store = createVuexStore(new MyStore());

    let thrownError;
    try {
      registerModule($store, ['test', 'my1'], new MyModule(6));
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.code).toBe('already_exists');
    expect(thrownError.params.namespace).toBe('test/my1');
  });

  it('throw on override dynamic module', () => {
    const $store = createVuexStore(new MyStore());
    registerModule($store, ['toto'], new MyModule(6));

    let thrownError;
    try {
      registerModule($store, ['toto'], new MyModule(12));
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.code).toBe('already_exists');
    expect(thrownError.params.namespace).toBe('toto');
  });

  it('throw on unregister static module', () => {
    const $store = createVuexStore(new MyStore());

    let thrownError;
    try {
      unregisterModule($store, ['test']);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.code).toBe('remove_static');
    expect(thrownError.params.namespace).toBe('test');
  });
});
