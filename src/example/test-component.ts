import { Inject } from '../index';
import { MockComponent } from '../tests/mock-component';
import { TestModule } from './test-module';

export class MyComponent extends MockComponent {
  @Inject()
  public testModule!: TestModule;
}
