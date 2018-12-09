import { Component, Vue } from 'vue-property-decorator';
import { Inject } from 'vue-typedi';

import { registerModule, unregisterModule, useModule, useStore } from '../../src';
import { MyModule } from '../store/modules/my';
import { TestModule } from '../store/modules/test';
import { MyStore } from '../store/store';
import tokens from '../store/tokens';

@Component
export default class Home extends Vue {
  public store: MyStore = useStore(this.$store);

  @Inject(tokens.TEST)
  public testModule!: TestModule;

  public my1?: MyModule = useModule(this.$store, ['test', 'my1']);

  // public get testModule() {
  //   return this.store.test;
  // }

  public mounted() {
    const test = useModule<TestModule>(this.$store, ['test']);

    registerModule(this.$store, ['dynamic'], new TestModule());

    const dynamicModule = useModule<TestModule>(this.$store, ['dynamic']);
    if (dynamicModule) {
      dynamicModule.increment();
    }
  }
  public destroyed() {
    unregisterModule(this.$store, ['dynamic']);
  }

  public get counter() {
    return this.testModule.counter;
  }
  public get total() {
    return this.testModule.total;
  }

  public increment() {
    this.testModule.increment();
  }
}
