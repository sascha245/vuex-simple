import { ListModule } from './ListModule';

export interface Todo {
  userId: number;
  id: number;
  title: number;
  completed: boolean;
}

export class TodoModule extends ListModule<Todo> {
  public async fetchTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data: Todo[] = await response.json();
    this.set(data);
    return data;
  }
}
