import { Mutation, State } from '../../../src';

export class MyModule {
  @State()
  public counter: number = 0;

  @Mutation()
  public increment() {
    this.counter++;
  }

  constructor(counter = 0) {
    this.counter = counter;
  }
}
