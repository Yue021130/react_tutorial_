import { Navigate } from 'react-router-dom';

// ============================================
// ProtectedRoute: 路由守卫组件
//
// 作用：检查用户是否登录，未登录则重定向到登录页
//
// 判断逻辑：
//   从 localStorage 读取 isLoggedIn 标记
//   实际项目中通常会从 Context、Redux 或后端接口判断
// ============================================

function ProtectedRoute({ children }) {
  /*
  有登录则走 children 的 prop  没有登录则退回到<Navigate to="/login" replace />
  */
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    // replace 表示替换当前历史记录，避免用户点击后退回到被拦截的页面
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
