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
export * from './store-builder';

export { injectAll } from './utils/inject-util';

export default {
  install
};
