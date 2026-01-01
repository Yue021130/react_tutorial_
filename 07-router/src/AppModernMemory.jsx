import { RouterProvider } from 'react-router-dom';
import { createAppMemoryRouter } from './router';

// ============================================
// AppModernMemory: 现代路由写法的内存路由版本
//
// 使用 createMemoryRouter，不操作浏览器地址栏。
// 适合和旧版 <App /> 同时挂载，避免两个 router 冲突。
// ============================================

function AppModernMemory() {
  const router = createAppMemoryRouter();
  return <RouterProvider router={router} />;
}

export default AppModernMemory;
