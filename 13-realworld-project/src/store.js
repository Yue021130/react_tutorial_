import { create } from 'zustand';

// ============================================
// 13-realworld-project: 完整 Todo 应用
// 技术栈: React 19 + React Router 7 + Zustand
// ============================================

export const useTodoStore = create((set) => ({
  todos: [
    { id: 1, text: '学习 React 基础', completed: true },
    { id: 2, text: '掌握 Hooks', completed: false },
    { id: 3, text: '构建实战项目', completed: false },
  ],
  filter: 'all', // all | active | completed
  addTodo: (text) => set((s) => ({
    todos: [...s.todos, { id: Date.now(), text, completed: false }],
  })),
  toggleTodo: (id) => set((s) => ({
    todos: s.todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t),
  })),
  deleteTodo: (id) => set((s) => ({
    todos: s.todos.filter((t) => t.id !== id),
  })),
  setFilter: (filter) => set({ filter }),
}));
