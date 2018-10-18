import { Service } from "typedi";

@Service()
export class TestService {
  private _something = 42;

  public async countItems() {
    await new Promise(r => setTimeout(r, 500));
    return 42;
  }
}
