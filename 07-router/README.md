# 07 React Router

> **本章目标**：掌握 React Router v7 的路由配置与导航。  
> **预计学习时间**：75 分钟

---

## 🛣️ 核心概念

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 🧠 面试题

**Q: BrowserRouter 和 HashRouter 的区别？**  
A: BrowserRouter 使用 HTML5 history API（路径干净），需要服务端配置；HashRouter 使用 URL hash（兼容性更好），不需要服务端配置。

---

## 📝 总结

- React Router 是 React 的标准路由方案
- 支持嵌套路由、动态路由、编程式导航
- 路由守卫可通过条件渲染或 Navigate 实现

## 📚 延伸阅读

- [React Router 官方文档](https://reactrouter.com/)
