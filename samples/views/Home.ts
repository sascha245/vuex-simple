import { Component, Prop, Vue } from 'vue-property-decorator';

import { Inject } from '../../src';
import { TestModule } from '../store/modules/TestModule';

@Component({
  components: {}
})
export default class Home extends Vue {
  @Inject()
  public testModule!: TestModule;

  public get counter() {
    return this.testModule.counter;
  }

  public increment() {
    this.testModule.increment();
  }

  public created() {}
}
