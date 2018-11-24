import { Getter, Module, Mutation } from '../../../src';
import { MyModule } from './MyModule';
import { TestMutations } from './TestMutations';
import { TodoModule } from './TodoModule';

export class TestModule extends TestMutations {
  @Module()
  public my1 = new MyModule(5);

  @Module()
  public my2 = new MyModule();

  @Module()
  public todos = new TodoModule();

  @Getter()
  public get total() {
    return this.counter + this.my1.counter + this.my2.counter;
  }

  @Mutation()
  public setCounter(count: number) {
    this.counter = count;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }
}
