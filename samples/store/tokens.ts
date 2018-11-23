import { Token } from 'vue-typedi';

export default {
  MY: new Token('my'),
  TEST: new Token('test'),
  TEST_MY1: new Token('test/my1'),
  TEST_MY2: new Token('test/my2')
};
