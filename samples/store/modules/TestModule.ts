// import { Inject } from "typedi";
import { Getter, Inject, Module, Mutation, State } from "../../../src";
import { TestService } from "../services/TestService";

@Module("test")
export class TestModule {
  @Inject()
  private testService!: TestService;

  @State()
  public counter: number = 10;

  @State()
  public name: string = "Will";

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

  @Mutation()
  public increment() {
    this.counter++;
  }

  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }

  public async countItems() {
    const count = await this.testService.countItems();
    this.setCounter(count);
  }

  @Mutation()
  public setCounter(count: number) {
    this.counter = count;
  }
}
