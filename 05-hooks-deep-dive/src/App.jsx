import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ============================================
// 05-hooks-deep-dive: Hooks 深入探索
// hook只能在 函数组件 或 自定义 Hook里面调用

//
// 本章核心内容：
//   1. useRef：保存不触发渲染的值 / DOM 引用
//   2. useMemo：缓存昂贵计算结果
//   3. useCallback：缓存函数引用，配合 memo 优化子组件
//   4. 自定义 Hooks：复用状态逻辑
// ============================================

// ============================================
// 自定义 Hook: useLocalStorage
//
// 作用：让 state 持久化到浏览器的 localStorage，刷新页面后数据不丢失。
// 命名约定：自定义 Hook 名称必须以 use 开头。
//
// 参数：
//   key - 存在 localStorage 里的键名
//   initialValue - 没有缓存时的默认值
// 返回值：
//   [value, setValue] - 和 useState 一样的用法
// ============================================
function useLocalStorage(key, initialValue) {
  // 💫💫💫 setValue 可以触发重新渲染 ！！！！！
  // useState 传入函数：只在首次渲染时执行，避免每次渲染都读取 localStorage
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      // 有缓存就解析，没缓存就用默认值
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      // 如果 localStorage 不可用或解析失败，回退到默认值
      return initialValue;
    }
  });

  // value 变化时，同步写入 localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);   // 这里是key/value变化时，触发useEffect。 先变化再触发
 // 也就是这个hook，不会主动触发写入，需要外部的变化。

  return [value, setValue];
}

// ============================================
// 自定义 Hook: useWindowSize
//
// 作用：监听浏览器窗口大小变化，返回当前窗口宽高。
// 这是一个典型的订阅浏览器事件的自定义 Hook。
// ============================================
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // resize 事件处理函数
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // 订阅窗口 resize 事件   | 搭配下面的空依赖，只触发一次订阅
    window.addEventListener('resize', handler);

    // cleanup：组件卸载时取消订阅，防止内存泄漏  | return的函数是最后一次（取消挂载）触发的
    return () => window.removeEventListener('resize', handler);
  }, []); // 空依赖：只在 mount/unmount 时订阅和取消   | 只有在第一次和最后一次才触发

  return size;
}

export default function App() {
  // 使用自定义 Hook 管理主题，刷新页面后主题不变
  const [theme, setTheme] = useLocalStorage('rzt-theme', 'light');

  // 主题变化时，同步到 html 根元素的 data-theme 属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // setState 看这个
  // 下面的点击按钮切换主题后，触发useLocalStorage里面的setState，开始重新渲染。
  // 然后触发useLocalStorage里面的useEffect，APP的触发useLocalStorage，写入 localStorage。
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
        <h1>忆昔当年泪不干</h1>
      </footer>
    </div>
  );
}

// ============================================
// RefDemo: useRef 演示
//
// useRef 的两个典型用途：
//   1. 获取 DOM 元素引用（如 input 聚焦）
//   2. 保存不会触发重新渲染的值（如渲染次数统计）
// ============================================
function RefDemo() {
  // inputRef.current 会指向真实的 <input> DOM 节点
  // 因为：  <input ref={inputRef}  挂载在input元素上了
  const inputRef = useRef(null);

  // renderCount.current 用来统计渲染次数
  // 修改它不会触发重新渲染
  const renderCount = useRef(0);

  // 🤡 有了setValue就可以触发重渲染    只有  useState  才会触发渲染！！！
  const [value, setValue] = useState('');

  // 每次渲染都 +1，但界面不会因为 +1 而再次渲染
  renderCount.current++;

  // 点击按钮时，让 input 获得焦点
  const focusInput = () => inputRef.current?.focus();

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* ref={inputRef} 把 input DOM 节点绑定到 inputRef.current */}
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
// MemoDemo: useMemo 演示
//
// useMemo 作用：缓存昂贵计算的结果，避免在无关 state 变化时重复计算。
//
// 语法：useMemo(() => 计算函数, [依赖项])
// 只有当依赖项变化时，才会重新执行计算函数。
// ============================================
function MemoDemo() {
  const [n, setN] = useState(10);
  const [extra, setExtra] = useState(0);

  // 模拟昂贵计算：斐波那契递归
  const fibonacci = (num) => {
    if (num <= 1) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
  };

  // 使用 useMemo 缓存 fibonacci(n) 的结果
  // 只有 n 变化时才重新计算；extra 变化时不会重新计算
  const fibResult = useMemo(() => {
    console.log('计算 Fibonacci...');
    return fibonacci(n);
  }, [n]);

  return (
    <div>
      <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>
        调整 n 会触发 Fibonacci 计算，点击「无关按钮」不会触发重新计算。  | 但会触发 新渲染
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
// CallbackDemo: useCallback 演示
//
// useCallback 作用：缓存函数引用，避免每次渲染都创建新函数。
//
// 通常配合 React.memo 使用：
//   - 父组件渲染时，如果传给子组件的 props 没变，子组件跳过渲染
//   - 但如果父组件每次创建新的函数，子组件会以为 props 变了，导致无效重渲染
//
// 语法：useCallback(() => { ... }, [依赖项])
// ============================================

/*
在 React 里，组件每次重新渲染，函数内部定义的所有函数都会重新创建
   ```
     function Parent() {
       const [count, setCount] = useState(0);

       // 每次 Parent 重新渲染，handleClick 都是一个新的函数
       const handleClick = () => {
         setCount(c => c + 1);
       };

       return <Child onClick={handleClick} />;
     }
   ```
   每次 Parent 渲染，handleClick 的引用都变了。
========================================================================
   如果你用 React.memo 优化子组件：
   ```
     const Child = React.memo(function Child({ onClick }) {
       console.log('Child 渲染');
       return <button onClick={onClick}>+1</button>;
     });
   ```

   React.memo 的作用是：如果 props 没变，跳过渲染。
   但问题是：每次 Parent 渲染都传一个新的 handleClick 给 Child，React 认为 props 变了，所以 Child 还是会重新渲染。
   React.memo 就白用了。
========================================================================
    useCallback 会缓存这个函数，只要依赖项 [] 不变，每次渲染返回的都是同一个函数引用。
*/
function CallbackDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ 不使用 useCallback：每次父组件渲染都会创建一个新函数
  // 这个新的函数引用传给子组件后，子组件会认为 props 变化了
  const handleIncrementBad = () => setCount(c => c + 1);

  // ✅ 使用 useCallback：只在依赖变化时创建新函数
  // 这里依赖数组是 []，所以函数引用永远不会变
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

// ============================================
// ExpensiveChild: 配合 React.memo 演示 useCallback 效果
//
// React.memo 会记住组件的 props：
//   - 如果 props 没有变化，跳过本次渲染
//   - 如果 props 变化了，正常渲染
//
// 因此：
//   - Bad 按钮每次父组件渲染都传新函数 → 子组件每次都渲染
//   - Good 按钮每次传同一个函数引用 → 子组件只在首次渲染
// ============================================

// 这里不用第一个ExpensiveChild 和 第二个ExpensiveChild（在React.memo里）同名
// 理解：这个 React.memo 就相当于是裹了一层，本质还是裹的那一层函数  { onClick, label } 这个是prop
const ExpensiveChild = React.memo(function ExpensiveChild({ onClick, label }) {
  const renderCount = useRef(0);

  // 每次渲染都 +1，用于观察重渲染次数
  renderCount.current++;

  return (
    <button className="btn" onClick={onClick} style={{ width: '100%' }}>
      {label} Child (渲染 {renderCount.current} 次)
    </button>
  );
});

// ============================================
// CustomHookDemo: 自定义 Hooks 演示
//
// 自定义 Hooks 的本质：把 可复用的状态逻辑 提取成以 use 开头的函数。
// 它们不是组件，只是复用逻辑的函数。
// ============================================
function CustomHookDemo() {
  // useWindowSize：订阅窗口大小
  const { width, height } = useWindowSize();

  // useLocalStorage：state 持久化到 localStorage
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
