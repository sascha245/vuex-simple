import { Module, State } from '../../src';
import { MyModule } from './modules/MyModule';
import { TestModule } from './modules/TestModule';

export class MyStore {
  @Module()
  public my = new MyModule(20);

  @Module()
  public test = new TestModule();

  @State()
  public version = '2.0.0';
}
