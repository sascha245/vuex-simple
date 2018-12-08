import { Getter } from '../../../../src';
import { TestState } from './state';

export class TestGetters extends TestState {
  @Getter()
  public get cachedGetter() {
    return {
      item: this.counter + 100
    };
  }

  @Getter()
  public get total() {
    return this.counter + this.my1.counter + this.my2.counter;
  }

  public get normalGetter() {
    return {
      item: this.counter + 100
    };
  }
}
