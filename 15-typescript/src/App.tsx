import { useState, useEffect, type ReactNode } from 'react';

// ============================================
// 15-typescript: React + TypeScript 最佳实践
// 学习目标：
//   1. 组件 Props 类型定义
//   2. 泛型组件
//   3. 常用类型工具
//   4. Hooks 类型
// 预计学习时间：90 分钟
// ============================================

// 基础 Props 类型
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
}

interface CardProps {
  title: string;
  children: ReactNode;
  variant?: 'default' | 'outline';
}

// 泛型列表组件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'editor' },
  ];

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>15 TypeScript</h1>
        <p style={{ color: 'var(--muted)' }}>类型安全 · 泛型组件 · 最佳实践</p>
      </header>

      <section className="card">
        <h2>📝 Props 类型定义</h2>
        <div className="code">{`interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}`}</div>
      </section>

      <section className="card">
        <h2>🧬 泛型组件</h2>
        <List<User>
          items={users}
          keyExtractor={(u) => u.id}
          renderItem={(u) => (
            <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <strong>{u.name}</strong> <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>({u.role})</span>
            </div>
          )}
        />
      </section>

      <section className="card">
        <h2>🔧 常用类型工具</h2>
        <div className="code">{`// 从接口中提取部分属性
type UserPreview = Pick<User, 'id' | 'name'>;

// 将所有属性设为可选
type PartialUser = Partial<User>;

// 组件 Props 类型推导
type ButtonProps = ComponentProps<'button'>;

// 自定义事件类型
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};`}</div>
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <a href="../16-deployment" className="btn">下一章：部署运维 →</a>
      </footer>
    </div>
  );
}

function Card({ title, children, variant = 'default' }: CardProps) {
  return (
    <div className="card" style={variant === 'outline' ? { background: 'transparent' } : {}}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}
