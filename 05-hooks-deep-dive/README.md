# 05 Hooks 深入

> **本章目标**：掌握 useRef、useMemo、useCallback 和自定义 Hooks。  
> **预计学习时间**：75-90 分钟

---

## 🎯 useRef

用于获取 DOM 引用或保存不触发重渲染的值：

```jsx
const inputRef = useRef(null);
inputRef.current.focus();
```

## ⚡ useMemo

缓存昂贵的计算结果：

```jsx
const result = useMemo(() => expensiveCompute(a, b), [a, b]);
```

## 🔗 useCallback

缓存函数引用，配合 React.memo 优化子组件：

```jsx
const handler = useCallback(() => {}, [deps]);
```

## 🎣 自定义 Hooks

复用组件逻辑：

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key)) ?? initial);
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}
```

## 🧠 面试题

**Q: useMemo 和 useCallback 的区别？**  
A: useMemo 缓存值，useCallback 缓存函数。useCallback(fn, deps) 等价于 useMemo(() => fn, deps)。

---

## 📝 总结

- useRef 用于 DOM 引用和持久化值
- useMemo 避免重复计算
- useCallback 避免子组件不必要的重渲染
- 自定义 Hooks 是逻辑复用的最佳实践

## 📚 延伸阅读

- [React 官方文档 - Hooks API](https://react.dev/reference/react)
