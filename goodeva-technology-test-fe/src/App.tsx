/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import TodoList from './component/TodoList';
import type { Todo, TodoStatus } from './api/todos';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todos';

type StatusFilter = 'all' | TodoStatus;

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Todo | null>(null);
  const [toasts, setToasts] = useState<
    { id: number; type: 'success' | 'error'; message: string }[]
  >([]);
  const lastProblemToastAtRef = React.useRef<number>(0);

  function showToast(message: string, type: 'success' | 'error' = 'success', duration = 2500) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }

  // Load todos on mount and when search changes (server-side filter)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const list = await getTodos(search.trim() || undefined);
        if (!cancelled) setTodos(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Gagal memuat todos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [search]);

  const filtered = useMemo(() => {
    let list = todos;
    if (filter !== 'all') list = list.filter((t) => t.status === filter);
    return list;
  }, [todos, filter]);

  async function addTodo(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const value = title.trim();
    if (!value) return;
    setLoading(true);
    try {
      const created = await createTodo({ title: value });
      setTodos((s) => [created, ...s]);
      setTitle('');
    } catch (e: any) {
      setError(e?.message ?? 'Gagal menambah todo');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: TodoStatus) {
    setError(null);
    setLoading(true);
    try {
      const updated = await updateTodo(id, { status });
      setTodos((s) => s.map((t) => (t.id === id ? updated : t)));
      if (selected && selected.id === id) setSelected(updated);
      showToast('Status updated', 'success');
    } catch (e: any) {
      setError(e?.message ?? 'Gagal update status');
    } finally {
      setLoading(false);
    }
  }

  function remove(id: number) {
    setLoading(true);
    setError(null);
    deleteTodo(id)
      .then(() => {
        setTodos((s) => s.filter((t) => t.id !== id));
        showToast('Todo deleted', 'success');
      })
      .catch((e: any) => {
        setError(e?.message ?? 'Gagal menghapus todo');
        showToast('Failed to delete', 'error');
      })
      .finally(() => setLoading(false));
  }

  // Title editing is not supported by backend PATCH DTO; keep read-only in UI.

  function clearDone() {
    setTodos((s) => s.filter((t) => t.status !== 'completed'));
  }

  function openDetail(todo: Todo) {
    setSelected(todo);
  }

  function closeDetail() {
    setSelected(null);
  }

  async function saveProblemDesc(id: number, desc: string) {
    setError(null);
    setLoading(true);
    try {
      // Backend requires status on PATCH; mark as problem with optional description
      const updated = await updateTodo(id, { status: 'problem', problem_desc: desc });
      setTodos((s) => s.map((t) => (t.id === id ? updated : t)));
      if (selected && selected.id === id) setSelected(updated);
      const now = Date.now();
      if (now - lastProblemToastAtRef.current > 2000) {
        showToast('Problem description saved', 'success');
        lastProblemToastAtRef.current = now;
      }
    } catch (e: any) {
      setError(e?.message ?? 'Gagal menyimpan problem desc');
    } finally {
      setLoading(false);
    }
  }

  function generateAiRecommendation(desc: string): string {
    const d = (desc || '').toLowerCase();
    if (!d) return 'Tambahkan deskripsi masalah untuk rekomendasi yang lebih tepat.';
    if (d.includes('bug') || d.includes('error'))
      return 'Coba reproduksi langkah-langkahnya, tulis test sederhana, dan pecah tugas menjadi langkah kecil.';
    if (d.includes('deadline') || d.includes('waktu'))
      return 'Prioritaskan tugas, gunakan teknik Pomodoro, dan buat target harian yang realistis.';
    if (d.includes('api') || d.includes('backend'))
      return 'Periksa kontrak API, tambahkan log, dan buat mock untuk mengisolasi masalah.';
    return 'Bagi tugas menjadi sub-tugas, tetapkan definisi selesai yang jelas, dan cek progres berkala.';
  }

  const doneCount = todos.filter((t) => t.status === 'completed').length;

  return (
    <div id="app-root">
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
      <header className="hero">
        <h1>TodoList Mini Test </h1>
        <p className="subtitle">
          Halaman tunggal: tambah, cari, tabel status, detail, dan rekomendasi.
        </p>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <form className="todo-form" onSubmit={addTodo}>
        <input
          placeholder="Judul todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="controls">
        <div className="filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All
          </button>
          <button
            className={filter === 'created' ? 'active' : ''}
            onClick={() => setFilter('created')}
          >
            Created
          </button>
          <button
            className={filter === 'on_going' ? 'active' : ''}
            onClick={() => setFilter('on_going')}
          >
            On Going
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={filter === 'problem' ? 'active' : ''}
            onClick={() => setFilter('problem')}
          >
            Problem
          </button>
        </div>
        <div className="stats">
          Total: {todos.length} • Done: {doneCount}
        </div>
        <div>
          <button className="clear" onClick={clearDone} disabled={doneCount === 0}>
            Clear done
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search title... (server-side)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <TodoList
        todos={filtered}
        onUpdateStatus={updateStatus}
        onDelete={remove}
        onOpenDetail={openDetail}
      />

      {todos.length === 0 && <p className="empty">Belum ada todo — tambahkan yang pertama!</p>}

      {/* Detail modal */}
      {selected && (
        <div className="modal-backdrop" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Detail Todo</h3>
            <div className="modal-row">
              <strong>Title:</strong> <span>{selected.title}</span>
            </div>
            <div className="modal-row">
              <strong>Status:</strong> <span>{selected.status}</span>
            </div>
            <div className="modal-row">
              <strong>Problem Desc:</strong>
              <textarea
                value={selected.problem_desc || ''}
                onChange={(e) => saveProblemDesc(selected.id, e.target.value)}
                placeholder="Deskripsikan masalah..."
              />
            </div>
            <div className="modal-row">
              <strong>AI Recommendation:</strong>
              <div className="recommendation">
                {generateAiRecommendation(selected.problem_desc || '')}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeDetail}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
