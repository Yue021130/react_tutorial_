import { useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { useTodoStore } from './store';

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>📝 Todo App</h1>
        <p style={{ color: 'var(--muted)' }}>React 19 + Zustand + React Router</p>
      </header>
      <nav>
        <NavLink to="/" end>全部</NavLink>
        <NavLink to="/active">进行中</NavLink>
        <NavLink to="/completed">已完成</NavLink>
      </nav>
      <Routes>
        <Route path="*" element={<TodoPage />} />
      </Routes>
    </div>
  );
}

function TodoPage() {
  const { todos, filter, addTodo, toggleTodo, deleteTodo, setFilter } = useTodoStore();
  const [text, setText] = useState('');

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text.trim());
    setText('');
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };

  return (
    <>
      <div className="card" style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="添加新任务..."
        />
        <button className="btn" onClick={handleAdd}>添加</button>
      </div>

      <div className="card" style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
        <span>总计: {stats.total}</span>
        <span>进行中: {stats.active}</span>
        <span>已完成: {stats.completed}</span>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>暂无任务</p>
        ) : (
          filtered.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span style={{ flex: 1 }}>{todo.text}</span>
              <button className="btn danger" onClick={() => deleteTodo(todo.id)}>删除</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
