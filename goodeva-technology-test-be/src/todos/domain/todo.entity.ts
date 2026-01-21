import { TodoStatus } from './todo-status.enum';

export class Todo {
  constructor(
    public readonly id: number,
    public title: string,
    public status: TodoStatus,
    public problemDesc?: string | null,
    public readonly createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
