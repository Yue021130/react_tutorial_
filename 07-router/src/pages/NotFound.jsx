import { NavLink } from 'react-router-dom';

// ============================================
// NotFound: 404 页面
//
// 当用户访问未定义的路由时显示
// 在路由表中用 path="*" 匹配所有未命中路径
// ============================================

function NotFound() {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2>404</h2>
      <p style={{ color: 'var(--muted)' }}>你访问的页面不存在</p>
      <h1> 克制自己的欲望。😡😡😡 </h1>
      <NavLink to="/" className="btn" style={{ marginTop: '1rem' }}>
        返回首页
      </NavLink>
    </div>
  );
}

export default NotFound;
