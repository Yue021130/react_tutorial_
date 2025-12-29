# 04 生命周期

> **本章目标**：深入理解 useEffect 和函数组件生命周期。  
> **预计学习时间**：60-75 分钟

---

## 🔄 useEffect 概览

```jsx
useEffect(effect, dependencies);
```

| 依赖数组 | 执行时机 |
|---------|---------|
| 无 | 每次渲染后 |
| `[]` | 只在组件挂载时 |
| `[a, b]` | 挂载时 + 依赖变化时 |

## 🧹 清理副作用

组件卸载前或依赖变化前，返回的清理函数会被调用：

```jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // 清理
}, []);
```

## 🧠 常见面试题

**Q: useEffect 和 useLayoutEffect 的区别？**  
A: useEffect 在浏览器绘制后异步执行；useLayoutEffect 在绘制前同步执行，可能阻塞渲染。

**Q: 为什么依赖数组里要包含所有用到的变量？**  
A: 遗漏依赖会导致闭包陷阱，使用到旧的 state 值。

---

## 📝 总结

- useEffect 处理副作用：订阅、定时器、请求
- 清理函数防止内存泄漏
- 依赖数组决定执行时机，不要遗漏

## 📚 延伸阅读

- [React 官方文档 - useEffect](https://react.dev/reference/react/useEffect)
