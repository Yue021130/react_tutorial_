import { useState } from 'react';

// ============================================
// GenericFormDemo: 通用表单处理器演示
//
// 核心思想：
//   1. 用单个对象 state 管理整个表单
//   2. 写一个 updateField(field, value) 统一处理所有字段更新
//   3. 用计算属性名 [field]: value 动态设置对象键
// ============================================

const AVAILABLE_TAGS = ['React', 'Vue', 'Node.js', 'TypeScript', 'Python'];

export default function GenericFormDemo() {
  // ① 一个对象管所有字段
  const [form, setForm] = useState({
    username: '',
    email: '',
    age: '',
    bio: '',
    role: 'user',
    gender: 'male',
    subscribe: false,
    tags: [], // 多选复选框，数组类型
  });

  const [submitted, setSubmitted] = useState(false);

  // ② 通用字段更新函数
  //    field 是字段名字符串，value 是新值
  //    [field] 是 ES6 计算属性名，运行时把变量 field 的值作为键名
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));  // ...prev拿到新数组，然后新的字段顶走旧的
    setSubmitted(false); // 修改任何字段时隐藏“提交成功”提示
  };

  // 数组字段（多选标签）的专用更新
  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)  // 已选中则移除
        : [...prev.tags, tag],               // 未选中则添加
    }));
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('提交的表单数据:', form);
  };

  // ③ 派生校验：每次渲染时自动计算
  const isValid =
    form.username.length >= 2 &&
    form.email.includes('@') &&
    /^(?:[1-9]\d*|)$/.test(form.age);

  return (
    <form onSubmit={handleSubmit}>
      {/* 文本输入 */}
      <FormField label="用户名 *" name="username">
        <input
          value={form.username}
          onChange={e => updateField('username', e.target.value)}
          placeholder="至少 2 个字符"
        />
      </FormField>

      {/* 邮箱输入 */}
      <FormField label="邮箱 *" name="email">
        <input
          type="email"
          value={form.email}
          onChange={e => updateField('email', e.target.value)}
          placeholder="example@email.com"
        />
      </FormField>

      {/* 数字输入 */}
      <FormField label="年龄 *" name="age">
        <input
          type="number"
          value={form.age}
          onChange={e => updateField('age', e.target.value)}
          placeholder="正整数"
          min="1"
        />
      </FormField>

      {/* 多行文本 */}
      <FormField label="简介" name="bio">
        <textarea
          rows={3}
          value={form.bio}
          onChange={e => updateField('bio', e.target.value)}
          placeholder="介绍一下自己..."
        />
      </FormField>

      {/* 下拉选择 */}
      <FormField label="角色" name="role">
        <select
          value={form.role}
          onChange={e => updateField('role', e.target.value)}
        >
          <option value="user">普通用户</option>
          <option value="editor">编辑</option>
          <option value="admin">管理员</option>
        </select>
      </FormField>

      {/* 单选按钮 */}
      <FormField label="性别" name="gender">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === 'male'}
              onChange={e => updateField('gender', e.target.value)}
            />
            男
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === 'female'}
              onChange={e => updateField('gender', e.target.value)}
            />
            女
          </label>
        </div>
      </FormField>

      {/* 单个复选框 */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={form.subscribe}
          onChange={e => updateField('subscribe', e.target.checked)}
        />
        订阅邮件通知
      </label>

      {/* 多选复选框（数组字段） */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>感兴趣的技术</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {AVAILABLE_TAGS.map(tag => (
            <label
              key={tag}     // 帮助react虚拟dom对比
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                padding: '0.3rem 0.6rem',
                borderRadius: '8px',
                background: form.tags.includes(tag) ? 'var(--accent)' : 'var(--bg)',
                color: form.tags.includes(tag) ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              <input
                type="checkbox"
                checked={form.tags.includes(tag)}
                onChange={() => toggleTag(tag)}
                style={{ marginBottom: 0 }}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <button className="btn" type="submit" disabled={!isValid}>
        提交表单
      </button>

      {/* 提交后展示数据 */}
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

// ============================================
// FormField: 可复用的表单字段包装组件
//
// 把 label + input 的布局逻辑抽出来，减少重复代码。
// children 就是具体的 input/textarea/select。
// ============================================
function FormField({ label, name, children }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '0.35rem' }}>
        {/* label标签的for（这里是htmlFor） 对应 input标签的id */}
        {label}
      </label>
      {children}
    </div>
  );
}
