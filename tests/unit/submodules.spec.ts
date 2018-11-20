import 'reflect-metadata';

import { Container } from 'typedi';
import Vue from 'vue';

import { TestModule } from '../../samples/store/modules/TestModule';
import VuexSimple, { getStoreBuilder } from '../../src';

Vue.use(VuexSimple);

describe('Submodules tests', () => {
  let store!: any;
  let snapshot!: string;

  beforeAll(async fn => {
    const storeBuilder = getStoreBuilder();
    storeBuilder.loadModules([TestModule]);
    store = storeBuilder.create();
    snapshot = JSON.stringify(store.state);
    fn();
  }, 100);

  afterAll(() => {
    Container.reset();
  });

  beforeEach(async () => {
    store.replaceState(JSON.parse(snapshot));
  });

  it('initial state', () => {
    const testModule = Container.get(TestModule);
    const my1 = testModule.myModule1;
    const my2 = testModule.myModule2;

    expect(my1).not.toBe(my2);
    expect(my1.counter).toBe(0);
    expect(my2.counter).toBe(0);
  });

  it('increment', () => {
    const testModule = Container.get(TestModule);
    const my1 = testModule.myModule1;
    const my2 = testModule.myModule2;

    expect(my1.counter).toBe(0);
    expect(my2.counter).toBe(0);

    my1.increment();
    my2.increment();
    my2.increment();

    expect(my1.counter).toBe(1);
    expect(my2.counter).toBe(2);
  });
});
