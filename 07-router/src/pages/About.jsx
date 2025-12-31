// ============================================
// About: 关于页
// ============================================

function About() {
  return (
    <div className="card">
      <h2>📖 关于</h2>
      <p>这是一个使用 React Router v6 构建的单页应用示例。</p>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>
        使用了 createBrowserRouter、嵌套路由、动态路由、路由守卫等特性。
      </p>
    </div>
  );
}

export default About;
