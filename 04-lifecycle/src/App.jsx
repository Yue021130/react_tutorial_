import { useState, useEffect, useRef } from 'react';

// ============================================
// 04-lifecycle: 生命周期与 useEffect
// 学习目标：
//   1. useEffect 的基本用法
//   2. 清理副作用（cleanup）
//   3. 依赖数组深入理解
//   4. 常见场景：订阅、定时器、网络请求
// 预计学习时间：60-75 分钟
// ============================================

export default function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const [showTimer, setShowTimer] = useState(true);
  const [logs, setLogs] = useState([]);

  const addLog = (phase, msg) => {
    setLogs(prev => [{ id: Date.now(), phase, msg }, ...prev].slice(0, 15));
  };

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>04 生命周期</h1>
        <p style={{ color: 'var(--muted)' }}>useEffect · 清理副作用 · 依赖数组</p>
      </header>

      {/* 定时器演示：展示 mount / update / unmount */}
      <section className="card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button className="btn" onClick={() => setShowTimer(v => !v)}>
            {showTimer ? '卸载定时器' : '挂载定时器'}
          </button>
          <button className="btn" style={{ background: 'var(--muted)' }} onClick={() => setLogs([])}>清空日志</button>
        </div>

        {showTimer ? (
          <Timer onLog={addLog} />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
            定时器已卸载（观察日志中的 unmount 事件）
          </div>
        )}

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>📋 生命周期日志</h3>
        <ul className="log-list">
          {logs.map(log => (
            <li key={log.id}>
              <span className={`phase-label ${log.phase}`}>{log.phase.toUpperCase()}</span>
              <span>{new Date(log.id).toLocaleTimeString()} — {log.msg}</span>
            </li>
          ))}
          {logs.length === 0 && <li style={{ color: 'var(--muted)' }}>暂无日志...</li>}
        </ul>
      </section>

      {/* 网络请求演示 */}
      <section className="card">
        <h2>🌐 数据获取</h2>
        <DataFetchDemo />
      </section>

      {/* 依赖数组陷阱 */}
      <section className="card">
        <h2>⚠️ 依赖数组陷阱</h2>
        <DependencyTrap />
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <h3>📝 总结</h3>
        <p style={{ color: 'var(--muted)' }}>
          useEffect 是函数组件处理副作用的核心工具。
          理解依赖数组、清理函数和渲染时机是掌握 React 的关键。
        </p>
        <a href="../05-hooks-deep-dive" className="btn" style={{ marginTop: '1rem' }}>
          下一章：Hooks 深入 →
        </a>
      </footer>
    </div>
  );
}

// ============================================
// Timer: 展示 mount / update / unmount
// ============================================
function Timer({ onLog }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    onLog('mount', 'Timer 组件挂载，启动定时器');

    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // 清理函数：组件卸载时执行
    return () => {
      clearInterval(intervalRef.current);
      onLog('unmount', 'Timer 组件卸载，清理定时器');
    };
  }, []); // 空依赖 = 只在 mount/unmount 执行

  // 每次 seconds 更新时记录
  useEffect(() => {
    if (seconds > 0) {
      onLog('update', `计时器更新: ${seconds}s`);
    }
  }, [seconds]);

  return (
    <div>
      <div className="timer-display">{seconds.toString().padStart(2, '0')}</div>
      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
        定时器每 1 秒更新一次
      </p>
    </div>
  );
}

// ============================================
// DataFetchDemo: 网络请求副作用
// ============================================
function DataFetchDemo() {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // 用于取消请求

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('请求失败');
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // 清理：取消未完成的请求
    return () => controller.abort();
  }, [userId]); // userId 变化时重新请求

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            className="btn"
            style={{ opacity: userId === id ? 1 : 0.5 }}
            onClick={() => setUserId(id)}
          >
            用户 {id}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: 'var(--accent)' }}>加载中...</p>}
      {error && <p style={{ color: 'var(--danger)' }}>错误: {error}</p>}
      {data && !loading && (
        <div className="card" style={{ background: 'var(--bg)' }}>
          <h4>{data.name}</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            📧 {data.email}<br />
            🏙️ {data.address?.city}<br />
            🏢 {data.company?.name}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// DependencyTrap: 演示依赖数组常见错误
// ============================================
function DependencyTrap() {
  const [count, setCount] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [correct, setCorrect] = useState(0);

  // ❌ 错误：遗漏依赖 count
  useEffect(() => {
    setWrong(count * 2);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ 正确：包含所有依赖
  useEffect(() => {
    setCorrect(count * 2);
  }, [count]);

  return (
    <div>
      <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>
        点击下方按钮，观察「错误示例」与「正确示例」的区别。
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setCount(c => c + 1)}>
          count: {count}
        </button>
        <div className="card" style={{ background: 'var(--danger)', color: '#fff', flex: 1, minWidth: 200 }}>
          <strong>❌ 错误（遗漏依赖）</strong><br />
          wrong = {wrong}
        </div>
        <div className="card" style={{ background: 'var(--success)', color: '#fff', flex: 1, minWidth: 200 }}>
          <strong>✅ 正确</strong><br />
          correct = {correct}
        </div>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
        💡 建议使用 ESLint 插件 eslint-plugin-react-hooks 自动检测遗漏依赖
      </p>
    </div>
  );
}
