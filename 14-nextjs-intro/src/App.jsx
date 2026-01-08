import { useState, useEffect } from 'react';

// ============================================
// 14-nextjs-intro: Next.js 入门
// 学习目标：
//   1. App Router 基本概念
//   2. Server Components vs Client Components
//   3. SSR / SSG / ISR 渲染策略
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
        <h1 style={{ color: 'var(--accent)' }}>14 Next.js</h1>
        <p style={{ color: 'var(--muted)' }}>App Router · Server Components · SSR/SSG</p>
      </header>

      <section className="card">
        <h2>📁 App Router 文件约定</h2>
        <div className="card" style={{ background: 'var(--bg)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
app/
├── layout.tsx      # 根布局
├── page.tsx        # 首页 /
├── loading.tsx     # 加载状态
├── error.tsx       # 错误边界
├── not-found.tsx   # 404 页面
├── about/
│   └── page.tsx    # /about
├── blog/
│   ├── page.tsx    # /blog
│   └── [slug]/
│       └── page.tsx # /blog/:slug
        </div>
      </section>

      <section className="card">
        <h2>⚡ 渲染策略对比</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>策略</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>渲染时机</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>SEO</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>首屏速度</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--muted)' }}>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.5rem' }}>CSR (Client Side)</td>
              <td style={{ textAlign: 'center' }}>浏览器</td>
              <td style={{ textAlign: 'center' }}>差</td>
              <td style={{ textAlign: 'center' }}>慢</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.5rem' }}>SSR (Server Side)</td>
              <td style={{ textAlign: 'center' }}>每次请求</td>
              <td style={{ textAlign: 'center' }}>好</td>
              <td style={{ textAlign: 'center' }}>中</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.5rem' }}>SSG (Static)</td>
              <td style={{ textAlign: 'center' }}>构建时</td>
              <td style={{ textAlign: 'center' }}>好</td>
              <td style={{ textAlign: 'center' }}>快</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem' }}>ISR (Incremental)</td>
              <td style={{ textAlign: 'center' }}>按需重新生成</td>
              <td style={{ textAlign: 'center' }}>好</td>
              <td style={{ textAlign: 'center' }}>快</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>🔧 Server Component 示例</h2>
        <div className="card" style={{ background: 'var(--bg)', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre' }}>
{`// app/page.tsx — 默认是 Server Component
async function HomePage() {
  const data = await fetch('https://api.example.com/posts');
  const posts = await data.json();

  return (
    <main>
      <h1>博客列表</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </main>
  );
}`}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          💡 Server Component 中可以直接使用 await，组件在服务端渲染，不发送 JS 到客户端。
        </p>
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <a href="../15-typescript" className="btn">下一章：TypeScript →</a>
      </footer>
    </div>
  );
}
