// import { Inject } from "typedi";
import { Inject, Module, Mutation } from '../../../src';
import { TestService } from '../services/TestService';
import { TestMutations } from './TestMutations';

@Module('test')
export class TestModule extends TestMutations {
  @Inject()
  private testService!: TestService;

  @Mutation()
  public setCounter(count: number) {
    this.counter = count;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }

  public async countItems() {
    const count = await this.testService.countItems();
    this.setCounter(count);
  }
}
