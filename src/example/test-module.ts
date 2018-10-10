import { Inject } from 'typedi';

import { Getter, Module, Mutation, State } from '../index';
import { TestApi } from './test-api';

@Module('test')
export class TestModule {
  @Inject()
  private testApi!: TestApi;

  @State()
  public counter: number = 0;

  @Getter()
  public get cachedGetter() {
    return {
      item: this.counter + 100
    };
  }

  public get normalGetter() {
    return {
      item: this.counter + 100
    };
  }

  @Mutation()
  public increment() {
    this.counter++;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }

  public async countItems() {
    const count = await this.testApi.countItems();
    this.setCounter(count);
  }

  @Mutation()
  public setCounter(count: number) {
    this.counter = count;
  }
}
