# 09 状态管理

> **本章目标**：对比 Redux Toolkit、Zustand、Jotai 三种状态管理方案。  
> **预计学习时间**：90 分钟

---

## 📊 方案选择指南

| 场景 | 推荐方案 |
|------|---------|
| 大型团队 / 复杂数据流 | Redux Toolkit |
| 快速开发 / 轻量需求 | Zustand |
| 原子化 / 细粒度更新 | Jotai |

## 🧠 面试题

**Q: Redux 和 Context 的区别？**  
A: Context 适合低频更新的全局数据；Redux 提供时间旅行调试、中间件、规范化状态结构，适合高频更新和复杂逻辑。

---

## 📝 总结

- Redux Toolkit 简化了传统 Redux 的样板代码
- Zustand 是极简的状态管理方案
- Jotai 提供原子化的细粒度状态管理
- 没有最好，只有最适合

## 📚 延伸阅读

- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
