import "reflect-metadata";

import { Container } from "typedi";
import Vue from "vue";

import { mount } from "@vue/test-utils";

import { TestModule } from "../../samples/store/modules/TestModule";
import Home from "../../samples/views/Home";
import VuexSimple, { getStoreBuilder } from "../../src";

Vue.use(VuexSimple);

describe("Vue Component", () => {
  let store!: any;
  let snapshot!: string;

  beforeAll(async fn => {
    const storeBuilder = getStoreBuilder();
    storeBuilder.loadModules([TestModule]);
    store = storeBuilder.create();
    snapshot = JSON.stringify(store.state);
    fn();
  });

  afterAll(() => {
    Container.reset();
  });

  it("testModule is injected", () => {
    const testModule = Container.get(TestModule);
    testModule.setCounter(0);

    expect(testModule.counter).toBe(0);

    const wrapper = mount(Home, {
      mocks: {
        $store: store
      }
    });

    const vm: Home = wrapper.vm;

    expect(vm.testModule).not.toBeUndefined();

    expect(testModule.counter).toBe(vm.counter);

    vm.testModule.setCounter(23);
    expect(vm.counter).toBe(23);
    expect(testModule.counter).toBe(23);
  });
});
