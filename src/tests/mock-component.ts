import { ContainerInstance } from 'typedi';

import { injectAll } from '../index';

export class MockComponent {
  constructor(container?: ContainerInstance) {
    this.beforeCreate(container);
  }

  // simulate beforeCreate of Vue components, but you can use it however you like it
  private beforeCreate(container?: ContainerInstance) {
    injectAll(this, container);
  }
}
