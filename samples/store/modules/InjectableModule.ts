import { Inject, Injectable } from 'vue-typedi';

import { Getter, Module } from '../../../src';
import { MyModule } from './MyModule';
import { TestModule } from './TestModule';

@Injectable()
export class InjectableModule {
  @Inject()
  public testModule!: TestModule;

  @Module()
  public my1 = new MyModule(5);

  @Module()
  public my2 = new MyModule();

  @Getter()
  public get total() {
    return this.my1.counter + this.my2.counter;
  }
}
