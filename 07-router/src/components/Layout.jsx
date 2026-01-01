import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// ============================================
// Layout: 全局布局组件
//
// 作用：
//   1. 渲染顶部导航栏（Navbar）
//   2. 用 <Outlet /> 渲染当前路由匹配的子页面
//   3. 所有页面共享同一套布局和样式
// ============================================

function Layout() {
  return (
    <div className="container">
      <Navbar />

      {/* Outlet 是子路由的渲染出口 */}
      {/*
      类似于占位符，是父布局中预留渲染位置。
      内容来源	：由外部（子路由）填充
      */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
