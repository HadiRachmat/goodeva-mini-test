export enum TodoStatus {
  CREATED = 0,
  ON_GOING = 1,
  COMPLETED = 2,
  PROBLEM = 3,
}

export const TodoStatusNames = {
  [TodoStatus.CREATED]: 'created',
  [TodoStatus.ON_GOING]: 'on_going',
  [TodoStatus.COMPLETED]: 'completed',
  [TodoStatus.PROBLEM]: 'problem',
} as const;

export type TodoStatusName = (typeof TodoStatusNames)[TodoStatus];

export function parseTodoStatus(input: string): TodoStatus {
  switch (input) {
    case 'created':
      return TodoStatus.CREATED;
    case 'on_going':
      return TodoStatus.ON_GOING;
    case 'completed':
      return TodoStatus.COMPLETED;
    case 'problem':
      return TodoStatus.PROBLEM;
    default:
      throw new Error(`Invalid status: ${input}`);
  }
}
