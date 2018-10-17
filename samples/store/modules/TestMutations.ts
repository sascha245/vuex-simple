import { Mutation } from '../../../src';
import { TestGetters } from './TestGetters';

export class TestMutations extends TestGetters {
  @Mutation()
  public increment() {
    this.counter++;
  }
}
