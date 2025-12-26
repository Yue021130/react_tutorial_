# React 高频面试题

> 汇总 React 面试中最常出现的问题与深度解析。

---

## 一、基础篇

### Q1: 什么是 JSX？它与 HTML 有什么区别？

**答**：JSX 是 JavaScript 的语法扩展，允许在 JS 中编写类似 HTML 的结构。编译后变成 `React.createElement()` 调用。

区别：
- `class` → `className`
- `for` → `htmlFor`
- 标签必须闭合
- 内联样式用对象：`style={{ color: 'red' }}`
- 事件名用驼峰：`onClick`

---

### Q2: 函数组件和类组件的区别？

| 特性 | 函数组件 | 类组件 |
|------|---------|--------|
| 语法 | 简洁 | 较冗长 |
| 状态 | useState | this.state |
| 生命周期 | useEffect | 生命周期方法 |
| this 绑定 | 无 | 需要绑定 |
| 推荐程度 | ✅ 首选 | 已过时 |

---

### Q3: Props 和 State 的区别？

- **Props**：父传子，只读，外部控制
- **State**：组件内部管理，可变，通过 setState 更新

---

## 二、Hooks 篇

### Q4: useEffect 的依赖数组有什么作用？

**答**：控制副作用的执行时机：
- 无依赖：每次渲染后执行
- `[]`：只在挂载时执行
- `[a, b]`：挂载时 + 依赖变化时执行

---

### Q5: useMemo 和 useCallback 的区别？

**答**：
- `useMemo` 缓存**计算结果**（值）
- `useCallback` 缓存**函数引用**

`useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)`

---

### Q6: 为什么 Hooks 不能放在 if 语句中？

**答**：React 通过 Hooks 的调用顺序来匹配状态和副作用。条件调用会破坏这个顺序，导致状态错乱。

---

## 三、进阶篇

### Q7: React 的渲染流程是怎样的？

```
1. State/Props 变化
2. 重新渲染组件（生成新的 Virtual DOM）
3. Diff 算法比较新旧 Virtual DOM
4. 计算最小更新（Reconciliation）
5. 提交到真实 DOM（Commit）
```

---

### Q8: React.memo 的作用？

**答**：对函数组件进行浅比较，如果 props 没有变化则跳过渲染。适用于纯展示组件。

---

### Q9: Context 会替代 Redux 吗？

**答**：不会。Context 适合低频更新的全局数据（如主题、用户登录状态）。Redux 适合高频更新、复杂业务逻辑的状态管理，提供更强大的 DevTools 和中间件支持。

---

### Q10: 什么是 React Server Components？

**答**：RSC 是在服务端渲染的 React 组件，可以直接访问后端资源（数据库、文件系统等），不发送组件 JS 到客户端，减少 bundle 体积。Next.js App Router 默认使用 RSC。

---

## 四、性能篇

### Q11: 如何优化 React 应用性能？

1. 使用 `React.memo` 避免不必要重渲染
2. 使用 `useMemo` / `useCallback` 缓存
3. 懒加载组件（`React.lazy` + `Suspense`）
4. 虚拟列表（长列表优化）
5. 代码分割
6. 避免在 render 中创建新对象/函数

---

### Q12: 什么是 Time Slicing？

**答**：React 18 引入的并发特性，允许 React 在渲染过程中暂停和恢复，优先响应用户交互，避免阻塞主线程。

---

## 五、工程化篇

### Q13: 如何处理 React 中的跨域请求？

1. 开发环境：配置 Vite/Webpack 代理
2. 生产环境：Nginx 反向代理
3. 后端开启 CORS

---

### Q14: React 项目的目录结构如何组织？

推荐按功能模块组织：
```
src/
├── components/     # 通用组件
├── features/       # 功能模块
├── hooks/          # 自定义 Hooks
├── services/       # API 请求
├── stores/         # 状态管理
├── utils/          # 工具函数
└── types/          # 类型定义
```

---

## 六、场景题

### Q15: 实现一个防抖的搜索框

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) fetchResults(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

### Q16: 如何实现路由守卫？

```jsx
function PrivateRoute({ children }) {
  const isAuth = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
}
```

---

## 附录：推荐阅读

- [React 官方文档](https://react.dev)
- [React 源码解析](https://github.com/acdlite/react-fundamentals)
- [React 模式](https://reactpatterns.com/)
