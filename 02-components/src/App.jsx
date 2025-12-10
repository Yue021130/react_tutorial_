import {useEffect, useState} from 'react';

// ============================================
// 02-components: 组件系统深度探索
// ============================================

const USERS = [
  { id: 1, name: 'Alice', role: 'admin', status: 'active', tags: ['React', 'Node'] },
  { id: 2, name: 'Bob', role: 'editor', status: 'inactive', tags: ['Vue'] },
  { id: 3, name: 'Carol', role: 'user', status: 'active', tags: ['Design', 'React'] },
  { id: 4, name: 'David', role: 'admin', status: 'active', tags: ['Go', 'Rust'] },
  { id: 5, name: 'Eve', role: 'user', status: 'inactive', tags: ['Python'] },
];

export default function App() {
  const [theme, setTheme] = useState('light');
  const [filter, setFilter] = useState('all'); // all | active | admin

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);  // theme 变化时渲染


  // 保留status是active 和 role是admin 的
  const filteredUsers = USERS.filter((u) => {
    if (filter === 'active') return u.status === 'active';
    if (filter === 'admin') return u.role === 'admin';
    return true;
  });

  return (
    <div className="container">
      <button className="toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>02 组件系统</h1>
        <p style={{ color: 'var(--muted)' }}>Props · 条件渲染 · 列表渲染 · 组件组合</p>
      </header>

      {/* 条件渲染演示区 */}
      <section className="card">
        <h2>🔄 条件渲染</h2>
        <ConditionDemo />
      </section>

      {/* 筛选 + 列表渲染 */}
      <section className="card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>

          {['all', 'active', 'admin'].map((f) => (
            <button
              key={f}
              className="btn"
              style={{
                opacity: filter === f ? 1 : 0.6,
                transform: filter === f ? 'scale(1.05)' : 'none',
              }}
              onClick={() => setFilter(f)}
            >

              {/*
                1. 当前写法：箭头函数返回一个新函数
            onClick={() => setFilter(f)}
            | 不会无限渲染。
            | 每次渲染虽然会创建一个新的箭头函数，但它不会立即执行，只是作为回调存起来，等用户点击时才触发。

                2. ❌ 危险写法：立即执行（带括号）
            onClick={setFilter(f)}   // 注意这里有括号！
            | 会导致无限渲染。
            | 渲染时直接执行了 setFilter(f) → 状态变了 → 组件重新渲染 → 又执行 setFilter(f) → 无限循环。
             */}


              {/*
              3. ⚠️ 传函数引用本身（不带参数时可用）
              onClick={setFilter}   // 没有括号，也没有箭头

          不会无限渲染，但会把点击事件对象 e 当作参数传给 setFilter：
          setFilter(合成事件对象)  // 不是 'all'/'active'/'admin'，逻辑会崩    ( 上层会传入一个入参：点击事件对象 e

              */}

              {/*
              Q:  为什么会无限渲染？？？setFilter的本质是什么？？
              A： 因为 setFilter 的本质是 React 的"状态触发器"——你调用它一次，React 就会安排一次组件重新渲染。

             ===> setFilter 的本质
            它是 useState 返回的 dispatch 函数（调度函数），内部逻辑大概是
            function setFilter(newValue) {
            // 1. 把新值存进 React 内部的状态树
            state = newValue;
            // 2. 标记这个组件"脏了"，需要重新渲染
            scheduleReRender(Component);

           核心特性：调用它 → 组件重新执行（re-render）
           ----------------------------------------------------------------------

            // ❌ 错误：渲染时立即执行
            React.createElement('button', {
              onClick: setFilter(f)   // 渲染到这里，setFilter 立即执行
            });

            // ✅ 正确：渲染时只创建函数，点击时才执行
            React.createElement('button', {
              onClick: () => setFilter(f)   // 渲染时只创建函数，不执行
            });

              核心区别：
                  setFilter(f) → 表达式，求值结果就是调用函数的返回值
                  () => setFilter(f) → 函数对象，求值结果是一个"待执行的函数"

              一句话:
                React.createElement 的第二个参数（props）  在渲染阶段就会被求值  。
                如果 onClick 的值是 setFilter(f)，那渲染时就会触发状态更新；
                如果是 () => setFilter(f)，那渲染时只是创建了一个函数，安全过关。




              */}


              {/*
              它的工作流程分为三个阶段
1️⃣ 触发（Trigger）
调用  setState()  或类似的状态更新函数，告知 React："数据变了，需要刷新界面。"
2️⃣ 渲染（Render）— 即你说的"组件重新执行"
React 重新调用你的组件函数，生成一份新的虚拟 DOM 树。这一步只是纯计算——在内存里对比新旧两棵树的差异，不碰真实 DOM 。
3️⃣ 提交（Commit）
React 把上一步算出的最小变更集合，应用到真实的浏览器 DOM 上。只有这一步用户才能在屏幕上看到变化。
              */}


              {f === 'all' ? '全部' : f === 'active' ? '仅在线' : '仅管理员'}

            </button>
          ))}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty">暂无匹配用户</div>
        ) : (
          <div className="grid">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </section>

      {/* 组件组合 */}
      <section className="card">
        <h2>🧩 组件组合</h2>

        {/* 传递组件 或者 HTML元素 ， 类似于插槽。 */}

        <Card>

          <CardHeader title="可复用卡片" subtitle="通过 children 实现灵活内容" />

          <CardBody>
            <p>这是通过 <code>children</code> 传递的内容。父组件不需要知道子组件内部实现。</p>
          </CardBody>

          <CardFooter>
            <button className="btn">确认</button>
          </CardFooter>

        </Card>
      </section>

      {/* 本章总结 */}
      <footer className="card" style={{ textAlign: 'center' }}>
        <h3>📝 总结</h3>
        <p style={{ color: 'var(--muted)' }}>
          掌握了 Props 单向数据流、条件渲染的多种写法、列表渲染的 key 原则，
          以及通过 children 实现组件组合。
        </p>
      </footer>
    </div>
  );
}

// ============================================
// 条件渲染演示组件
// ============================================
function ConditionDemo() {
  const [mode, setMode] = useState('ternary');   // early | ternary
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderContent = () => {
    if (mode === 'early') {
      // 提前返回模式
      if (!isLoggedIn) return <p>🔒 请先登录（提前 return 模式）</p>;
      return <p>🔓 欢迎回来，管理员！（提前 return 模式）</p>;
    }
    if (mode === 'ternary') {
      // 三元表达式
      return isLoggedIn
        ? <p>🔓 欢迎回来！（三元表达式模式）</p>
        : <p>🔒 请先登录（三元表达式模式）</p>;
    }
    // && 短路模式
    return (
      <>
        {!isLoggedIn && <p>🔒 游客模式（&& 短路模式）</p>}
        {isLoggedIn && <p>🔓 已登录（&& 短路模式）</p>}
      </>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { key: 'ternary', label: '三元表达式' },
          { key: 'early', label: '提前返回' },
          { key: 'short', label: '&& 短路' },
        ].map((m) => (
          <button
            key={m.key}
            className="btn"
            style={{ opacity: mode === m.key ? 1 : 0.5 }}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      {renderContent()}
      <button
        className="btn"
        style={{ marginTop: '0.5rem', background: 'var(--success)' }}
        onClick={() => setIsLoggedIn((v) => !v)}
      >
        {isLoggedIn ? '退出登录' : '点击登录'}
      </button>
    </div>
  );
}

// ============================================
// UserCard：展示 Props 解构与使用
// ============================================
function UserCard({ user }) {
  const { name, role, status, tags } = user;

  return (
    <div className="card" style={{ borderLeft: `4px solid ${status === 'active' ? 'var(--success)' : 'var(--danger)'}` }}>
      <h4>{name} {role === 'admin' && <span title="管理员">👑</span>}</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
        角色: {role} · 状态: {status === 'active' ? '🟢 在线' : '🔴 离线'}
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        {tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 组合模式组件
// ============================================

/*  以下两种写法都可以！
  前者加了个大括号，相当于自动解包。
*/

// function Card({ children }) {
//   return <div className="card">{children}</div>;
// }

function Card(prop) {
  return <div className="card">{prop.children}</div>;
}

function CardHeader({ title, subtitle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
      <h3>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{subtitle}</p>
    </div>
  );
}

function CardBody({ children }) {
  return <div style={{ marginBottom: '0.75rem' }}>{children}</div>;
}

function CardFooter({ children }) {
  return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>{children}</div>;
}
