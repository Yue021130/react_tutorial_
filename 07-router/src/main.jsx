import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AppModernMemory from './AppModernMemory';
import './index.css';

// 同时挂载两个 demo：
//   1. App（旧版 Routes/Route 写法）使用 BrowserRouter，操作真实地址栏
//   2. AppModernMemory（新版 createBrowserRouter 写法）使用 MemoryRouter，在内存中路由
// 这样可以在同一个页面看到两种写法，互不干扰。
ReactDOM.createRoot(document.getElementById('root')).render(
  <div style={{ paddingBottom: '3rem' }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>

    <hr style={{ margin: '3rem 1rem', borderColor: 'var(--border)' }} />

    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>
        🆕 现代路由写法演示（createBrowserRouter + MemoryRouter）
      </h2>
      <AppModernMemory />
    </div>
  </div>
);
