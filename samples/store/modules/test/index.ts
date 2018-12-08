import { TestMutations } from './mutations';

export class TestModule extends TestMutations {
  public async asyncIncrement() {
    await new Promise(r => setTimeout(r, 500));
    this.increment();
  }
}
