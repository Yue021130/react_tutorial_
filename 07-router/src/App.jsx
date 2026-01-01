import { useState, useEffect } from 'react';
import {
  Routes, Route, NavLink, useParams, useNavigate,
  Navigate, Outlet
} from 'react-router-dom';

// ============================================
// 07-router: React Router 深入
// App: 应用入口
//
// 本章核心：
//   1. BrowserRouter：使用 HTML5 history API，让 URL 变化不刷新页面
//   2. Routes / Route：声明式路由配置
//   3. NavLink：带激活状态的导航链接
//   4. useParams：读取 URL 动态参数
//   5. useNavigate：编程式跳转
//   6. Navigate：重定向（常用于路由守卫）
//   7. Outlet：嵌套路由的渲染出口
//
// 注意：BrowserRouter 在 main.jsx 中包裹了 <App />，
//       所以 App 内部才能使用 React Router 的所有 API。
// ============================================

// 模拟（mock）数据
const POSTS = [
  { id: 1, title: 'React 19 新特性', category: 'react', author: 'Alice' },
  { id: 2, title: 'TypeScript 高级类型', category: 'typescript', author: 'Bob' },
  { id: 3, title: 'Vite 构建优化', category: 'tooling', author: 'Carol' },
];

function App() {
  // 💫2.useState保证更新后重新渲染（执行）这个APP组件
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 💫3.theme数据更新->渲染结束后执行下面的函数，设置documentElement的data-theme属性为theme
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="container">
      {/* 💫1.setTheme触发theme状态更新 */}
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>07 React Router</h1>
        <p style={{ color: 'var(--muted)' }}>路由配置 · 嵌套路由 · 动态路由 · 路由守卫</p>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* 更改这个setIsLoggedIn，对应触发这个APP的重新渲染。 */}
        <button className="btn" onClick={() => setIsLoggedIn(v => !v)}>
          {isLoggedIn ? '退出登录' : '模拟登录'}
        </button>
        <span style={{ alignSelf: 'center', color: 'var(--muted)' }}>
          状态: {isLoggedIn ? '🟢 已登录' : '🔴 未登录'}
        </span>
      </div>

      {/* 导航栏 */}
      {/* NavLink 比 Link 多一个 active 状态，当前匹配的路由会自动加上 active 类名 */}
      {/* 这个NavLink要在nav里面才能使用 */}
      <nav>
        <NavLink to="/" end>首页</NavLink>
        <NavLink to="/posts">文章列表</NavLink>
        <NavLink to="/about">关于</NavLink>
        <NavLink to="/dashboard">仪表盘</NavLink>
      </nav>

      {/* 路由配置：Routes 会按顺序匹配第一个符合条件的 Route */}
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<Home />} />

        {/* 关于页 */}
        <Route path="/about" element={<About />} />

        {/* 文章页：嵌套路由 */}
        {/* /posts        → 渲染 PostLayout + PostList（index 路由） */}
        {/* /posts/:id    → 渲染 PostLayout + PostDetail */}
        <Route path="/posts" element={<PostLayout />}>
          <Route index element={<PostList />} />
          <Route path=":id" element={<PostDetail />} />
        </Route>

        {/* 仪表盘：路由守卫演示 */}
        {/* 如果未登录，重定向到首页；如果已登录，渲染 Dashboard */}
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
        />

        {/* 404 兜底路由 */}
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
//
// PostLayout 是父路由 /posts 的组件，
// 它里面的 <Outlet /> 就是子路由（/posts 或 /posts/:id）渲染的位置。
// ============================================
function PostLayout() {
  return (
    <div className="card">
      <h2>📝 文章</h2>
      {/* Outlet：嵌套路由的出口，子路由组件会渲染在这里 */}
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
  // useParams() 返回 URL 中的动态参数
  // 路由 path=":id"，所以 params.id 就是 URL 中的 id
  const { id } = useParams();

  // useNavigate() 返回一个函数，用于编程式跳转
  const navigate = useNavigate();

  // 根据 id 查找文章
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
// 仪表盘（路由守卫 + 子路由演示）
//
// /dashboard           → Dashboard + index 子路由内容
// /dashboard/profile   → Dashboard + profile 子路由内容
// /dashboard/settings  → Dashboard + settings 子路由内容
//
// 路由守卫在 App 的 Routes 里实现：
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
        {/* Dashboard 内部也有自己的 Routes，实现子路由 */}
        <Routes>
          <Route index element={<div>选择一个子页面...</div>} />
          <Route path="profile" element={<div>👤 个人资料内容</div>} />
          <Route path="settings" element={<div>⚙️ 设置内容</div>} />
        </Routes>
      </div>
    </div>
  );
}
// 未登录时，<Navigate to="/" replace /> 重定向到首页
// ============================================

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
