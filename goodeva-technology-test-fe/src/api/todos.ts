import { http } from './http';

export type TodoStatus = 'created' | 'on_going' | 'completed' | 'problem';

// Server response shape
export type ServerTodo = {
  id: number;
  title: string;
  status: number; // enum as number from backend
  problemDesc: string | null;
  createdAt: string;
  updatedAt: string;
};

// UI shape used by components
export type Todo = {
  id: number;
  title: string;
  status: TodoStatus;
  problem_desc?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTodoDto = {
  title: string;
};

export type UpdateTodoDto = Partial<{
  status: TodoStatus;
  problem_desc: string;
}>;

// Map server numeric enum to string labels. Adjust if backend enum differs.
function statusNumToLabel(n: number): TodoStatus {
  // Expected backend enum mapping:
  // 0: created, 1: on_going, 2: completed, 3: problem
  switch (n) {
    case 0:
      return 'created';
    case 1:
      return 'on_going';
    case 2:
      return 'completed';
    case 3:
      return 'problem';
    default:
      return 'created';
  }
}

function toUiTodo(s: ServerTodo): Todo {
  return {
    id: s.id,
    title: s.title,
    status: statusNumToLabel(s.status),
    problem_desc: s.problemDesc ?? undefined,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export async function getTodos(search?: string): Promise<Todo[]> {
  const params = search ? { search } : undefined;
  const res = await http.get<ServerTodo[]>('/api/todos', { params });
  return res.data.map(toUiTodo);
}

export async function createTodo(payload: CreateTodoDto): Promise<Todo> {
  const res = await http.post<ServerTodo>('/api/todos', payload);
  return toUiTodo(res.data);
}

export async function updateTodo(id: number | string, payload: UpdateTodoDto): Promise<Todo> {
  const res = await http.patch<ServerTodo>(`/api/todos/${id}`, payload);
  return toUiTodo(res.data);
}

export async function deleteTodo(id: number | string): Promise<void> {
  await http.delete(`/api/todos/${id}`);
}
