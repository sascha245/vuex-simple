import "reflect-metadata";

import { Container } from "typedi";
import Vue from "vue";

import { TestModule } from "../../samples/store/modules/TestModule";
import VuexSimple, { getStoreBuilder } from "../../src";

Vue.use(VuexSimple);

describe("Simple tests", () => {
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

  it("initial state", () => {
    const testModule = Container.get(TestModule);

    expect(testModule.counter).toBe(10);
    expect(testModule.name).toBe("Will");
  });

  it("simple increment", () => {
    const testModule = Container.get(TestModule);

    expect(testModule.counter).toBe(10);

    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    const mockIncrement = jest.fn(() => testModule.increment());
    mockIncrement();

    expect(mockIncrement).toReturn();
    expect(testModule.counter).toBe(1);
  });

  it("simple computed getters", () => {
    const testModule = Container.get(TestModule);
    testModule.setCounter(0);

    expect(testModule.normalGetter).not.toBe(testModule.normalGetter);
    expect(testModule.cachedGetter).toBe(testModule.cachedGetter);
    expect(testModule.cachedGetter.item).toBe(100);

    const mockIncrement = jest.fn(() => testModule.increment());
    mockIncrement();

    expect(mockIncrement).toReturn();

    expect(testModule.cachedGetter.item).toBe(101);
  });

  it("simple incrementAsync", async () => {
    expect.assertions(3);

    const testModule = Container.get(TestModule);
    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    const p = testModule.asyncIncrement();
    expect(p).resolves.toBeUndefined();

    await p;

    expect(testModule.counter).toBe(1);
  });

  it("store replaceState", async () => {
    const testModule = Container.get(TestModule);
    testModule.setCounter(0);

    // set module counter to an initial value of 3
    expect(testModule.counter).toBe(0);
    testModule.increment();
    testModule.increment();
    testModule.increment();
    expect(testModule.counter).toBe(3);

    // take a snapshot, modify and apply it
    const newState = JSON.parse(JSON.stringify(store.state));
    newState.test.counter = 1;
    store.replaceState(newState);

    // check if replaced store values are taken into account by both the store and the module
    expect(store.state.test.counter).toBe(1);
    expect(testModule.counter).toBe(1);

    testModule.increment();

    // check if store and module is correctly synced
    expect(store.state.test.counter).toBe(2);
    expect(testModule.counter).toBe(2);
  });

  it("injection in module", async () => {
    expect.assertions(2);
    const testModule = Container.get(TestModule);
    testModule.setCounter(0);
    expect(testModule.counter).toBe(0);

    await testModule.countItems();

    expect(testModule.counter).toBe(42);
  });
});
