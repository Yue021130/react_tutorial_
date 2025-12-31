import { useNavigate } from 'react-router-dom';

// ============================================
// Login: 登录页
//
// 模拟登录：点击按钮后在 localStorage 写入登录标记
// 然后跳转到仪表盘
// ============================================

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2>🔑 登录</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        点击按钮模拟登录，然后访问仪表盘。
      </p>
      <button className="btn" onClick={handleLogin}>
        模拟登录
      </button>
    </div>
  );
}

export default Login;
