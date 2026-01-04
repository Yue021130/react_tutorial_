import { useState, useEffect, Suspense, lazy, memo, useCallback, Profiler } from 'react';

// ============================================
// 10-performance: 性能优化
// 学习目标：
//   1. React.memo 与 useMemo/useCallback
//   2. 懒加载与代码分割
//   3. Profiler API 使用
//   4. 常见性能陷阱
// 预计学习时间：75 分钟
// ============================================

// 懒加载组件
const HeavyChart = lazy(() => import('./HeavyChart'));

export default function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>10 性能优化</h1>
        <p style={{ color: 'var(--muted)' }}>React.memo · 懒加载 · Profiler · 代码分割</p>
      </header>

      <section className="card">
        <h2>🧠 React.memo 演示</h2>
        <MemoDemo />
      </section>

      <section className="card">
        <h2>⏳ 懒加载与 Suspense</h2>
        <LazyDemo />
      </section>

      <section className="card">
        <h2>📊 React Profiler</h2>
        <ProfilerDemo />
      </section>

      <section className="card">
        <h2>⚠️ 性能陷阱检查清单</h2>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--muted)' }}>
          <li>在 render 中创建新对象/数组/函数</li>
          <li>Context value 对象没有 useMemo 包裹</li>
          <li>列表没有稳定的 key</li>
          <li>不必要的状态提升到父组件</li>
          <li>没有在 useEffect 中正确清理副作用</li>
        </ul>
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <a href="../11-testing" className="btn">下一章：测试体系 →</a>
      </footer>
    </div>
  );
}

// ============================================
// React.memo 演示
// ============================================
function MemoDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <div>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        修改输入框文本（不修改 count），观察下方组件的渲染次数。
      </p>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="输入文字..." />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--warn)' }}>❌ 无 memo</p>
          <SlowChild label="Normal" count={count} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>✅ 有 memo</p>
          <FastChild label="Memoized" count={count} />
        </div>
      </div>
      <button className="btn" style={{ marginTop: '1rem' }} onClick={() => setCount(c => c + 1)}>
        count: {count}
      </button>
    </div>
  );
}

function SlowChild({ label }) {
  const renders = React.useRef(0);
  renders.current++;
  return (
    <div className="card" style={{ padding: '0.75rem', background: 'var(--bg)' }}>
      {label} — 渲染次数: {renders.current}
    </div>
  );
}

const FastChild = memo(function FastChild({ label }) {
  const renders = React.useRef(0);
  renders.current++;
  return (
    <div className="card" style={{ padding: '0.75rem', background: 'var(--bg)' }}>
      {label} — 渲染次数: {renders.current}
    </div>
  );
});

// ============================================
// 懒加载演示
// ============================================
function LazyDemo() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        点击按钮加载「重量级组件」，观察 Suspense fallback。
      </p>
      <button className="btn" onClick={() => setShow(!show)}>
        {show ? '卸载' : '加载 HeavyChart'}
      </button>
      {show && (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>加载中...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

// ============================================
// Profiler 演示
// ============================================
function ProfilerDemo() {
  const [logs, setLogs] = useState([]);

  const onRender = (id, phase, actualDuration) => {
    setLogs(prev => [{ id, phase, duration: actualDuration.toFixed(2), time: Date.now() }, ...prev].slice(0, 5));
  };

  return (
    <div>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        React Profiler 用于测量组件渲染性能。
      </p>
      <Profiler id="Demo" onRender={onRender}>
        <Counter />
      </Profiler>
      <ul style={{ listStyle: 'none', marginTop: '1rem', fontSize: '0.9rem' }}>
        {logs.map((log, i) => (
          <li key={log.time} style={{ padding: '0.3rem 0', borderBottom: '1px dashed var(--border)' }}>
            #{logs.length - i} {log.id} — {log.phase} — {log.duration}ms
          </li>
        ))}
      </ul>
    </div>
  );
}

function Counter() {
  const [n, setN] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button className="btn" onClick={() => setN(n => n - 1)}>-</button>
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{n}</span>
      <button className="btn" onClick={() => setN(n => n + 1)}>+</button>
    </div>
  );
}

import React from 'react';
