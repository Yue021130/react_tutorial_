# 06 Context API

> **本章目标**：掌握 Context API 进行跨层级状态共享。

---

## 🌳 Context 基础

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}
```

==所有消费 Context 的组件都会重渲染。==


## ⚡ 性能优化

1. **拆分 Context**：将不相关的状态放入独立的 Context
2. **useMemo 缓存 value**
3. **React.memo 包裹消费组件**

## 🧠 面试题

**Q: Context 会取代 Redux 吗？**  
A: 不会。Context 适合低频更新的全局数据（主题、用户信息），Redux 适合高频更新、复杂逻辑的状态管理。

---

## 📝 总结

- Context 解决 Prop Drilling 问题
- 注意性能：拆分 Context + useMemo + memo
- 不是所有全局状态都需要 Redux

## 📚 延伸阅读

- [React 官方文档 - Context](https://react.dev/learn/passing-data-deeply-with-context)
