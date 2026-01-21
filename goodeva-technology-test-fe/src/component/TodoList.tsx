import type { Todo } from '../api/todos';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  onUpdateStatus: (id: number, status: Todo['status']) => void;
  onDelete: (id: number) => void;
  onOpenDetail: (todo: Todo) => void;
};

export default function TodoList({ todos, onUpdateStatus, onDelete, onOpenDetail }: Props) {
  return (
    <table className="todo-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((t, idx) => (
          <TodoItem
            key={t.id}
            index={idx + 1}
            todo={t}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </tbody>
    </table>
  );
}
