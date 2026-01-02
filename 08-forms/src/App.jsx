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
        <a href="https://yue021130.github.io/Yue021130" className="btn"> 😡 醉不成欢惨将别，别时茫茫江浸月。 </a>
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
    e.preventDefault();   // 阻止提交行为
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
// React Hook Form    |  react-hook-form 是第三方库
// ============================================
function HookForm() {
  /*
  这段代码是 从 useForm() 的返回值里“解构”出需要的功能，useForm 是 React Hook Form 库提供的一个
  Hook，调用它会返回一个很大的对象，里面装满了表单管理需要的方法和状态。这里只取出了 4 个：

  const {
    register,                              // ① 注册表单字段
    handleSubmit,                          // ② 处理提交
    formState: { errors },                 // ③ 错误信息（嵌套解构）
    reset                                 // ④ 重置表单
  } = useForm();

  */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  /*
   handleSubmit — 提交拦截

  它 接收一个函数 ，只有表单校验通过时才会调用那个函数，并且自动把表单数据传进来：
  const onSubmit = (data) => { ... };   // data = { username, email, password, role }
  <form onSubmit={handleSubmit(onSubmit)}>
  校验不通过时它会拦下提交，什么都不做（错误会显示在 errors 里）。注意这里不需要自己写 e.preventDefault()，它内部处理了。
  */
  /*
    formState 本身是个对象，这里用嵌套解构直接取出里面的 errors：
      {errors.username && <div>{errors.username.message}</div>}

      errors 里每个字段对应一条错误对象，
      .message 就是你在 register里配的错误文案。
        比如用户名没填就显示“用户名必填”，填了但不到 3 个字符就显示“至少 3 个字符”。
  */
  /*
  reset — 清空表单

  一个方法，调用后把所有字段恢复成初始值（清空）：
  reset();                      // 提交成功后清空
  <button onClick={() => reset()}>重置</button>   // 或手动点“重置”
  */
  const onSubmit = (data) => {
    alert('提交成功!\n' + JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>用户名</label>
      {/*
          把一个 input 交给表单库管理，返回一堆 props（name、onChange、ref 等）：
      <input {...register('username', { required: '用户名必填' })} />
      用展开运算符 {...} 把这些 props 直接铺到 input 上，从此这个输入框的值、变化、校验都由 React Hook Form
      接管，不需要自己写 useState + onChange 了。对比上面 NativeForm 里手写的一堆 value / onChange，这就是它的省事之处。
      */}
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
