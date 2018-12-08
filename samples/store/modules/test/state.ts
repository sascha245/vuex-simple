import { Module, State } from '../../../../src';
import { MyModule } from '../my';

export class TestState {
  @Module()
  public my1 = new MyModule(5);

  @Module()
  public my2 = new MyModule();

  @State()
  public counter: number = 10;

  @State()
  public name: string = 'Will';
}
