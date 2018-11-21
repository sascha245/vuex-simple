import { Inject, Mutation, State } from '../../../src';
import { TestService } from '../services/TestService';

export class MyModule {
  @Inject()
  private testService!: TestService;

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
