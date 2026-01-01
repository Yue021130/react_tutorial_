import { RouterProvider } from 'react-router-dom';
import router from './router';

// ============================================
// AppModern: 现代路由写法演示
//
// 使用 createBrowserRouter + RouterProvider
// 路由表集中在 src/router/index.jsx 中管理
//
// 如果想运行这个版本，把 main.jsx 里的 <App /> 改成 <AppModern />
// ============================================

function AppModern() {
  return <RouterProvider router={router} />;
}

export default AppModern;
