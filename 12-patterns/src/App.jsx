import { useState, useEffect, createContext, useContext } from 'react';

// ============================================
// 12-patterns: React 设计模式
// 学习目标：
//   1. HOC (高阶组件)
//   2. Render Props
//   3. Compound Components
//   4. Container/Presentational 模式
// 预计学习时间：75 分钟
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
        <h1 style={{ color: 'var(--accent)' }}>12 设计模式</h1>
        <p style={{ color: 'var(--muted)' }}>HOC · Render Props · Compound Components</p>
      </header>

      <section className="card">
        <h2>🏗️ HOC 高阶组件</h2>
        <WithLoadingExample />
      </section>

      <section className="card">
        <h2>🎨 Render Props</h2>
        <MouseTracker />
      </section>

      <section className="card">
        <h2>🔗 Compound Components</h2>
        <TabsExample />
      </section>

      <section className="card">
        <h2>📦 Container/Presentational</h2>
        <UserContainer />
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <a href="../13-realworld-project" className="btn">下一章：实战项目 →</a>
      </footer>
    </div>
  );
}

// ============================================
// HOC 模式
// ============================================
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>加载中...</div>;
    return <WrappedComponent {...props} />;
  };
}

function UserInfo({ name, role }) {
  return (
    <div>
      <p><strong>{name}</strong></p>
      <p style={{ color: 'var(--muted)' }}>{role}</p>
    </div>
  );
}

const UserInfoWithLoading = withLoading(UserInfo);

function WithLoadingExample() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);
  return (
    <div>
      <UserInfoWithLoading isLoading={loading} name="Alice" role="Frontend Engineer" />
      <button className="btn" style={{ marginTop: '0.5rem' }} onClick={() => setLoading(!loading)}>切换加载状态</button>
    </div>
  );
}

// ============================================
// Render Props 模式
// ============================================
function MouseTracker() {
  return (
    <MouseProvider render={({ x, y }) => (
      <div>
        <p>鼠标位置: X={x}, Y={y}</p>
        <div style={{ width: '100%', height: 120, background: 'var(--bg)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: x % 300, top: y % 100, width: 20, height: 20, background: 'var(--accent)', borderRadius: '50%', transition: '0.1s' }} />
        </div>
      </div>
    )} />
  );
}

function MouseProvider({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return render(pos);
}

// ============================================
// Compound Components 模式
// ============================================
const TabsContext = createContext(null);

function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>{children}</div>;
};

Tabs.Tab = function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActiveIndex(index)}
      style={{
        padding: '0.5rem 1rem',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        borderBottom: `2px solid ${activeIndex === index ? 'var(--accent)' : 'transparent'}`,
        color: activeIndex === index ? 'var(--accent)' : 'var(--muted)',
        fontWeight: activeIndex === index ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ index, children }) {
  const { activeIndex } = useContext(TabsContext);
  if (activeIndex !== index) return null;
  return <div>{children}</div>;
};

function TabsExample() {
  return (
    <Tabs defaultIndex={0}>
      <Tabs.List>
        <Tabs.Tab index={0}>首页</Tabs.Tab>
        <Tabs.Tab index={1}>设置</Tabs.Tab>
        <Tabs.Tab index={2}>关于</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel index={0}>🏠 首页内容</Tabs.Panel>
      <Tabs.Panel index={1}>⚙️ 设置内容</Tabs.Panel>
      <Tabs.Panel index={2}>📖 关于内容</Tabs.Panel>
    </Tabs>
  );
}

// ============================================
// Container/Presentational 模式
// ============================================
function UserContainer() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUser({ id: 1, name: 'Alice', bio: 'Frontend Engineer', avatar: '👩‍💻' });
      setLoading(false);
    }, 1000);
  }, []);

  return <UserPresentational user={user} loading={loading} onRefresh={() => setLoading(true)} />;
}

function UserPresentational({ user, loading, onRefresh }) {
  if (loading) return <div style={{ color: 'var(--muted)' }}>加载用户数据...</div>;
  if (!user) return <div>用户不存在</div>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span style={{ fontSize: '2rem' }}>{user.avatar}</span>
      <div>
        <p><strong>{user.name}</strong></p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{user.bio}</p>
      </div>
      <button className="btn" style={{ marginLeft: 'auto' }} onClick={onRefresh}>刷新</button>
    </div>
  );
}
