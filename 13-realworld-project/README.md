# 13 实战项目

> **本章目标**：通过一个完整的 Todo 应用串联所学知识。  
> **预计学习时间**：120 分钟

---

## 🏗️ 项目架构

```
src/
├── main.jsx      # 应用入口
├── App.jsx       # 主组件
├── store.js      # Zustand 状态管理
└── index.css     # 全局样式
```

## 🛠️ 技术栈

- React 19
- React Router 7
- Zustand（状态管理）
- CSS 变量（主题切换）

## 📝 功能清单

- ✅ 添加/删除任务
- ✅ 标记完成/未完成
- ✅ 按状态筛选（全部/进行中/已完成）
- ✅ 实时统计
- ✅ Dark/Light 主题切换

---

## 📝 总结

本章将前面章节的知识点串联：
- useState/useEffect 管理本地状态
- Zustand 管理全局状态
- React Router 实现路由筛选
- CSS 变量实现主题切换

## 📚 延伸阅读

- [Zustand 官方文档](https://docs.pmnd.rs/zustand)
