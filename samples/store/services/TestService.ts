import { Service } from 'vue-typedi';

@Service()
export class TestService {
  public async countItems() {
    await new Promise(r => setTimeout(r, 500));
    return 42;
  }
}
