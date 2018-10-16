import "reflect-metadata";

import { Container } from "typedi";
import Vue from "vue";

import { TestModule } from "../../samples/store/modules/TestModule";
import VuexSimple, { getStoreBuilder } from "../../src";

Vue.use(VuexSimple);

const myContainer = Container.of("myContainer");

describe("Custom container tests", () => {
  let store!: any;
  let snapshot!: string;

  beforeAll(async fn => {
    const storeBuilder = getStoreBuilder();
    storeBuilder.useContainer(myContainer);
    storeBuilder.loadModules([TestModule]);
    store = storeBuilder.create();
    snapshot = JSON.stringify(store.state);
    fn();
  }, 100);

  beforeEach(async () => {
    store.replaceState(JSON.parse(snapshot));
  });

  it("tests myContainer not equal to Container", () => {
    const testModule = myContainer.get(TestModule);
    expect(testModule).not.toBeFalsy();
    testModule.setCounter(1032);

    const testModule2 = Container.get(TestModule);
    expect(testModule2).not.toBeFalsy();

    // No store created, should throw exception
    try {
      testModule2.setCounter(0);
      throw new Error("Should throw error: store not created");
    } catch (e) {}

    expect(testModule.counter).toBe(1032);
    // expect(testModule2.counter).toBe(0);
  });

  it("initial state", () => {
    const testModule = myContainer.get(TestModule);

    expect(testModule.counter).toBe(10);
    expect(testModule.name).toBe("Will");
  });

  it("simple increment", () => {
    const testModule = myContainer.get(TestModule);

    expect(testModule.counter).toBe(10);

    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    const mockIncrement = jest.fn(() => testModule.increment());
    mockIncrement();

    expect(mockIncrement).toReturn();
    expect(testModule.counter).toBe(1);
  });

  it("simple computed getters", () => {
    const testModule = myContainer.get(TestModule);
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

    const testModule = myContainer.get(TestModule);
    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    const p = testModule.asyncIncrement();
    expect(p).resolves.toBeUndefined();

    await p;

    expect(testModule.counter).toBe(1);
  });

  it("store replaceState", async () => {
    const testModule = myContainer.get(TestModule);
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

    const testModule = myContainer.get(TestModule);
    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    await testModule.countItems();

    expect(testModule.counter).toBe(42);
  });
});
