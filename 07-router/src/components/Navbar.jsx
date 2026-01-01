import { NavLink } from 'react-router-dom';

// ============================================
// Navbar: 导航栏组件
//
// 使用 NavLink 替代 Link，当前匹配的路由会自动添加 active 类名
// 方便用 CSS 高亮当前选中的导航项
// ============================================

function Navbar() {
  // NavLink 的 className 可以接收一个函数，isActive 表示当前是否匹配
  // React Router 会在每次路由变化时自动调用这个函数 注意：这里是函数！！
  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (

    // 这个 NavLink 要在 nav 标签里面使用！！！！！！！

    <nav style={{ marginBottom: '1rem' }}>
      {/*
      end 表示精确匹配
        没有 end：只要 URL 以 / 开头（所有页面都满足），isActive 就为 true → 首页永远高亮
        有 end：只有 URL 完全等于 / 时，isActive 才为 true
      */}

      {/*  to路径匹配路由页的path  */}
      <NavLink to="/" className={linkClass} end>首页</NavLink>

      <NavLink to="/products" className={linkClass}>商品</NavLink>
      <NavLink to="/dashboard" className={linkClass}>仪表盘</NavLink>
      <NavLink to="/about" className={linkClass}>关于</NavLink>
    </nav>
  );
}

export default Navbar;
