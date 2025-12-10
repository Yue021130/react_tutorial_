import {useEffect, useState} from 'react';

// ============================================
// 01-hello-react: 第一个 React 应用
// ============================================

function App() {
  // 主题状态：light | dark
  const [theme, setTheme] = useState('light');

  /*
       |      部分                               | 含义                                                                        |
      | ------------------------------------    | ------------------------------------------------------------------------    |
      | `useEffect(..., [theme])`               | 这是一个 React Hook，**依赖项数组**是 `[theme]`，表示只在 `theme` 变化时执行      |
      | `document.documentElement`              | 指向 DOM 中的 `<html>` 根元素                                                 |
      | `.setAttribute('data-theme', theme)`    | 给 `<html>` 添加/更新一个属性，比如 `data-theme="dark"` 或 `data-theme="light"` |

    实际效果：
      当 theme 从 "light" 变成 "dark" 时，DOM 会变成： <html data-theme="dark">

  * */

  // 切换主题时同步到 document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="container">
      {/* 主题切换按钮 */}
      <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* 英雄区 */}
      <header style={{ textAlign: 'center', padding: '3rem 0' }}>
        <img
          className="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
          alt="React Logo"
        />
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', color: 'var(--accent)' }}>
          Hello React!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          欢迎来到 React 从零到精通教程 —— 第一章
        </p>
      </header>

      {/* 核心概念卡片 */}
      <section className="grid-2">
        <ConceptCard
          title="🧩 JSX 语法"
          desc="JSX 是 JavaScript 的语法扩展，让我们在 JS 中编写类似 HTML 的结构。"
          code={`<h1>Hello React</h1>
<div className="app">
  <p>JSX 不是模板引擎！</p>
</div>`}
        />
        <ConceptCard
          title="⚛️ 组件"
          desc="组件是 React 的核心。一个组件就是一个独立的 UI 单元，可复用、可组合。"
          code={`function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}`}
        />
        <ConceptCard
          title="🌳 虚拟 DOM"
          desc="React 通过虚拟 DOM 高效计算 UI 变更，只更新真正改变的部分。"
          code={`// React 自动处理差异更新
// 你只需描述 UI 应该长什么样
return <div>{count}</div>;`}
        />
        <ConceptCard
          title="🔧 Vite 构建"
          desc="Vite 是下一代前端构建工具，提供极速的 HMR（热模块替换）体验。"
          code={`npm create vite@latest
// 选择 React + JavaScript/TypeScript
npm install && npm run dev`}
        />
      </section>

      {/* JSX 规则说明 */}
      <section className="card" style={{ marginTop: '2rem' }}>
        <h2>📋 JSX 必知规则</h2>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
          <li>必须有一个根元素包裹（或使用 Fragment <>{}</>）</li>
          <li>标签必须闭合：{`<img />`} 或 {`<br />`}</li>
          <li>class 改为 className，for 改为 htmlFor</li>
          <li>内联样式使用对象：style={'{{'} color: 'red' {'}}'}</li>
          <li>JS 表达式用 {'{}'} 包裹</li>
        </ul>
      </section>

      {/* 本章目标达成检查 */}
      <section className="card" style={{ marginTop: '2rem' }}>
        <h2>✅ 本章目标检查清单</h2>
        <CheckList items={[
          '成功运行第一个 React 项目',
          '理解 JSX 与普通 HTML 的区别',
          '能够编写简单的函数组件',
          '了解 React 18 createRoot 的作用',
        ]} />
      </section>

      {/* 总结与延伸阅读 */}
      <footer className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h3>📝 总结</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          本章我们搭建了 React 开发环境，学习了 JSX 语法和组件的基本概念。
          下一章将深入探索组件的 Props 和组合模式。
        </p>
      </footer>
    </div>
  );
}

// ============================================
// 子组件：概念卡片
// ============================================
function ConceptCard({ title, desc, code }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="card">
      <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{desc}</p>
      <button
        className="btn"
        onClick={() => setShowCode(!showCode)}
        style={{ fontSize: '0.85rem' }}
      >
        {showCode ? '隐藏代码' : '查看代码'}
      </button>
      {showCode && (
        <pre className="code-block" style={{ marginTop: '1rem' }}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

// ============================================
// 子组件：检查清单
// ============================================
function CheckList({ items }) {
  const [checked, setChecked] = useState(new Array(items.length).fill(false));

  const toggle = (index) => {
    const next = [...checked];
    next[index] = !next[index];
    setChecked(next);
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
      {items.map((item, i) => (
        <li
          key={i}
          onClick={() => toggle(i)}
          style={{
            padding: '0.5rem 0',
            cursor: 'pointer',
            textDecoration: checked[i] ? 'line-through' : 'none',
            opacity: checked[i] ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          {checked[i] ? '✅' : '⬜'} {item}
        </li>
      ))}
    </ul>
  );
}

export default App;
