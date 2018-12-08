import { Mutation } from '../../../../src';
import { TestGetters } from './getters';

export class TestMutations extends TestGetters {
  @Mutation()
  public setCounter(count: number) {
    this.counter = count;
  }

  @Mutation()
  public increment() {
    this.counter++;
  }
}
