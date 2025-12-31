import { createContext, useContext, useState, useMemo } from 'react';

// ============================================
// 06-context: Context API 与状态共享
//
// 本章核心：
//   1. createContext：创建一个 Context 对象
//   2. Provider：在组件树上层提供数据
//   3. useContext：在任意下层组件读取数据
//   4. 拆分 Context + useMemo 缓存 value：避免不必要重渲染
//
// 使用场景：
//   - 主题、用户信息、语言等需要跨层级共享的状态
//   - 😍 避免 Prop Drilling（层层传递 props）
// ============================================

/*
   点击「切换主题」时：

   • theme 变化 → themeValue 变化 → ThemeContext 消费者重渲染
   • user 没变 → userValue 没变 → UserContext 消费者不重渲染

   会重渲染的：

   ```jsx
     Header  // 消费了 ThemeContext
   ```

   不会重渲染的：

   ```jsx
     Sidebar     // 只消费 UserContext
     Dashboard   // 只消费 UserContext
   ```

   ────────────────────────────────────────────────────────────────────────────────

   点击「切换角色」时：

   • user 变化 → userValue 变化 → UserContext 消费者重渲染
   • theme 没变 → themeValue 没变 → ThemeContext 消费者不重渲染

   会重渲染的：

   ```jsx
     Sidebar     // 消费 UserContext
     Header      // 同时消费 UserContext
     Dashboard   // 消费 UserContext
   ```

   不会重渲染的：

   ```jsx
     // 没有只消费 ThemeContext 的组件，但如果有的话也不会渲染
   ```

   ────────────────────────────────────────────────────────────────────────────────

   如果没有 useMemo 会怎样？

   ```jsx
     // ❌ 不推荐：每次渲染都创建新对象
     const themeValue = { theme, setTheme };
     const userValue = { user, setUser };
   ```

   这样即使 theme 没变，每次 App 重新渲染，themeValue 都是新对象，所有消费 ThemeContext 的组件都会被迫重渲染。

   所以 useMemo 在这里的作用是：保持 Context value 引用稳定，避免无关渲染。

*/



// 创建 Theme Context
// createContext(defaultValue)：默认值只在找不到 Provider 时使用
const ThemeContext = createContext(null);

// 创建 User Context（单独拆分，避免无关状态变化触发重渲染）
// 如果把 theme 和 user 放在同一个 Context 里，theme 变化时 user 消费者也会重渲染   | ==》监听消费的会重新渲染
/*
当 theme 变化时：
   1. App 重新渲染
   2. 创建新的 value 对象 { theme: 'dark', user, setTheme, setUser }
   3. 这个新对象和旧对象引用不同
   4. React 认为 AppContext.Provider 的 value 变了
   5.  🤡 所有 useContext(AppContext) 的组件都重新渲染
所以：
   | 即使 Header 只读 user，它也会被迫重渲染，因为它  💫 订阅的是整个 AppContext。
   | 因此这里拆分成两个对象，分别发布订阅。
*/

const UserContext = createContext(null);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });


  // 使用 useMemo 保持 Context value 引用稳定
  //
  // 原因：
  //   Provider 的 value 如果每次渲染都是新对象，所有消费该 Context 的组件都会重新渲染。
  //   useMemo 让 value 只在依赖变化时才变成新对象。
  //  ===> 这两行是为了防止 Context 的 value 对象每次渲染都变，从而避免子组件不必要的重渲染。

  /*
   ```
     function App() {
       const [theme, setTheme] = useState('light');
       const [user, setUser] = useState({ name: 'Alice' });

       return (
         <ThemeContext.Provider value={{ theme, setTheme }}>  // ❌ 每次渲染都是新对象
           <UserContext.Provider value={{ user, setUser }}>   // ❌ 每次渲染都是新对象
             <Header />
             <Sidebar />
           </UserContext.Provider>
         </ThemeContext.Provider>
       );
     }
   ```
   */

  /*
    setTheme / setUser 被调用
             ↓
     App 的 state 变了
             ↓
     App 组件一定重新渲染（这是 😍 改变不了的，状态在 App 里）
             ↓
     App 重新渲染后，子组件按需更新：
             ↓
       • ThemeContext 消费者：只有 themeValue 变了才渲染
       • UserContext 消费者：只有 userValue 变了才渲染
       • 不消费任何 Context 的组件：默认不渲染（除非被 React.memo 等控制）
  */

  // themeValue 只在 theme/setTheme 变化时变化
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  // userValue 只在 user/setUser 变化时变化
  const userValue = useMemo(() => ({ user, setUser }), [user]);

  /*
   ```
     const themeValue = useMemo(
       () => {
         return { theme, setTheme };  // 要缓存的对象
       },
       [theme]  // 只有 theme 变化时，才重新计算
     );
   ```
      |   对象：{}里面。 方法+属性
   • theme 变了 → 返回新对象 → ThemeContext.Provider value 变了 → 消费者重渲染
   • theme 没变 → 返回旧对象 → ThemeContext.Provider value 没变 → 消费者不重渲染
     |    useMemo：缓存这个对象
  */

  return (
    //  💫 核心：ThemeContext.Provider 包裹后，内部所有组件都能读取 theme
    <ThemeContext.Provider value={themeValue}>
      {/* UserContext.Provider 包裹后，内部所有组件都能读取 user */}
      <UserContext.Provider value={userValue}>
        <div className="container">
          <span
            className="toggle-theme"
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </span>

          <header className="card" style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--accent)' }}>06 Context API</h1>
            <p style={{ color: 'var(--muted)' }}>跨组件状态共享 · 避免 Prop Drilling</p>
          </header>

          <section className="card">
            <h2>🌳 组件树结构</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              以下组件树演示了 Context 如何跨越多个层级传递数据，无需逐层传递 props。
            </p>
            <AppLayout />
          </section>

          <section className="card">
            <h2>📊 性能优化策略</h2>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--muted)' }}>
              <li>按主题拆分 Context，避免无关状态变化触发重渲染</li>
              <li>使用 useMemo 缓存 Context value 对象</li>
              <li>对消费组件使用 React.memo</li>
              <li>避免将所有状态放入单一 Context</li>
            </ul>
          </section>

          {/* 独立的 UserContext 基础示例 */}
          <section className="card">
            <h2>👤 UserContext 基础示例</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              这个示例单独演示 Context 如何跨越中间组件传递用户信息。
            </p>
            <UserContextDemo />
          </section>

          <footer className="card" style={{ textAlign: 'center' }}>
            <p>何时葡萄先熟透？</p>
          </footer>
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// ============================================
// 使用 Context 的组件树
//
// 注意：AppLayout、MainContent 等中间组件不需要知道 theme/user
//       数据直接通过 Context 传递到 Sidebar、Header、Dashboard
// ============================================
function AppLayout() {
  return (
    <div className="card" style={{ background: 'var(--bg)', borderStyle: 'dashed' }}>
      <strong>🟦 AppLayout</strong>
      <div className="tree-line">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

function Sidebar() {
  // useContext(UserContext)：读取最近的 UserContext.Provider 提供的 value
  const { user } = useContext(UserContext);  // 读取外层的UserContext   数据跨传

  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟩 Sidebar</strong> (使用 UserContext)
      <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
        当前用户: <strong>{user.name}</strong> ({user.role})
      </p>
    </div>
  );
}

function MainContent() {
  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟨 MainContent</strong>
      <div className="tree-line">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

function Header() {
  // 一个组件可以同时使用多个 Context

  // 😍 setTheme 和 setUser 本质上就是 里 useState 的 setter。 ===》更改会触发重新渲染
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);

  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟧 Header</strong> (同时使用 Theme + User Context)
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
          切换主题 (当前: {theme})
        </button>
        <button
          className="btn"
          style={{ background: 'var(--muted)' }}
          onClick={() => setUser(u => ({ ...u, role: u.role === 'admin' ? 'user' : 'admin' }))}
        >
          切换角色
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <strong>🟥 Dashboard</strong> (使用 UserContext)
      <div className="tree-line">
        <Widget title="用户统计" />
        {/* 根据用户角色条件渲染管理员面板 */}
        {user.role === 'admin' && <Widget title="管理员面板" />}
      </div>
    </div>
  );
}

// Widget 不依赖任何 Context，只接收 props
function Widget({ title }) {
  return (
    <div className="card" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
      <strong>📦 {title}</strong>
    </div>
  );
}

// ============================================
// UserContext 基础示例（独立演示）
//
// 这个示例单独创建一个 UserContextExample，
// 演示 Context 如何跨层级共享用户信息，
// 不需要中间组件传递 props。
// ============================================
const UserContextExample = createContext(null);   // 这个null是初始值

function UserContextDemo() {
  const [user, setUser] = useState({ name: 'Alice', role: 'user' });
  /*
     点击“切换为管理员”后：

   1. setUser 被调用
   2. user 变成 { name: 'Alice', role: 'admin' }
   3. UserContextDemo 重新渲染
   4. Provider 的 value 变成新的对象 { user: { name: 'Alice', role: 'admin' }, setUser }
   5.   😍 所有消费 UserContextExample 的子组件重新渲染，拿到新的 user
  */
  return (
    //  Provider 的 value 是当前提供的值
    //  这个 value 是真正传给子组件的值，子组件用 useContext 读取到的就是它。

    <UserContextExample.Provider value={{ user, setUser }}>
      <div>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Toolbar 是中间组件，不需要 user，但 UserProfile 和 AdminPanel 可以直接读取。
        </p>
        <ToolbarDemo />
        <AdminPanelDemo />
      </div>
    </UserContextExample.Provider>
  );
}

// Toolbar 不需要 user，只是中间层
function ToolbarDemo() {
  return (
    <div className="card" style={{ marginTop: '0.75rem', background: 'var(--bg)' }}>
      <strong>🟦 Toolbar</strong>（不需要 user，只是包裹 UserProfile）
      <UserProfileDemo />
    </div>
  );
}

// UserProfile 需要 user，直接用 useContext 读取
function UserProfileDemo() {
  const { user } = useContext(UserContextExample);  // 承接，接收父层的值。 | 跨组件传递的味道 | 订阅-消费

  return (
    <div className="card" style={{ marginTop: '0.5rem' }}>
      <strong>🟩 UserProfile</strong>（使用 UserContext）
      <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
        当前用户: <strong>{user.name}</strong> · 角色: <strong>{user.role}</strong>
      </p>
    </div>
  );
}

// AdminPanel 需要 user 和 setUser
function AdminPanelDemo() {
  const { user, setUser } = useContext(UserContextExample);  // 居然可以反向写入？！  | 写入更新触发组件渲染

  const toggleRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'admin' ? 'user' : 'admin',
    }));
  };

  return (
    <div className="card" style={{ marginTop: '0.75rem', background: 'var(--bg)' }}>
      <strong>🟥 AdminPanel</strong>（使用 UserContext）
      <p style={{ color: user.role === 'admin' ? 'var(--success)' : 'var(--muted)' }}>
        {user.role === 'admin' ? '✅ 管理员面板可见' : '❌ 普通用户看不到管理员面板'}
      </p>
      <button className="btn" style={{ background: 'var(--muted)' }} onClick={toggleRole}>
        切换为 {user.role === 'admin' ? '普通用户' : '管理员'}
      </button>
    </div>
  );
}
