import { Inject, Module, Mutation, Submodule } from '../../../src';
import { TestService } from '../services/TestService';
import { MyModule } from './MyModule';
import { TestMutations } from './TestMutations';

@Module('test')
export class TestModule extends TestMutations {
  @Inject()
  private testService!: TestService;

  @Submodule('my1')
  public myModule1!: MyModule;

  @Submodule('my2')
  public myModule2!: MyModule;

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
