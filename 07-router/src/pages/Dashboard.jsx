import { useNavigate } from 'react-router-dom';

// ============================================
// Dashboard: 仪表盘（受保护页面）
//
// 只有通过 ProtectedRoute 登录后才能访问
// ============================================

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="card">
      <h2>🔐 仪表盘</h2>
      <p>恭喜！你已经登录，看到了这个受保护的页面。</p>
      <button className="btn" style={{ marginTop: '1rem', background: 'var(--danger)' }} onClick={handleLogout}>
        退出登录
      </button>
    </div>
  );
}

export default Dashboard;
