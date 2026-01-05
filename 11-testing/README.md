# 11 测试体系

> **本章目标**：掌握 React 组件测试方法。  
> **预计学习时间**：90 分钟

---

## 🧪 测试金字塔

```
     /\
    /  \  E2E 测试 (Cypress/Playwright)
   /----\
  /      \  集成测试 (React Testing Library)
 /--------\
/          \ 单元测试 (Vitest/Jest)
```

## 📝 测试最佳实践

1. 测试用户看到的，而非代码实现
2. 使用 `screen` 查询，而非 `container`
3. `fireEvent` 模拟用户交互
4. `waitFor` 处理异步操作

---

## 📝 总结

- React Testing Library 鼓励测试行为而非实现
- Vitest 是 Vite 项目的首选测试框架
- 测试覆盖关键路径，追求质量而非数量

## 📚 延伸阅读

- [Testing Library 官方文档](https://testing-library.com/docs/react-testing-library/intro/)
