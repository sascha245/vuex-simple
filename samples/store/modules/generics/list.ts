import { Mutation, State } from '../../../../src';

export class ListModule<T> {
  @State()
  public list: T[] = [];

  @Mutation()
  public set(list: T[]) {
    this.list = list;
  }
  @Mutation()
  public add(item: T) {
    this.list.push(item);
  }
  @Mutation()
  public remove(item: T) {
    const index = this.list.indexOf(item);
    if (index !== -1) {
      this.list.splice(index, 1);
    }
  }
}
