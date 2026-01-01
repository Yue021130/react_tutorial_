import { useState, useEffect } from 'react';
import {
  Routes, Route, NavLink, useParams, useNavigate,
  Navigate, Outlet
} from 'react-router-dom';

// ============================================
// 07-router: React Router 深入
// 学习目标：
//   1. 路由基本配置
//   2. 嵌套路由与 Outlet
//   3. 动态路由与 useParams
//   4. 路由守卫（条件渲染）
// 预计学习时间：75 分钟
// ============================================

const POSTS = [
  { id: 1, title: 'React 19 新特性', category: 'react', author: 'Alice' },
  { id: 2, title: 'TypeScript 高级类型', category: 'typescript', author: 'Bob' },
  { id: 3, title: 'Vite 构建优化', category: 'tooling', author: 'Carol' },
];

function App() {
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>07 React Router</h1>
        <p style={{ color: 'var(--muted)' }}>路由配置 · 嵌套路由 · 动态路由 · 路由守卫</p>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setIsLoggedIn(v => !v)}>
          {isLoggedIn ? '退出登录' : '模拟登录'}
        </button>
        <span style={{ alignSelf: 'center', color: 'var(--muted)' }}>
          状态: {isLoggedIn ? '🟢 已登录' : '🔴 未登录'}
        </span>
      </div>

      {/* 导航 */}
      <nav>
        <NavLink to="/" end>首页</NavLink>
        <NavLink to="/posts">文章列表</NavLink>
        <NavLink to="/about">关于</NavLink>
        <NavLink to="/dashboard">仪表盘</NavLink>
      </nav>

      {/* 路由配置 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts" element={<PostLayout />}>
          <Route index element={<PostList />} />
          <Route path=":id" element={<PostDetail />} />
        </Route>
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div className="card">
      <h2>🏠 首页</h2>
      <p>欢迎来到 React Router 演示。尝试点击上方导航，体验路由切换。</p>
      <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--muted)' }}>
        <li><code>/</code> - 首页</li>
        <li><code>/posts</code> - 文章列表（嵌套路由）</li>
        <li><code>/posts/:id</code> - 文章详情（动态路由）</li>
        <li><code>/dashboard</code> - 仪表盘（需要登录）</li>
      </ul>
    </div>
  );
}

function About() {
  return (
    <div className="card">
      <h2>📖 关于</h2>
      <p>React Router v7 是 React 生态中最流行的路由解决方案。</p>
      <div className="card" style={{ background: 'var(--bg)', marginTop: '1rem' }}>
        <h4>核心 API</h4>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          <li><code>BrowserRouter</code> - 使用 HTML5 history API</li>
          <li><code>Routes / Route</code> - 声明式路由配置</li>
          <li><code>NavLink</code> - 带激活状态的链接</li>
          <li><code>useParams</code> - 获取 URL 参数</li>
          <li><code>useNavigate</code> - 编程式导航</li>
          <li><code>Outlet</code> - 嵌套路由渲染出口</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// 文章路由（嵌套路由）
// ============================================
function PostLayout() {
  return (
    <div className="card">
      <h2>📝 文章</h2>
      <Outlet />
    </div>
  );
}

function PostList() {
  return (
    <div style={{ marginTop: '1rem' }}>
      {POSTS.map(post => (
        <div key={post.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
          <NavLink to={`/posts/${post.id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            {post.title}
          </NavLink>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
            by {post.author}
          </span>
        </div>
      ))}
    </div>
  );
}

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = POSTS.find(p => p.id === Number(id));

  if (!post) {
    return <div className="card" style={{ color: 'var(--danger)' }}>文章不存在</div>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>{post.title}</h3>
      <p style={{ color: 'var(--muted)' }}>作者: {post.author} · 分类: {post.category}</p>
      <p style={{ marginTop: '1rem' }}>
        这是文章 #{id} 的详细内容。通过 <code>useParams()</code> 获取 URL 参数。
      </p>
      <button className="btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/posts')}>
        ← 返回列表
      </button>
    </div>
  );
}

// ============================================
// 仪表盘（路由守卫演示）
// ============================================
function Dashboard() {
  return (
    <div className="card">
      <h2>🔐 仪表盘</h2>
      <p>只有登录用户才能看到此页面。</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <NavLink to="/dashboard/profile" className="btn" style={{ background: 'var(--muted)' }}>个人资料</NavLink>
        <NavLink to="/dashboard/settings" className="btn" style={{ background: 'var(--muted)' }}>设置</NavLink>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Routes>
          <Route index element={<div>选择一个子页面...</div>} />
          <Route path="profile" element={<div>👤 个人资料内容</div>} />
          <Route path="settings" element={<div>⚙️ 设置内容</div>} />
        </Routes>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2>404</h2>
      <p>页面未找到</p>
      <NavLink to="/" className="btn" style={{ marginTop: '1rem' }}>返回首页</NavLink>
    </div>
  );
}

export default App;
