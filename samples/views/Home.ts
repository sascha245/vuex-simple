import { Component, Prop, Vue } from 'vue-property-decorator';

import { Inject } from '../../src';
import { TestModule } from '../store/modules/TestModule';

// tslint:disable

// base.ts
@Component
class BaseHome extends Vue {
  @Inject()
  public testModule!: TestModule;
  // ...
}

@Component
export default class Home extends BaseHome {

  public get counter() {
    return this.testModule.counter;
  }

  public increment() {
    this.testModule.increment();
  }

  public created() {}
}
