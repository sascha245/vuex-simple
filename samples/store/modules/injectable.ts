import { Inject, Injectable } from 'vue-typedi';

import { Getter, Module } from '../../../src';
import { TestService } from '../services/TestService';
import { MyModule } from './my';

@Injectable()
export class InjectableModule {
  @Inject()
  public testService!: TestService;

  @Module()
  public my1 = new MyModule(5);

  @Module()
  public my2 = new MyModule();

  @Getter()
  public get total() {
    return this.my1.counter + this.my2.counter;
  }
}
