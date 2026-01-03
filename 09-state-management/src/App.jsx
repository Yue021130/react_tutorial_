import { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { create } from 'zustand';
import { atom, useAtom } from 'jotai';

// ============================================
// 09-state-management: 状态管理方案对比
// 学习目标：
//   1. Redux Toolkit 现代用法
//   2. Zustand 轻量状态管理
//   3. Jotai 原子化状态
// 预计学习时间：90 分钟
// ============================================

// --- Redux Toolkit ---
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (s) => { s.value += 1; },
    decrement: (s) => { s.value -= 1; },
    add: (s, action) => { s.value += action.payload; },
  },
});
const { increment, decrement, add } = counterSlice.actions;
const reduxStore = configureStore({ reducer: { counter: counterSlice.reducer } });

// --- Zustand ---
const useZustandStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  dec: () => set((s) => ({ count: s.count - 1 })),
  add: (n) => set((s) => ({ count: s.count + n })),
}));

// --- Jotai ---
const countAtom = atom(0);

export default function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <Provider store={reduxStore}>
      <div className="container">
        <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙' : '☀️'}
        </span>

        <header className="card" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--accent)' }}>09 状态管理</h1>
          <p style={{ color: 'var(--muted)' }}>Redux Toolkit · Zustand · Jotai</p>
        </header>

        <section className="card">
          <h2>📊 方案对比</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>特性</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Redux Toolkit</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Zustand</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Jotai</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--muted)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>学习曲线</td>
                <td style={{ textAlign: 'center' }}>中等</td>
                <td style={{ textAlign: 'center' }}>低</td>
                <td style={{ textAlign: 'center' }}>低</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>代码量</td>
                <td style={{ textAlign: 'center' }}>较多</td>
                <td style={{ textAlign: 'center' }}>极少</td>
                <td style={{ textAlign: 'center' }}>少</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>适用场景</td>
                <td style={{ textAlign: 'center' }}>大型应用</td>
                <td style={{ textAlign: 'center' }}>中小型</td>
                <td style={{ textAlign: 'center' }}>中小型</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem' }}>DevTools</td>
                <td style={{ textAlign: 'center' }}>✅ 优秀</td>
                <td style={{ textAlign: 'center' }}>✅ 支持</td>
                <td style={{ textAlign: 'center' }}>✅ 支持</td>
              </tr>
            </tbody>
          </table>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <ReduxDemo />
          <ZustandDemo />
          <JotaiDemo />
        </div>

        <footer className="card" style={{ textAlign: 'center' }}>
          <a href="../10-performance" className="btn">下一章：性能优化 →</a>
        </footer>
      </div>
    </Provider>
  );
}

function ReduxDemo() {
  const count = useSelector((s) => s.counter.value);
  const dispatch = useDispatch();
  return (
    <div className="card">
      <h3>🔴 Redux Toolkit</h3>
      <p style={{ fontSize: '2rem', textAlign: 'center', fontWeight: 'bold' }}>{count}</p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn" onClick={() => dispatch(decrement())}>-</button>
        <button className="btn" onClick={() => dispatch(increment())}>+</button>
        <button className="btn" onClick={() => dispatch(add(5))}>+5</button>
      </div>
    </div>
  );
}

function ZustandDemo() {
  const { count, inc, dec, add } = useZustandStore();
  return (
    <div className="card">
      <h3>🟡 Zustand</h3>
      <p style={{ fontSize: '2rem', textAlign: 'center', fontWeight: 'bold' }}>{count}</p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn" onClick={dec}>-</button>
        <button className="btn" onClick={inc}>+</button>
        <button className="btn" onClick={() => add(5)}>+5</button>
      </div>
    </div>
  );
}

function JotaiDemo() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <div className="card">
      <h3>🟢 Jotai</h3>
      <p style={{ fontSize: '2rem', textAlign: 'center', fontWeight: 'bold' }}>{count}</p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn" onClick={() => setCount(c => c - 1)}>-</button>
        <button className="btn" onClick={() => setCount(c => c + 1)}>+</button>
        <button className="btn" onClick={() => setCount(c => c + 5)}>+5</button>
      </div>
    </div>
  );
}
