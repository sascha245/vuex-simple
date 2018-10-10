import { injectAll } from '../index';

export class MockComponent {
  constructor() {
    this.beforeCreate();
  }

  // simulate beforeCreate of Vue components, but you can use it however you like it
  private beforeCreate() {
    injectAll(this);
  }
}
