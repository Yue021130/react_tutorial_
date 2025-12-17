import {useEffect, useState} from 'react';
import GenericFormDemo from './GenericFormDemo.jsx';

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

      {/* 闭包陷阱：函数式更新对比 */}
      <section className="card">
        <h2>💡 闭包陷阱对比</h2>
        <ClosureTrapDemo />
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

      {/* 通用表单处理器 */}
      <section className="card">
        <h2>🧩 通用表单处理器</h2>
        <GenericFormDemo />
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

  /*
  count 是 const 常量（const [count, ...] = useState(...)），直接赋值会报错；
   即使不是 const，这样改 React 也检测不到变化，不会触发重新渲染。必须通过 setCount 通知 React。
   */

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
// ClosureTrapDemo: 闭包陷阱 vs 函数式更新
// ============================================
function ClosureTrapDemo() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  // ❌ 错误：依赖当前 render 的 countA 快照，三次更新基于同一个旧值
  const badAddThree = () => {
    setCountA(countA + 1);
    setCountA(countA + 1);
    setCountA(countA + 1);
  };

  /*

Q:
  我在想，本质是不是，setCountA/B已经内部关联了对应的countA/B，所以传入一个countA实参是没有意义的
A:
  `setCountA` 确实在 React 内部关联了特定的 state 存储位置（fiber 节点上的 hook 链表），但问题不在这里。
核心在于：React 的更新是"异步批处理"的，直接传值会被"快照"困住，而函数会被"排队"执行。

本质：更新队列的行为差异


       直接传值：三次都是同一个旧快照
    setCountA(countA + 1);  // countA 此时是 0
    setCountA(countA + 1);  // countA 此时还是 0（同一渲染闭包）
    setCountA(countA + 1);  // countA 此时还是 0

React 看到的三条指令：
队列: [ set 1, set 1, set 1 ]
因为 `countA + 1` 在传入时就已经求值完毕(!!💫关键!!)，三次都是 `1`。React 批量处理完后，最终 state 就是 1。



      函数式更新：每次基于最新 pending state
  setCountB(c => c + 1);
  setCountB(c => c + 1);
  setCountB(c => c + 1);

React 看到的三条指令：
队列: [ f1, f2, f3 ]
处理时依次执行：
  `f1(0)` → 返回 1
  `f2(1)` → 返回 2
  `f3(2)` → 返回 3
最终 state 是 3。



## 关于你的猜测

你说"传入 `countA` 实参没有意义"——不完全对。

它有意义，但意义是"给 React 下达一个绝对指令：把这个 state 设成这个具体数值"。
React 不会拒绝这个指令，它只会忠实地执行三次"设为 1"。

而 `c => c + 1` 的意义是"给 React 一个计算规则，让它在真正要算的时候，拿最新的值来跑"。



## 一句话总结
> 直接传值是"提前算好答案交上去"（三次交了同一个答案）；
> 函数式更新是"交一个公式上去，React 按最新数据现算"（每次用的都是最新草稿）。

*/




  // ✅ 正确：函数式更新，基于最新 state 累加
  const goodAddThree = () => {
    setCountB(c => c + 1);
    setCountB(c => c + 1);
    setCountB(c => c + 1);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div className="card" style={{ flex: 1, minWidth: '220px', border: '2px solid var(--danger)' }}>
        <h3>❌ 闭包陷阱</h3>
        <p style={{ fontSize: '1.75rem', textAlign: 'center', fontWeight: 'bold' }}>{countA}</p>
        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={badAddThree} style={{ background: 'var(--danger)' }}>
            +3（实际 +1）
          </button>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
          三次 setCountA(countA + 1) 引用的是同一次 render 中的 countA，结果被合并。
        </p>
      </div>

      <div className="card" style={{ flex: 1, minWidth: '220px', border: '2px solid var(--success)' }}>
        <h3>✅ 函数式更新</h3>
        <p style={{ fontSize: '1.75rem', textAlign: 'center', fontWeight: 'bold' }}>{countB}</p>
        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={goodAddThree} style={{ background: 'var(--success)' }}>
            +3（真正 +3）
          </button>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
          三次 setCountB(c =&gt; c + 1) 每次基于最新 state 计算，结果正确累加。
        </p>
      </div>
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
    // 即：e 是 React 的合成事件对象（SyntheticEvent），不是原生 DOM 事件！
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
  /*
  按钮的两种绑定方式

<button onClick={handleClick}>点击我</button>
 ===》   直接传函数引用，无自定义参数。React 会在点击时把事件对象 e 传给它。

<button onClick={() => addLog('箭头函数传参成功！')}>
  箭头函数传参
</button>
 ===》   用箭头函数包裹，因为需要传自定义字符串参数。如果不包，写成 onClick={addLog('...')} 会立即执行导致死循环。  => 记住，传函数指针，或者箭头函数。（箭头函数本身也就是一种函数指针。 | 忘记22年的PythonGUI了吗？
       | 这里死循环是因为， addLog 内部调用了 setLogs，而 setLogs 会触发重新渲染 。
  */
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
        {/*  && 短路：数组为空时显示"暂无事件"  */}
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
  // ① state 是唯一数据源
  const [form, setForm] = useState({   // 状态设计：一个对象管所有字段
    username: '',
    email: '',
    bio: '',
    role: 'user',
    subscribe: false,
  });
  const [submitted, setSubmitted] = useState(false);

  // 通用字段更新函数
  /*

| 部分                   |             作用                                                              |
| --------------------- | ----------------------------------------------------------------------------  |
| `...prev`             | 展开旧对象，保留所有未修改的字段                                                   |
| `[field]: value`      | **计算属性名**：`field` 是变量，比如 `'username'`，最终变成 `{ username: 'Alice' }` |
| `setSubmitted(false)` | 一旦修改任何字段，就把"已提交成功"提示隐藏，防止用户误以为修改后的数据已经提交            |

  */
  const updateField = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));  // 核心写法见分析.md
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止默认表单提交  ===> 原生表单提交会刷新页面，e.preventDefault() 拦住它，改成 React 的异步处理逻辑（比如调 API）。
    setSubmitted(true);
    console.log('提交的数据:', form);
  };

  const isValid = form.username.length >= 2 && form.email.includes('@');

  return (
    <form onSubmit={handleSubmit}>
      <label>用户名 *</label>
      {/*   每个输入元素都是受控的  */}
      <input
        value={form.username}     // ② 用 state 控制显示值
        onChange={e => updateField('username', e.target.value)}     // ③ 用户输入时更新 state
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
      {/*
      disabled={!isValid} 居然是动态的！！！！ 神奇！

    disabled 是 HTML 原生属性，但这里绑定了一个布尔表达式。
  isValid 是实时计算的派生值，每次渲染都会重新判断。用户输入过程中，按钮自动启用/禁用，无需手动操作 DOM。
      */}

      <button className="btn" type="submit" disabled={!isValid}>
        提交表单
      </button>

      {/*
      submitted 为 false 时，整段 JSX 不渲染（false && ... 返回 false，React 忽略）
提交成功后显示，修改任何字段时 updateField 会把 submitted 重置为 false，提示自动消失
      */}
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
