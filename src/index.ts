import { install } from './install';

export {
  Container,
  Service,
  Token,
  ServiceOptions,
  ServiceIdentifier,
  ServiceMetadata
} from 'typedi';

export * from './install';
export * from './decorators';
export { getStoreBuilder } from './store-builder';

export default {
  install
};
