import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ============================================
// 05-hooks-deep-dive: Hooks 深入探索
// 学习目标：
//   1. useRef - DOM 引用与持久化值
//   2. useMemo - 缓存计算结果
//   3. useCallback - 缓存函数引用
//   4. 自定义 Hooks - 复用逻辑
// 预计学习时间：75-90 分钟
// ============================================

// 自定义 Hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 自定义 Hook: useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

export default function App() {
  const [theme, setTheme] = useLocalStorage('rzt-theme', 'light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>05 Hooks 深入</h1>
        <p style={{ color: 'var(--muted)' }}>useRef · useMemo · useCallback · 自定义 Hooks</p>
      </header>

      {/* useRef 演示 */}
      <section className="card">
        <h2>🎯 useRef</h2>
        <RefDemo />
      </section>

      {/* useMemo 演示 */}
      <section className="card">
        <h2>⚡ useMemo</h2>
        <MemoDemo />
      </section>

      {/* useCallback 演示 */}
      <section className="card">
        <h2>🔗 useCallback</h2>
        <CallbackDemo />
      </section>

      {/* 自定义 Hooks */}
      <section className="card">
        <h2>🎣 自定义 Hooks</h2>
        <CustomHookDemo />
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <a href="../06-context" className="btn">下一章：Context API →</a>
      </footer>
    </div>
  );
}

// ============================================
// useRef 演示
// ============================================
function RefDemo() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  const [value, setValue] = useState('');

  renderCount.current++;

  const focusInput = () => inputRef.current?.focus();

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} placeholder="输入内容..." />
        <button className="btn" onClick={focusInput}>聚焦</button>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
        📊 渲染次数（不触发重渲染）: <strong>{renderCount.current}</strong>
      </p>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
        useRef 存储的值变化不会触发重渲染，适合保存 DOM 引用、计时器 ID、前一次的值等。
      </p>
    </div>
  );
}

// ============================================
// useMemo 演示
// ============================================
function MemoDemo() {
  const [n, setN] = useState(10);
  const [extra, setExtra] = useState(0);

  // 模拟昂贵计算
  const fibonacci = (num) => {
    if (num <= 1) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
  };

  // 使用 useMemo 缓存结果，extra 变化时不重新计算
  const fibResult = useMemo(() => {
    console.log('计算 Fibonacci...');
    return fibonacci(n);
  }, [n]);

  return (
    <div>
      <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>
        调整 n 会触发 Fibonacci 计算，点击「无关按钮」不会触发重新计算。
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button className="btn" onClick={() => setN(n => Math.max(1, n - 1))}>n--</button>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center' }}>n = {n}</span>
        <button className="btn" onClick={() => setN(n => n + 1)}>n++</button>
        <button className="btn" style={{ background: 'var(--muted)' }} onClick={() => setExtra(e => e + 1)}>
          无关按钮 ({extra})
        </button>
      </div>
      <div className="card" style={{ background: 'var(--bg)' }}>
        <strong>Fibonacci({n}) = {fibResult}</strong>
      </div>
    </div>
  );
}

// ============================================
// useCallback 演示
// ============================================
function CallbackDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 不使用 useCallback：每次渲染都创建新函数
  const handleIncrementBad = () => setCount(c => c + 1);

  // 使用 useCallback：只在 count 变化时创建新函数
  const handleIncrementGood = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        观察下方子组件的渲染日志。使用 useCallback 的按钮不会导致子组件不必要的重渲染。
      </p>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="输入文字触发父组件渲染..." />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>❌ 不用 useCallback</p>
          <ExpensiveChild onClick={handleIncrementBad} label="Bad" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--success)' }}>✅ 使用 useCallback</p>
          <ExpensiveChild onClick={handleIncrementGood} label="Good" />
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '1.2rem' }}>
        Count: <strong>{count}</strong>
      </p>
    </div>
  );
}

const ExpensiveChild = React.memo(function ExpensiveChild({ onClick, label }) {
  const renderCount = useRef(0);
  renderCount.current++;
  return (
    <button className="btn" onClick={onClick} style={{ width: '100%' }}>
      {label} Child (渲染 {renderCount.current} 次)
    </button>
  );
});

// ============================================
// 自定义 Hooks 演示
// ============================================
function CustomHookDemo() {
  const { width, height } = useWindowSize();
  const [name, setName] = useLocalStorage('rzt-name', '');

  return (
    <div>
      <div className="card" style={{ background: 'var(--bg)', marginBottom: '1rem' }}>
        <h4>🖥️ useWindowSize</h4>
        <p>窗口宽度: <strong>{width}px</strong> · 高度: <strong>{height}px</strong></p>
      </div>
      <div className="card" style={{ background: 'var(--bg)' }}>
        <h4>💾 useLocalStorage</h4>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>刷新页面后数据依然保留</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="输入你的名字..."
        />
        {name && <p style={{ marginTop: '0.5rem' }}>👋 你好, <strong>{name}</strong>!</p>}
      </div>
      <p style={{ marginTop: '1rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
        💡 自定义 Hooks 是复用状态逻辑的最佳方式，名称必须以 use 开头。
      </p>
    </div>
  );
}

import React from 'react';
