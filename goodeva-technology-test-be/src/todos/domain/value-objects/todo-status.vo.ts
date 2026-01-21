import { DomainValidationError } from '../errors/domain-validation.error';
import { TodoStatus } from '../todo-status.enum';

export type StatusInput = 'created' | 'on_going' | 'completed' | 'problem';

export class TodoStatusVO {
  private constructor(private readonly _value: TodoStatus) {}

  static from(input: StatusInput): TodoStatusVO {
    const map: Record<StatusInput, TodoStatus> = {
      created: TodoStatus.CREATED,
      on_going: TodoStatus.ON_GOING,
      completed: TodoStatus.COMPLETED,
      problem: TodoStatus.PROBLEM,
    };
    const val = map[input];
    if (val === undefined) {
      throw new DomainValidationError('Status tidak valid');
    }
    return new TodoStatusVO(val);
  }

  get value(): TodoStatus {
    return this._value;
  }
}
