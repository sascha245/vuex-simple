import { Component, Vue } from 'vue-property-decorator';

import { useStore } from '../../src';
import { MyStore } from '../store/store';

@Component
export default class Home extends Vue {
  public store = useStore<MyStore>(this.$store);

  public get testModule() {
    return this.store.test;
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

  public created() {}
}
