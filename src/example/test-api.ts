import { Service } from 'typedi';

@Service()
export class TestApi {
  public async countItems() {
    await new Promise(r => setTimeout(r, 500));
    return 42;
  }
}
