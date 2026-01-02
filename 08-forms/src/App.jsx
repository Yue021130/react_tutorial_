import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// ============================================
// 08-forms: 表单处理与验证
// ============================================

export default function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>08 表单处理</h1>
        <p style={{ color: 'var(--muted)' }}>表单验证 · React Hook Form</p>
      </header>

      <section className="card">
        <h2>📝 原生表单验证</h2>
        <NativeForm />
      </section>

      <section className="card">
        <h2>🎣 React Hook Form</h2>
        <HookForm />
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <a href="../09-state-management" className="btn">下一章：状态管理 →</a>
      </footer>
    </div>
  );
}

// ============================================
// 原生表单验证
// ============================================
function NativeForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (form.username.length < 3) errs.username = '用户名至少 3 个字符';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = '请输入有效的邮箱';
    if (form.password.length < 6) errs.password = '密码至少 6 位';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>用户名</label>
      <input
        value={form.username}
        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
        placeholder="至少 3 个字符"
      />
      {errors.username && <div className="error">{errors.username}</div>}

      <label>邮箱</label>
      <input
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        placeholder="example@email.com"
      />
      {errors.email && <div className="error">{errors.email}</div>}

      <label>密码</label>
      <input
        type="password"
        value={form.password}
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        placeholder="至少 6 位"
      />
      {errors.password && <div className="error">{errors.password}</div>}

      <button className="btn" type="submit">提交</button>
      {submitted && <p style={{ color: 'var(--success)', marginTop: '0.5rem' }}>✅ 验证通过！</p>}
    </form>
  );
}

// ============================================
// React Hook Form
// ============================================
function HookForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    alert('提交成功!\n' + JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>用户名</label>
      <input
        {...register('username', { required: '用户名必填', minLength: { value: 3, message: '至少 3 个字符' } })}
        placeholder="至少 3 个字符"
      />
      {errors.username && <div className="error">{errors.username.message}</div>}

      <label>邮箱</label>
      <input
        {...register('email', {
          required: '邮箱必填',
          pattern: { value: /\S+@\S+\.\S+/, message: '邮箱格式不正确' }
        })}
        placeholder="example@email.com"
      />
      {errors.email && <div className="error">{errors.email.message}</div>}

      <label>密码</label>
      <input
        type="password"
        {...register('password', { required: '密码必填', minLength: { value: 6, message: '至少 6 位' } })}
        placeholder="至少 6 位"
      />
      {errors.password && <div className="error">{errors.password.message}</div>}

      <label>角色</label>
      <select {...register('role', { required: '请选择角色' })}>
        <option value="">请选择</option>
        <option value="admin">管理员</option>
        <option value="editor">编辑</option>
        <option value="user">用户</option>
      </select>
      {errors.role && <div className="error">{errors.role.message}</div>}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn" type="submit">提交</button>
        <button className="btn" type="button" style={{ background: 'var(--muted)' }} onClick={() => reset()}>
          重置
        </button>
      </div>
    </form>
  );
}
