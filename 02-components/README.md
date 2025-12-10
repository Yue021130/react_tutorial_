# 02 组件系统

> **本章目标**：掌握函数组件的编写、Props 传递、条件渲染和列表渲染。

---

## 🧩 组件的本质

React 应用由组件（Component）构建。组件是独立、可复用的 UI 片段。

```jsx
// 函数组件 = 接收 props，返回 JSX
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// 使用组件
<Welcome name="Alice" />
```

## 📦 Props 传递

Props（属性）是父组件向子组件传递数据的方式：

```jsx
// 父组件
function App() {
  return <UserCard name="张三" age={25} isVip />;
}

// 子组件
function UserCard({ name, age, isVip }) {
  return (
    <div className="card">
      <h3>{name} {isVip && '⭐'}</h3>
      <p>年龄: {age}</p>
    </div>
  );
}
```

## 🔄 条件渲染

| 方式 | 适用场景 | 示例 |
|------|---------|------|
| `&&` | 单一条件，不渲染 else | `{isAdmin && <AdminPanel />}` |
| 三元表达式 | 需要 else 分支 | `{isLogin ? <Home /> : <Login />}` |
| 提前返回 | 复杂逻辑，提前退出 | `if (!user) return <Login />` |

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来!</h1>;
  }
  return <h1>请先登录</h1>;
}
```

## 📋 列表渲染

使用 `map()` 将数组转换为元素列表，**必须提供 key**：

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

> ⚠️ **Key 的重要性**：Key 帮助 React 识别哪些元素改变了、添加了或删除了。
> 避免使用数组索引作为 key（除非列表不会重排）。

## 🧠 常见面试题

**Q: 为什么 Props 是只读的？**  
A: React 组件必须像纯函数一样工作，对于相同的输入（Props），始终返回相同的结果。修改 Props 会破坏可预测性。

**Q: key 用 index 有什么风险？**  
A: 当列表重排时，React 会错误地认为元素没有变化，导致状态错乱和渲染问题。

**Q: 组件拆分粒度如何把握？**  
A: 遵循单一职责原则，一个组件只做一件事。当组件超过 200 行或处理多种不相关逻辑时考虑拆分。

---

## 📝 总结

- 函数组件是 React 的主流写法，简洁且支持 Hooks
- Props 是组件间通信的主要方式，单向数据流
- 条件渲染用 `&&`、三元表达式或提前 return
- 列表渲染必须用稳定的 `key`，避免用 index

## 📚 延伸阅读

- [React 官方文档 - 组件](https://react.dev/learn/thinking-in-react)
- [React 官方文档 - Props](https://react.dev/learn/passing-props-to-a-component)
