import { createContext, useContext, useState, useMemo } from 'react';

// ============================================
// 06-context: Context API 与状态共享
// 学习目标：
//   1. createContext / useContext 用法
//   2. 状态提升与跨层级传递
//   3. 性能优化（拆分 Context）
// 预计学习时间：60 分钟
// ============================================

// 创建 Theme Context
const ThemeContext = createContext(null);

// 创建 User Context（单独拆分，避免不必要重渲染）
const UserContext = createContext(null);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  // 使用 useMemo 保持引用稳定
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
  const userValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <UserContext.Provider value={userValue}>
        <div className="container">
          <span
            className="toggle-theme"
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </span>

          <header className="card" style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--accent)' }}>06 Context API</h1>
            <p style={{ color: 'var(--muted)' }}>跨组件状态共享 · 避免 Prop Drilling</p>
          </header>

          <section className="card">
            <h2>🌳 组件树结构</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              以下组件树演示了 Context 如何跨越多个层级传递数据，无需逐层传递 props。
            </p>
            <AppLayout />
          </section>

          <section className="card">
            <h2>📊 性能优化策略</h2>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--muted)' }}>
              <li>按主题拆分 Context，避免无关状态变化触发重渲染</li>
              <li>使用 useMemo 缓存 Context value 对象</li>
              <li>对消费组件使用 React.memo</li>
              <li>避免将所有状态放入单一 Context</li>
            </ul>
          </section>

          <footer className="card" style={{ textAlign: 'center' }}>
            <a href="../07-router" className="btn">下一章：React Router →</a>
          </footer>
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// ============================================
// 使用 Context 的组件树
// ============================================
function AppLayout() {
  return (
    <div className="card" style={{ background: 'var(--bg)', borderStyle: 'dashed' }}>
      <strong>🟦 AppLayout</strong>
      <div className="tree-line">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

function Sidebar() {
  const { user } = useContext(UserContext);
  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟩 Sidebar</strong> (使用 UserContext)
      <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
        当前用户: <strong>{user.name}</strong> ({user.role})
      </p>
    </div>
  );
}

function MainContent() {
  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟨 MainContent</strong>
      <div className="tree-line">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);

  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟧 Header</strong> (同时使用 Theme + User Context)
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
          切换主题 (当前: {theme})
        </button>
        <button
          className="btn"
          style={{ background: 'var(--muted)' }}
          onClick={() => setUser(u => ({ ...u, role: u.role === 'admin' ? 'user' : 'admin' }))}
        >
          切换角色
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟥 Dashboard</strong> (使用 UserContext)
      <div className="tree-line">
        <Widget title="用户统计" />
        {user.role === 'admin' && <Widget title="管理员面板" />}
      </div>
    </div>
  );
}

function Widget({ title }) {
  return (
    <div className="card" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
      <strong>📦 {title}</strong>
    </div>
  );
}
