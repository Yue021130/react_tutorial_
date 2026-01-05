import { useState, useEffect } from 'react';

// ============================================
// 11-testing: 测试体系
// 学习目标：
//   1. React Testing Library 基本用法
//   2. 单元测试与集成测试
//   3. 测试最佳实践
// 预计学习时间：90 分钟
// ============================================

export default function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>11 测试体系</h1>
        <p style={{ color: 'var(--muted)' }}>Jest · React Testing Library · Vitest</p>
      </header>

      <section className="card">
        <h2>🧪 测试示例组件</h2>
        <Counter />
      </section>

      <section className="card">
        <h2>📝 测试代码示例</h2>
        <div className="code">{`// Counter.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('计数器递增', () => {
  render(<Counter />);
  const btn = screen.getByText('+');
  fireEvent.click(btn);
  expect(screen.getByText('1')).toBeInTheDocument();
});

test('计数器递减', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('-'));
  expect(screen.getByText('1')).toBeInTheDocument();
});`}</div>
      </section>

      <section className="card">
        <h2>✅ 测试原则</h2>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--muted)' }}>
          <li>测试用户行为，而非实现细节</li>
          <li>优先查询语义化元素（role, label, text）</li>
          <li>避免测试第三方库的内部实现</li>
          <li>一个测试验证一个概念</li>
        </ul>
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <a href="../12-patterns" className="btn">下一章：设计模式 →</a>
      </footer>
    </div>
  );
}

// 被测试的组件
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
      <button className="btn" onClick={() => setCount(c => c - 1)}>-</button>
      <span data-testid="count" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{count}</span>
      <button className="btn" onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
