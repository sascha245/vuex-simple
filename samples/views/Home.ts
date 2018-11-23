import { Component, Vue } from 'vue-property-decorator';
import { Inject } from 'vue-typedi';

import { useStore } from '../../src';
import { TestModule } from '../store/modules/TestModule';
import { MyStore } from '../store/store';
import tokens from '../store/tokens';

@Component
export default class Home extends Vue {
  public store: MyStore = useStore(this.$store);

  @Inject(tokens.TEST)
  public testModule!: TestModule;

  // public get testModule() {
  //   return this.store.test;
  // }

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
