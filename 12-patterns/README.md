# 12 设计模式

> **本章目标**：掌握 React 中常用的组件设计模式。  
> **预计学习时间**：75 分钟

---

## 🏗️ 模式对比

| 模式 | 用途 | 现代替代方案 |
|------|------|-----------|
| HOC | 复用组件逻辑 | 自定义 Hooks |
| Render Props | 共享状态逻辑 | 自定义 Hooks |
| Compound Components | 构建关联组件组 | Context + Hooks |
| Container/Presentational | 分离数据与 UI | 自定义 Hooks |

## 🧠 面试题

**Q: HOC 和 Hooks 的区别？**  
A: HOC 在组件层级添加功能，可能导致 props 命名冲突；Hooks 在函数内部复用逻辑，更灵活且没有嵌套地狱。

---

## 📝 总结

- 现代 React 中，自定义 Hooks 逐渐取代了 HOC 和 Render Props
- Compound Components 适合构建 Tabs、Select 等关联组件
- Container/Presentational 思想仍然有价值，但实现方式更灵活

## 📚 延伸阅读

- [React Patterns](https://reactpatterns.com/)
