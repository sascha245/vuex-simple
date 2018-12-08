import { Action, Getter, Module, Mutation, State } from '../../src';
import { MyModule } from './modules/my';
import { TestModule } from './modules/test';
import { TodoModule } from './modules/todo';

export class MyStore {
  @Module()
  public my = new MyModule(20);

  @Module()
  public test = new TestModule();

  @Module()
  public todo = new TodoModule();

  @State()
  public version = '2.0.0';

  @State()
  public rootCounter = 0;

  @Getter()
  public get aRootCounter() {
    return this.rootCounter;
  }

  /**
   * Getter example with method style access
   */
  @Getter()
  public get numberButIncreased() {
    return (nb: number) => {
      return nb + 1;
    };
  }

  @Mutation()
  public incrementRootCounter() {
    this.rootCounter += 1;
  }

  @Action()
  public async actionIncrementRootCounter() {
    await new Promise(r => setTimeout(r, 1000));
    this.incrementRootCounter();
  }
}
