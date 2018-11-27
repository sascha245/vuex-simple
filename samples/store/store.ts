import { Action, Getter, Module, Mutation, State } from '../../src';
import { MyModule } from './modules/MyModule';
import { TestModule } from './modules/TestModule';

export class MyStore {
  @Module()
  public my = new MyModule(20);

  @Module()
  public test = new TestModule();

  @State()
  public version = '2.0.0';

  @State()
  public rootCounter = 0;

  @Getter()
  public get aRootCounter() {
    return this.rootCounter;
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
