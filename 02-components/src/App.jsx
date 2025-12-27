import { useState, useEffect } from 'react';

// ============================================
// 02-components: 组件系统深度探索
// 学习目标：
//   1. Props 传递与解构
//   2. 条件渲染的多种方式
//   3. 列表渲染与 key 的重要性
//   4. 组件组合模式
// 预计学习时间：45-60 分钟
// ============================================

const USERS = [
  { id: 1, name: 'Alice', role: 'admin', status: 'active', tags: ['React', 'Node'] },
  { id: 2, name: 'Bob', role: 'editor', status: 'inactive', tags: ['Vue'] },
  { id: 3, name: 'Carol', role: 'user', status: 'active', tags: ['Design', 'React'] },
  { id: 4, name: 'David', role: 'admin', status: 'active', tags: ['Go', 'Rust'] },
  { id: 5, name: 'Eve', role: 'user', status: 'inactive', tags: ['Python'] },
];

export default function App() {
  const [theme, setTheme] = useState('light');
  const [filter, setFilter] = useState('all'); // all | active | admin

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const filteredUsers = USERS.filter((u) => {
    if (filter === 'active') return u.status === 'active';
    if (filter === 'admin') return u.role === 'admin';
    return true;
  });

  return (
    <div className="container">
      <button className="toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>02 组件系统</h1>
        <p style={{ color: 'var(--muted)' }}>Props · 条件渲染 · 列表渲染 · 组件组合</p>
      </header>

      {/* 条件渲染演示区 */}
      <section className="card">
        <h2>🔄 条件渲染</h2>
        <ConditionDemo />
      </section>

      {/* 筛选 + 列表渲染 */}
      <section className="card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['all', 'active', 'admin'].map((f) => (
            <button
              key={f}
              className="btn"
              style={{
                opacity: filter === f ? 1 : 0.6,
                transform: filter === f ? 'scale(1.05)' : 'none',
              }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '全部' : f === 'active' ? '仅在线' : '仅管理员'}
            </button>
          ))}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty">暂无匹配用户</div>
        ) : (
          <div className="grid">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </section>

      {/* 组件组合 */}
      <section className="card">
        <h2>🧩 组件组合</h2>
        <Card>
          <CardHeader title="可复用卡片" subtitle="通过 children 实现灵活内容" />
          <CardBody>
            <p>这是通过 <code>children</code> 传递的内容。父组件不需要知道子组件内部实现。</p>
          </CardBody>
          <CardFooter>
            <button className="btn">确认</button>
          </CardFooter>
        </Card>
      </section>

      {/* 本章总结 */}
      <footer className="card" style={{ textAlign: 'center' }}>
        <h3>📝 总结</h3>
        <p style={{ color: 'var(--muted)' }}>
          掌握了 Props 单向数据流、条件渲染的多种写法、列表渲染的 key 原则，
          以及通过 children 实现组件组合。
        </p>
        <a href="../03-state-events" className="btn" style={{ marginTop: '1rem' }}>
          下一章：State 与事件 →
        </a>
      </footer>
    </div>
  );
}

// ============================================
// 条件渲染演示组件
// ============================================
function ConditionDemo() {
  const [mode, setMode] = useState('ternary');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderContent = () => {
    if (mode === 'early') {
      // 提前返回模式
      if (!isLoggedIn) return <p>🔒 请先登录（提前 return 模式）</p>;
      return <p>🔓 欢迎回来，管理员！（提前 return 模式）</p>;
    }
    if (mode === 'ternary') {
      // 三元表达式
      return isLoggedIn
        ? <p>🔓 欢迎回来！（三元表达式模式）</p>
        : <p>🔒 请先登录（三元表达式模式）</p>;
    }
    // && 短路模式
    return (
      <>
        {!isLoggedIn && <p>🔒 游客模式（&& 短路模式）</p>}
        {isLoggedIn && <p>🔓 已登录（&& 短路模式）</p>}
      </>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { key: 'ternary', label: '三元表达式' },
          { key: 'early', label: '提前返回' },
          { key: 'short', label: '&& 短路' },
        ].map((m) => (
          <button
            key={m.key}
            className="btn"
            style={{ opacity: mode === m.key ? 1 : 0.5 }}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      {renderContent()}
      <button
        className="btn"
        style={{ marginTop: '0.5rem', background: 'var(--success)' }}
        onClick={() => setIsLoggedIn((v) => !v)}
      >
        {isLoggedIn ? '退出登录' : '点击登录'}
      </button>
    </div>
  );
}

// ============================================
// UserCard：展示 Props 解构与使用
// ============================================
function UserCard({ user }) {
  const { name, role, status, tags } = user;

  return (
    <div className="card" style={{ borderLeft: `4px solid ${status === 'active' ? 'var(--success)' : 'var(--danger)'}` }}>
      <h4>{name} {role === 'admin' && <span title="管理员">👑</span>}</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
        角色: {role} · 状态: {status === 'active' ? '🟢 在线' : '🔴 离线'}
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        {tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 组合模式组件
// ============================================
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ title, subtitle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
      <h3>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{subtitle}</p>
    </div>
  );
}

function CardBody({ children }) {
  return <div style={{ marginBottom: '0.75rem' }}>{children}</div>;
}

function CardFooter({ children }) {
  return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>{children}</div>;
}
