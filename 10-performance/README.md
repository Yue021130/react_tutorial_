# 10 性能优化

> **本章目标**：掌握 React 性能优化的核心手段。  
> **预计学习时间**：75 分钟

---

## 🛠️ 优化手段

| 手段 | 用途 |
|------|------|
| React.memo | 阻止不必要的重渲染 |
| useMemo | 缓存计算结果 |
| useCallback | 缓存函数引用 |
| lazy + Suspense | 代码分割与懒加载 |
| Profiler | 性能测量 |

## 🧠 面试题

**Q: React.memo 和 PureComponent 的区别？**  
A: 都是浅比较 props。React.memo 用于函数组件，PureComponent 用于类组件。

---

## 📝 总结

- 先测量，后优化
- React.memo 不是所有组件都需要
- 代码分割减少首屏加载时间

## 📚 延伸阅读

- [React 官方性能优化指南](https://react.dev/learn/render-and-commit)
