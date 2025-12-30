# Context 使用示例与解析

> 帮你理解 `UserContext`、`ThemeContext` 到底是干什么的。

---

## 一、Context 是干什么的？

Context 是 React 提供的**跨组件共享数据**机制。

### 没有 Context 的痛苦

```jsx
function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    <Layout user={user} setUser={setUser} />  // 传给 Layout
  );
}

function Layout({ user, setUser }) {
  return (
    <div>
      <Sidebar user={user} />                  // 传给 Sidebar
      <Main user={user} setUser={setUser} />   // 传给 Main
    </div>
  );
}

function Main({ user, setUser }) {
  return (
    <div>
      <Header user={user} setUser={setUser} /> // 再传给 Header
      <Dashboard user={user} />                // 再传给 Dashboard
    </div>
  );
}

// Layout 和 Main 其实不需要 user，但不得不传
```

这种现象叫 **Prop Drilling（ prop 钻井）**：数据需要一层一层往下传，中间组件很烦。

### 有了 Context 之后

```jsx
function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />  // 不需要传 user
    </UserContext.Provider>
  );
}

function Header() {
  const { user, setUser } = useContext(UserContext); // 直接读取
  return <div>{user.name}</div>;
}
```

---

## 二、UserContext 示例：用户登录状态

```jsx
import { createContext, useContext, useState } from 'react';

// 1. 创建 Context
const UserContext = createContext(null);

function App() {
  // 2. 定义 state
  const [user, setUser] = useState(null); // null 表示未登录

  const login = (name) => setUser({ name, role: 'user' });
  const logout = () => setUser(null);

  // 3. 用 Provider 包裹
  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      <Header />
      <Main />
    </UserContext.Provider>
  );
}

function Header() {
  // 4. 用 useContext 读取
  const { user, logout } = useContext(UserContext);

  return (
    <header>
      {user ? (
        <span>欢迎, {user.name} <button onClick={logout}>退出</button></span>
      ) : (
        <span>请登录</span>
      )}
    </header>
  );
}

function Main() {
  const { user, login } = useContext(UserContext);

  if (!user) {
    return <button onClick={() => login('Alice')}>登录</button>;
  }

  return <div>主内容区</div>;
}
```

### 这个例子说明什么？

- `App` 保存用户状态
- `Header` 和 `Main` 直接读取，中间不需要任何组件传 props
- `login` / `logout` 也通过 Context 共享，**子组件可以修改全局状态**

---

## 三、ThemeContext 示例：主题切换

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
      <Content />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      当前主题: {theme}
    </button>
  );
}

function Content() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{
      background: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#000' : '#fff',
    }}>
      内容区域
    </div>
  );
}
```

---

## 四、多个 Context 组合使用

```jsx
import { createContext, useContext, useState, useMemo } from 'react';

const UserContext = createContext(null);
const ThemeContext = createContext(null);

function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });
  const [theme, setTheme] = useState('light');

  // 用 useMemo 缓存 value，避免不必要重渲染
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <UserContext.Provider value={userValue}>
      <ThemeContext.Provider value={themeValue}>
        <Header />
        <Sidebar />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <header>
      <span>用户: {user.name}</span>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </header>
  );
}

function Sidebar() {
  const { user } = useContext(UserContext);
  return <aside>{user.role === 'admin' ? '管理员菜单' : '普通菜单'}</aside>;
}
```

### 为什么要拆分多个 Context？

如果只有一个 Context：

```jsx
const AppContext = createContext(null);

// value 同时包含 user 和 theme
<AppContext.Provider value={{ user, theme, setUser, setTheme }}>
```

当 `theme` 变化时，`value` 变成新对象，所有消费 `AppContext` 的组件都会重渲染，包括那些只关心 `user` 的组件。

拆分成 `UserContext` 和 `ThemeContext` 后：

- `theme` 变化 → 只有 `ThemeContext` 消费者重渲染
- `user` 变化 → 只有 `UserContext` 消费者重渲染

---

## 五、Context 使用口诀

```
1. createContext 创建
2. Provider 提供
3. useContext 消费
```

```jsx
// 1. 创建
const MyContext = createContext(null);

// 2. 提供
<MyContext.Provider value={数据}>
  <子组件 />
</MyContext.Provider>

// 3. 消费
const 数据 = useContext(MyContext);
```

---

## 六、常见问题

### Q1: useContext 返回的 setUser 会触发渲染吗？

会。==`setUser` 就是 `App` 组件里 `useState` 的 setter，调用后会触发 `App` 重新渲染==，进而让 `UserContext` 的 value 变化，所有消费 `UserContext` 的组件重新渲染。

### Q2: Context 会替代 Redux / Zustand 吗？

小项目可以替代。大项目状态复杂、更新频繁时，建议用 Redux Toolkit、Zustand、Jotai 等专门的状态管理库。

### Q3: 什么时候该用 Context？

- 主题、语言、用户信息等全局配置
- 需要跨多层组件共享的状态
- 避免 Prop Drilling

---

## 七、一句话总结

> **Context 就是一个“全局传送门”：在 App 顶层用 Provider 放数据，在任意下层组件用 useContext 取数据，不用再一层一层传 props。**
