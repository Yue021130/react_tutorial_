import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import About from '../pages/About';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

// ============================================
// 路由配置中心
//
// 使用 createBrowserRouter（React Router v6 现代推荐写法）
// 把所有路由规则集中管理，结构清晰，支持嵌套、动态参数、路由守卫
// ============================================

// 路由配置数组，单独导出以便创建 browser/memory 两种 router
export const routes = [
  {
    path: '/',
    element: <Layout />,        // 全局布局：导航栏 + Outlet
    children: [
      { index: true, element: <Home /> },           // 首页：/
      { path: 'about', element: <About /> },        // 关于：/about
      { path: 'products', element: <Products /> },  // 商品列表：/products
      { path: 'products/:id', element: <ProductDetail /> }, // 商品详情：/products/1
      { path: 'login', element: <Login /> },        // 登录：/login

      // 受保护路由：需要登录才能访问
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // 404 兜底：匹配所有未定义路径
      { path: '*', element: <NotFound /> },
    ],
  },
];

// 默认导出 browser router（独立运行时使用）
const router = createBrowserRouter(routes);

// 好吊诡的设计写法，这个createMemoryRouter是干什么的？？？？？
// 辅助函数：创建内存路由（用于和旧版 demo 同时挂载，避免两个 router 抢地址栏）
/*
- 无URL同步：MemoryRouter不会改变浏览器地址栏
- 刷新丢失：应用刷新后路由状态会重置（因为存储在内存中）
- 历史记录限制：历史记录只在当前组件生命周期内存在
*/
export function createAppMemoryRouter() {
  return createMemoryRouter(routes, { initialEntries: ['/'] });
}

export default router;
