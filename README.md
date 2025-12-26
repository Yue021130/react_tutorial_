<div align="center">

# ⚛️ React From Zero to Hero

**从零开始，系统掌握 React 全栈开发**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[📖 在线阅读](https://github.com/Yue021130/react-from-zero-to-hero) | [🚀 在线预览](https://react-from-zero-to-hero.vercel.app) | [🤝 参与贡献](CONTRIBUTING.md)

</div>

---

## 🗺️ 学习路线图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           React 学习路线图                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   🌱 第一阶段：基础入门          🚀 第二阶段：进阶核心                        │
│   ├─ 01 Hello React              ├─ 05 Hooks 深入                           │
│   ├─ 02 组件系统                  ├─ 06 Context 状态共享                      │
│   ├─ 03 State & Events           ├─ 07 React Router                         │
│   └─ 04 生命周期                  ├─ 08 表单处理                             │
│                                  └─ ...                                     │
│           ↓                              ↓                                  │
│   ⚙️ 第三阶段：工程化              🏗️ 第四阶段：实战与生态                      │
│   ├─ 09 状态管理                  ├─ 13 实战项目                             │
│   ├─ 10 性能优化                  ├─ 14 Next.js                             │
│   ├─ 11 测试体系                  ├─ 15 TypeScript                          │
│   └─ 12 设计模式                  └─ 16 部署运维                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📚 章节目录

### 第一阶段：基础入门 🌱

| 章节 | 标题 | 关键词 | 难度 |
|:---:|------|--------|:---:|
| [01](01-hello-react) | Hello React | Vite, JSX, 组件概念 | ⭐ |
| [02](02-components) | 组件系统 | Props, 条件渲染, 列表渲染 | ⭐ |
| [03](03-state-events) | State 与事件 | useState, 受控组件 | ⭐⭐ |
| [04](04-lifecycle) | 生命周期 | useEffect, 副作用, 依赖数组 | ⭐⭐ |

### 第二阶段：进阶核心 🚀

| 章节 | 标题 | 关键词 | 难度 |
|:---:|------|--------|:---:|
| [05](05-hooks-deep-dive) | Hooks 深入 | useRef, useMemo, useCallback | ⭐⭐⭐ |
| [06](06-context) | Context API | 跨组件状态, 性能优化 | ⭐⭐⭐ |
| [07](07-router) | React Router | v6/v7, 嵌套路由, 路由守卫 | ⭐⭐⭐ |
| [08](08-forms) | 表单处理 | 验证, React Hook Form | ⭐⭐⭐ |

### 第三阶段：工程化与状态管理 ⚙️

| 章节 | 标题 | 关键词 | 难度 |
|:---:|------|--------|:---:|
| [09](09-state-management) | 状态管理 | Redux, Zustand, Jotai | ⭐⭐⭐⭐ |
| [10](10-performance) | 性能优化 | memo, 懒加载, Profiler | ⭐⭐⭐⭐ |
| [11](11-testing) | 测试体系 | Jest, Testing Library | ⭐⭐⭐⭐ |
| [12](12-patterns) | 设计模式 | HOC, Render Props, Compound | ⭐⭐⭐⭐ |

### 第四阶段：实战与生态 🏗️

| 章节 | 标题 | 关键词 | 难度 |
|:---:|------|--------|:---:|
| [13](13-realworld-project) | 实战项目 | Todo/博客/电商 | ⭐⭐⭐⭐⭐ |
| [14](14-nextjs-intro) | Next.js | App Router, SSR, RSC | ⭐⭐⭐⭐⭐ |
| [15](15-typescript) | TypeScript | 泛型组件, 类型推导 | ⭐⭐⭐⭐ |
| [16](16-deployment) | 部署运维 | CI/CD, Docker, 监控 | ⭐⭐⭐⭐ |

## 🚀 快速开始

每个章节都是独立可运行的项目：

```bash
# 克隆仓库
git clone https://github.com/Yue021130/react-from-zero-to-hero.git
cd react-from-zero-to-hero

# 进入任意章节
cd 01-hello-react
npm install
npm run dev
```

## 📋 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **pnpm** >= 8.0.0
- 现代浏览器（Chrome / Firefox / Edge / Safari）

## 🎯 适合人群

- 🆕 **零基础前端开发者**：想要系统学习 React
- 🔄 **Vue/Angular 转型者**：快速掌握 React 生态
- 📈 **进阶开发者**：深入理解 React 原理与最佳实践
- 🎓 **面试准备者**：收录高频面试题与深度解析

## 📖 阅读指南

| 你的情况 | 建议路径 |
|---------|---------|
| 完全零基础 | 按顺序阅读 01 → 16 |
| 有 Vue/Angular 经验 | 快速浏览 01-02，从 03 开始 |
| 已有 React 基础 | 从 05 开始，按需深入 |
| 准备面试 | 重点阅读 [INTERVIEW.md](INTERVIEW.md) + 05, 10, 12 |

## 🛠️ 技术栈

- **核心**: React 19 + TypeScript 5.7
- **构建**: Vite 6
- **路由**: React Router v7
- **样式**: CSS Modules / Tailwind CSS
- **测试**: Jest + React Testing Library
- **部署**: Vercel / GitHub Pages + Docker

## 📄 额外资源

- [INTERVIEW.md](INTERVIEW.md) - React 高频面试题汇总
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [LICENSE](LICENSE) - MIT 许可证

## ⭐ Star History

如果你觉得这个项目有帮助，请给我们一个 ⭐ Star！

## 📜 License

[MIT](LICENSE) © Yue021130
