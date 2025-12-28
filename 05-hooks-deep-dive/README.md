# 05 Hooks 深入

> **本章目标**：掌握 useRef、useMemo、useCallback 和自定义 Hooks。

---

## 🎯 useRef

用于获取 DOM 引用或保存==不触发重渲染==的值：

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

---

## 💫插话

  点击按钮后的完整流程

   ```jsx
     <span onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
   ```

   第 1 步：setTheme 触发重新渲染

   ```jsx
     const [theme, setTheme] = useLocalStorage('rzt-theme', 'light');
   ```

   setTheme 本质上就是 useLocalStorage 里的 setValue，也就是 ==useState== 返回的 setter。

   调用 `setTheme('dark')` 后：

   1. React 安排 App 组件重新渲染
   2. 重新渲染时，theme 变成 `'dark'`

   第 2 步：重新渲染 App

   ```jsx
     function App() {
       const [theme, setTheme] = useLocalStorage('rzt-theme', 'light'); // theme 现在是 'dark'

       useEffect(() => {
         document.documentElement.setAttribute('data-theme', theme);
       }, [theme]);

       return (...);
     }
   ```

   组件函数重新执行，得到新的 JSX。

   第 3 步：渲染完成后按 Hook 调用顺序执行 effect

   React 的 effect 按**注册顺序**执行。==因为 `useLocalStorage` 在 `App` 的 `useEffect` 之前被调用，所以 `useLocalStorage` 里的 effect 先执行。==

   先执行 useLocalStorage 里的 effect：

   ```jsx
     useEffect(() => {
       localStorage.setItem(key, JSON.stringify(value));
     }, [key, value]);
   ```

   因为 value（也就是 theme）变了，所以把 `'dark'` 写入 localStorage。

   再执行 App 里的 effect：

   ```jsx
     useEffect(() => {
       document.documentElement.setAttribute('data-theme', theme);
     }, [theme]);
   ```

   把 `data-theme` 属性改成 `'dark'`。

---

   正确顺序

   ```text
     点击按钮
       ↓
     setTheme('dark')
       ↓
     触发 App 重新渲染
       ↓
     渲染完成，DOM 更新
       ↓
     useLocalStorage 里的 useEffect([key, value]) 执行 → 写入 localStorage
       ↓
     App 里的 useEffect([theme]) 执行 → 设置 data-theme='dark'
   ```

---

   关键认知

   - useEffect 不会触发重新渲染，useEffect 是==渲染完成==后才执行的副作用。
   - 多个 useEffect 按 Hook 调用顺序执行，先调用的 effect 先执行。

   这里触发重新渲染的是：

   ```jsx
     setTheme(t => t === 'light' ? 'dark' : 'light')
   ```

   useEffect 只是响应 theme 变化，==在渲染完成后==做额外的事情（写 localStorage、改 DOM 属性）。



- setXxxx == >  |触发渲染 |  == > 渲染完成后触发 useEffect



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
