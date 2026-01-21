import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';

export abstract class TodoRepository {
  abstract findMany(search?: string): Promise<Todo[]>;
  abstract create(title: string): Promise<Todo>;
  abstract updateStatus(
    id: number,
    status: TodoStatus,
    problemDesc?: string | null,
  ): Promise<Todo>;
  abstract delete(id: number): Promise<void>;
}
