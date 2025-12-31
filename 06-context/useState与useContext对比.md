# useState 与 useContext 对比

> 帮你区分 `useState` 和 `useContext` 的关系与区别。

---

## 一、一句话区分

| Hook | 作用 |
|------|------|
| `useState` | **创建状态** |
| `useContext` | **读取远处组件提供的状态** |

---

## 二、useState 单独用

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

- 状态 `count` 属于 `Counter` 组件自己
- 其他组件无法直接读取这个 `count`

---

## 三、useContext 读取别人提供的数据

```jsx
const ThemeContext = createContext(null);

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext); // 读取 App 提供的数据
  return <div>当前主题: {theme}</div>;
}
```

- `Toolbar` 自己不创建 `theme`
- 它从上层 `ThemeContext.Provider` 读取

---

## 四、经典配合：useState + useContext

```jsx
const UserContext = createContext(null);

function App() {
  // 1. useState 创建状态
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    // 2. Provider 把状态传下去
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
      <Sidebar />
    </UserContext.Provider>
  );
}

function Header() {
  // 3. useContext 读取状态
  const { user, setUser } = useContext(UserContext);
  /* 这个 UserContext 来源 App组件的 <UserContext.Provider value={{ user, setUser }}>  
   也即：来源于    const [user, setUser] = useState({ name: 'Alice', role: 'admin' })。 
   那么，setUser修改，触发的是 App组件  。 然后 APP重新渲染。 
   然后    <UserContext.Provider value={{ user, setUser }}> 的user拿到新对象，然后监听消费的组件同步渲染。
   也即：Header也重新渲染。 
   */
  return (
    <div>
      <span>{user.name}</span>
      <button onClick={() => setUser({ ...user, role: 'user' })}>
        降级为普通用户
      </button>
    </div>
  );
}
```

数据流：

```text
useState 创建状态
    ↓
Provider 把状态往下传
    ↓
useContext 在子组件里读取
    ↓
子组件调用 setUser 修改状态
    ↓
App 重新渲染，新的 state 再通过 Provider 传下去
```

---



## 💫 插话

 ● setUser 触发的是 ==App 组件先重新渲染==，然后 Header 作为子组件再重新渲染。

---

   完整流程

   ```jsx
     function App() {
       const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

       return (
         <UserContext.Provider value={{ user, setUser }}>
           <Header />  {/* Header 在这里 */}
         </UserContext.Provider>
       );
     }

     function Header() {
       const { user, setUser } = useContext(UserContext);

       return (
         <button onClick={() => setUser({ ...user, role: 'user' })}>
           降级
         </button>
       );
     }
   ```

   点击按钮后：

   ```text
     1. Header 里的 setUser 被调用
             ↓
     2. setUser 其实是 App 组件里 useState 的 setter
             ↓
     3. App 的 user state 变化
             ↓
     4. React 安排 App 重新渲染（App 是状态拥有者）
             ↓
     5. App 重新渲染，Provider 的 value 变成新对象
             ↓
     6. Header 发现 UserContext 的 value 变了，也重新渲染   ===》 消费context的组件渲染
   ```

---

   谁先谁后？

| 顺序 | 组件   | 原因                                              |
| ---- | ------ | ------------------------------------------------- |
| 第 1 | App    | 状态在 App 里，setUser 触发 App 渲染              |
| 第 2 | Header | ==Header 消费了 UserContext==，value 变了所以渲染 |

   所以：

> App 先渲染，Header 后渲染。

---

   为什么要强调这个？

   因为有些同学会误以为：在 Header 里调用 setUser，所以 Header 先渲染。

   其实不是。==setUser 只是发出了一个“更新请求”，真正拥有状态的组件是 App==，所以 React 从 App 开始重新渲染整棵子树。

---

   一句话总结

>  setUser 触发的是拥有该 state 的组件（App）重新渲染，然后子组件（Header）因为 Context value 变化而跟着渲染。





## 五、对比表

| 对比项 | `useState` | `useContext` |
|--------|-----------|--------------|
| 创建状态 | ✅ 可以 | ❌ 不可以 |
| 读取状态 | ✅ 读自己的 | ✅ 读 Provider 的 |
| 跨组件共享 | ❌ 不能直接共享 | ✅ 可以 |
| 需要 createContext | ❌ 不需要 | ✅ 需要 |
| 需要 Provider | ❌ 不需要 | ✅ 需要 |
| 典型使用场景 | 组件内部状态 | 全局/跨层级状态 |

---

## 六、常见误区

### 误区 1：useContext 能代替 useState

```jsx
// ❌ 错误：useContext 不创建状态
function App() {
  const user = useContext(UserContext); // UserContext 还没有 Provider 提供数据！
  return <div>{user.name}</div>;
}
```

### 误区 2：useContext 读取的是初始值

```jsx
const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState({ name: 'Alice' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Child />
    </UserContext.Provider>
  );
}
```

`Child` 读到的不是 `createContext(null)` 里的 `null`，而是 `Provider` 的 `value`。

### 误区 3：Provider 的 value 是初始值

不是初始值，是**当前值**。state 变化后，Provider 会提供新的 value，子组件会重新渲染。

---

## 七、什么时候用哪个？

| 场景 | 用什么 |
|------|--------|
| 只在当前组件用的状态 | `useState` |
| 需要传给几个子组件 | `useState` + props |
| 需要跨很多层级共享 | `useState` + `createContext` + `useContext` |
| 全局主题、用户、语言 | `useState` + Context |
| 超大规模状态管理 | Redux / Zustand / Jotai |

---

## 八、一句话总结

> `useState` 是“存数据”，`useContext` 是“取远处数据”。它们经常一起用：`useState` 创建状态，`Provider` 传下去，`useContext` 在子组件读取。
