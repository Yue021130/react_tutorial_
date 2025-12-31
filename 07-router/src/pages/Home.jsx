// ============================================
// Home: 首页
// ============================================

function Home() {
  return (
    <div className="card">
      <h2>🏠 首页</h2>
      <p>欢迎来到 React Router 演示项目。</p>
      <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--muted)' }}>
        <li>点击导航栏的“商品”查看商品列表</li>
        <li>点击商品卡片进入详情页（动态路由）</li>
        <li>点击“仪表盘”体验路由守卫（需先登录）</li>
        <li> 💫 她过得很幸福，何必打扰呢？你总是自作多情，庸人自扰。</li>
      </ul>
    </div>
  );
}

export default Home;
