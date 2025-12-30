# React Hooks 使用规则与原理

> 基于 `05-hooks-deep-dive` 项目整理。

---

## 一、Hooks 是什么？

React Hooks 是 React 16.8 引入的函数，让你**在函数组件里使用状态、生命周期、DOM 引用、缓存等能力**。

在 Hooks 出现之前，函数组件只能做纯展示，状态必须用 class 组件写。Hooks 让函数组件既简洁又强大。

### 常见内置 Hooks

| Hook | 作用 |
|------|------|
| `useState` | 添加状态 |
| `useEffect` | 处理副作用（请求、订阅、DOM 操作） |
| `useRef` | 获取 DOM / 保存不触发渲染的值 |
| `useMemo` | 缓存计算结果 |
| `useCallback` | 缓存函数引用 |
| `useContext` | 跨组件共享数据 |
| `useReducer` | 复杂状态管理 |

---

## 二、Hooks 的两条使用规则

### 规则 1：只在最顶层调用 Hook

```jsx
function Demo() {
  const [count, setCount] = useState(0); // ✅ 正确

  if (count > 0) {
    const [name, setName] = useState(''); // ❌ 错误！不能放在 if 里
  }

  return <div>{count}</div>;
}
```

❌ 不能放在：

- `if / else` 条件分支里
- `for / while` 循环里
- 普通函数内部（自定义 Hook 除外）
- 嵌套函数里

### 规则 2：只在 React 函数组件或自定义 Hook 中调用

```jsx
function MyComponent() {
  const [count] = useState(0); // ✅ 函数组件
}

function useMyHook() {
  const [count] = useState(0); // ✅ 自定义 Hook
}

function normalFunction() {
  const [count] = useState(0); // ❌ 普通函数不行
}
```

---

## 三、为什么要遵守规则？

### React 靠调用顺序识别 Hook

React 在内部为每个组件维护了一个 **Hook 链表/数组**。

```jsx
function Demo() {
  const [count] = useState(0);      // 第 1 个 Hook
  const [name] = useState('Alice'); // 第 2 个 Hook
  useEffect(() => {}, []);          // 第 3 个 Hook

  return <div>{count} {name}</div>;
}
```

React 记住的是：

```text
Hook 1: count 的状态
Hook 2: name 的状态
Hook 3: effect
```

靠的是**调用顺序**，而不是 Hook 的名字。

### 放在 if 里为什么会错？

```jsx
function Demo() {
  const [count] = useState(0); // Hook 1

  if (count > 0) {
    const [name] = useState(''); // 有时创建，有时不创建
  }

  useEffect(() => {}, []); // 顺序不稳定
}
```

- 第一次渲染：`count = 0`，不创建 `name`，effect 是 Hook 2
- 第二次渲染：`count = 1`，创建 `name`，effect 变成 Hook 3

React 就会**状态错位**，导致 bug 或报错。

---

## 四、Hooks 的原理（简化版）

React 内部，每个组件对应一个 **Fiber 节点**。

Fiber 节点上有一个 `memoizedState` 字段，指向第一个 Hook。

每个 Hook 大概长这样：

```js
{
  memoizedState: ..., // 当前值
  queue: ...,         // 更新队列
  next: Hook | null,  // 下一个 Hook
}
```

调用 `useState` 时：

1. React 顺着链表找到当前位置对应的 Hook
2. 返回它的 `memoizedState`
3. 调用 `setXxx` 时，把更新加入该 Hook 的 queue
4. 下次渲染时，按顺序重新遍历链表

所以**调用顺序绝对不能变**。

---

## 五、自定义 Hook

自定义 Hook 就是**提取可复用状态逻辑的函数**，名字必须以 `use` 开头。

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}
```

使用：

```jsx
function App() {
  const { width, height } = useWindowSize();
  return <div>{width} x {height}</div>;
}
```

自定义 Hook 不是组件，只是一个函数。以 `use` 开头是为了让 React 和 ESLint 识别它里面可以调用其他 Hook。

---

## 六、常见错误

### 错误 1：Hook 写在 if 里

```jsx
function Demo() {
  if (condition) {
    useEffect(() => {}, []); // ❌
  }
}
```

### 错误 2：Hook 写在事件处理函数里

```jsx
function Demo() {
  const handleClick = () => {
    const [count] = useState(0); // ❌
  };
}
```

### 错误 3：自定义 Hook 不以 use 开头

```jsx
function getWindowSize() { // ❌ React 不会把它当 Hook
  const [size] = useState(...);
}
```

---

## 七、总结

> **Hooks 让函数组件拥有状态和副作用能力；使用规则的核心是“保持调用顺序不变”，因为 React 靠顺序来对应每个 Hook 的状态。**
