import { useState, useEffect } from 'react';

// ============================================
// 03-state-events: State 与事件处理
// ============================================

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>03 State 与事件</h1>
        <p style={{ color: 'var(--muted)' }}>useState · 事件处理 · 受控组件</p>
      </header>

      {/* useState 计数器 */}
      <section className="card">
        <h2>🔢 useState 计数器</h2>
        <CounterDemo />
      </section>

      {/* 事件处理 */}
      <section className="card">
        <h2>🖱️ 事件处理</h2>
        <EventDemo />
      </section>

      {/* 受控表单 */}
      <section className="card">
        <h2>📝 受控表单</h2>
        <FormDemo />
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
       <h1>情爱里，无智者</h1>
      </footer>
    </div>
  );
}

// ============================================
// CounterDemo: useState 核心演示
// ============================================
function CounterDemo() {
  const [count, setCount] = useState(0);

  // ⚠️ 错误示例：直接修改 state
  // count = count + 1; // ❌ 不要这样做！

  // ✅ 正确：使用 setter 函数
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <div className="counter" style={{ justifyContent: 'center', width: 'fit-content', margin: '0 auto' }}>
        <button className="btn" onClick={decrement}>-</button>
        <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3ch', textAlign: 'center' }}>
          {count}
        </span>
        <button className="btn" onClick={increment}>+</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button className="btn" onClick={reset} style={{ background: 'var(--muted)' }}>重置</button>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
        💡 提示：使用函数式更新 setCount(c =&gt; c + 1) 可避免闭包陷阱
      </p>
    </div>
  );
}

// ============================================
// EventDemo: 事件处理演示
// ============================================
function EventDemo() {
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [{ id: Date.now(), msg }, ...prev].slice(0, 5));
  };

  const handleClick = (e) => {
    // e 是 React 合成事件对象
    addLog(`点击按钮！类型: ${e.type}, 目标: ${e.target.tagName}`);
  };

  const handleInput = (e) => {
    addLog(`输入: ${e.target.value}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addLog('按下回车键！');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button className="btn" onClick={handleClick}>点击我</button>
        <button className="btn" onClick={() => addLog('箭头函数传参成功！')}>
          箭头函数传参
        </button>
      </div>
      <input
        placeholder="输入内容查看事件..."
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      <div style={{ marginTop: '0.5rem' }}>
        <strong>最近事件日志：</strong>
        {logs.length === 0 && <span style={{ color: 'var(--muted)' }}> 暂无事件</span>}
        <ul style={{ listStyle: 'none', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          {logs.map(log => (
            <li key={log.id} style={{ padding: '0.3rem 0', borderBottom: '1px dashed var(--border)' }}>
              {new Date(log.id).toLocaleTimeString()} — {log.msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================
// FormDemo: 受控组件表单
// ============================================
function FormDemo() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    bio: '',
    role: 'user',
    subscribe: false,
  });
  const [submitted, setSubmitted] = useState(false);

  // 通用字段更新函数
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止默认表单提交
    setSubmitted(true);
    console.log('提交的数据:', form);
  };

  const isValid = form.username.length >= 2 && form.email.includes('@');

  return (
    <form onSubmit={handleSubmit}>
      <label>用户名 *</label>
      <input
        value={form.username}
        onChange={e => updateField('username', e.target.value)}
        placeholder="至少 2 个字符"
      />

      <label>邮箱 *</label>
      <input
        type="email"
        value={form.email}
        onChange={e => updateField('email', e.target.value)}
        placeholder="example@email.com"
      />

      <label>简介</label>
      <textarea
        rows={3}
        value={form.bio}
        onChange={e => updateField('bio', e.target.value)}
        placeholder="介绍一下自己..."
      />

      <label>角色</label>
      <select
        value={form.role}
        onChange={e => updateField('role', e.target.value)}
      >
        <option value="user">普通用户</option>
        <option value="editor">编辑</option>
        <option value="admin">管理员</option>
      </select>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={form.subscribe}
          onChange={e => updateField('subscribe', e.target.checked)}
        />
        订阅邮件通知
      </label>

      <button className="btn" type="submit" disabled={!isValid}>
        提交表单
      </button>

      {submitted && (
        <div className="card" style={{ marginTop: '1rem', background: 'var(--success)', color: '#fff' }}>
          ✅ 提交成功！<br />
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.9 }}>
            {JSON.stringify(form, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}
