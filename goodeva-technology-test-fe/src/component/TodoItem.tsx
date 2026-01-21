import type { Todo } from '../api/todos';

type Props = {
  index: number;
  todo: Todo;
  onUpdateStatus: (id: number, status: Todo['status']) => void;
  onDelete: (id: number) => void;
  onOpenDetail: (todo: Todo) => void;
};

export default function TodoItem({ index, todo, onUpdateStatus, onDelete, onOpenDetail }: Props) {
  return (
    <tr className={`todo-row ${todo.status === 'completed' ? 'completed' : ''}`}>
      <td className="col-index">{index}</td>
      <td className="col-title">
        <span className="text">{todo.title}</span>
      </td>
      <td className="col-status">
        <select
          value={todo.status}
          onChange={(e) => onUpdateStatus(todo.id, e.target.value as Todo['status'])}
        >
          <option value="created">created</option>
          <option value="on_going">on_going</option>
          <option value="completed">completed</option>
          <option value="problem">problem</option>
        </select>
      </td>
      <td className="col-actions">
        <button className="detail" onClick={() => onOpenDetail(todo)} aria-label="show detail">
          Detail
        </button>
        <button className="delete" onClick={() => onDelete(todo.id)} aria-label="delete todo">
          Hapus
        </button>
      </td>
    </tr>
  );
}
