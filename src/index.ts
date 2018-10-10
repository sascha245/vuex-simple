import { install } from './install';

export {
  Container,
  Service,
  Inject,
  Token,
  ServiceOptions,
  ServiceIdentifier,
  ServiceMetadata
} from 'typedi';

export * from './install';
export * from './decorators';
export { getStoreBuilder } from './store-builder';

export { injectAll } from './utils/inject-util';

export default {
  install
};
