import { useState, useEffect, useRef } from 'react';

// ============================================
// 04-lifecycle: 生命周期与 useEffect
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
        <hr/>
        <h1 style={{
          paddingTop: '20px',
          fontFamily: '"KaiTi", "STKaiti", "楷体", serif', // 兼容多平台的楷体写法
          backgroundImage: 'linear-gradient(to right, #000000, #4ecdc4)', // 用背景色代替文字颜色
          WebkitBackgroundClip: 'text',      // 将背景裁剪为文字形状（WebKit内核必需）
          backgroundClip: 'text',            // 标准属性
          color: 'transparent',              // ⚠️ 关键：隐藏原始文字颜色，让渐变透出来
          fontSize: '2rem',                  // 可选：调整字号以更好展示渐变
        }}>何当共剪西窗烛，却话巴山夜雨时。</h1>
      </footer>
    </div>
  );
}

// ============================================
// Timer: 展示 mount / update / unmount 三个阶段
//
// 父组件通过 onLog prop 传入一个记录日志的函数，
// Timer 在自身生命周期的不同阶段调用它，方便观察。
// ============================================
function Timer({onLog}) {
  // seconds: 当前计时秒数，每秒 +1
  // setSeconds(s => s + 1) 用函数式更新，避免闭包陷阱
  const [seconds, setSeconds] = useState(0);

  // intervalRef: 用 useRef 保存 setInterval 返回的计时器 id
  // useRef 的值在重新渲染时保持不变，且修改它不会触发重新渲染
  /*
   Q: 为什么用 useRef 不用普通变量？
   A: 因为组件每次渲染都会重新执行，普通变量会被重置。useRef 的值在多次渲染之间保持不变，而且修改它不会触发重新渲染。
  */
  const intervalRef = useRef(null);   // 第一次渲染创建这个对象，之后这个intervalRef对象不会变。
  // 即： 下一次渲染，intervalRef 还是同一个对象 。  intervalRef.current 里仍然保存着上一次的 id

  // ① 第一个 useEffect：处理 mount 和 unmount
  //    空依赖数组 [] 表示：只在组件挂载时执行 setup，卸载时执行 cleanup  ==》 也就是它return的箭头函数
  useEffect(() => {
    // mount 阶段：组件第一次出现在 DOM 中时执行
    onLog('mount', 'Timer 组件挂载，启动定时器');

    /*
      setInterval 返回一个数字 ID，用来以后停止这个定时器：

     const id = setInterval(...);
     // 以后想停掉它：
     clearInterval(id);

   这里把 ID 存到 intervalRef.current 里，是为了在组件卸载时能找到它并清理。

    */


    // 启动定时器，每秒把 seconds 加 1
    // setInterval 返回一个 id，用 intervalRef.current 存起来
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1); // 函数式更新：基于最新值 +1   ==》 每次更新，组件自动渲染
    }, 1000);

    // 清理函数（cleanup）：组件卸载前执行
    // 作用：清除定时器，防止内存泄漏和后台继续计数
    return () => {
      clearInterval(intervalRef.current);
      onLog('unmount', 'Timer 组件卸载，清理定时器');
    };
  }, []); // 空依赖 = 只在 mount/unmount 执行


  // ② 第二个 useEffect：监听 seconds 变化
  //    [seconds] 表示：seconds 每次更新都会执行
  useEffect(() => {
    if (seconds > 0) {
      // update 阶段：state 变化导致重新渲染后执行
      onLog('update', `计时器更新: ${seconds}s`);
    }
  }, [seconds]);

  return (
    <div>
      {/* padStart(2, '0') 让个位数显示成 01, 02 ... */}
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
        setData(json);   // 结果放进data里面，然后渲染更新
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();  // ✅ 直接调用，不用 await。 | fetchUser() 调用后返回 Promise，但我们不关心，直接忽略

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


  // 初始化挂载才触发，只触发一次
  // ❌ 错误：遗漏依赖 count
  useEffect(() => {
    setWrong(count * 2);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // count更新就触发
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
