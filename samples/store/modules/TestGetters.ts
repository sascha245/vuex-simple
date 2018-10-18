import { Getter } from '../../../src';
import { TestState } from './TestState';

export class TestGetters extends TestState {
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
}
