import { State } from '../../../src';

export class TestState {
  @State()
  public counter: number = 10;

  @State()
  public name: string = 'Will';
}
