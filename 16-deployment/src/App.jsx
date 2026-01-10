import { useState, useEffect } from 'react';

// ============================================
// 16-deployment: CI/CD 与部署
// 学习目标：
//   1. GitHub Actions 工作流
//   2. Docker 容器化
//   3. 性能监控
// 预计学习时间：60 分钟
// ============================================

export default function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="container">
      <span className="toggle-theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <header className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)' }}>16 部署运维</h1>
        <p style={{ color: 'var(--muted)' }}>CI/CD · Docker · 性能监控</p>
      </header>

      <section className="card">
        <h2>🚀 GitHub Actions 工作流</h2>
        <div className="code">{`.github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1`}</div>
      </section>

      <section className="card">
        <h2>🐳 Dockerfile</h2>
        <div className="code">{`# 多阶段构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}</div>
      </section>

      <section className="card">
        <h2>📊 性能监控指标</h2>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--muted)' }}>
          <li><strong>LCP</strong> (Largest Contentful Paint) - 最大内容绘制 &lt; 2.5s</li>
          <li><strong>FID</strong> (First Input Delay) - 首次输入延迟 &lt; 100ms</li>
          <li><strong>CLS</strong> (Cumulative Layout Shift) - 累积布局偏移 &lt; 0.1</li>
          <li><strong>TTFB</strong> (Time to First Byte) - 首字节时间 &lt; 600ms</li>
        </ul>
      </section>

      <footer className="card" style={{ textAlign: 'center' }}>
        <h3>🎉 恭喜完成全部章节！</h3>
        <p style={{ color: 'var(--muted)' }}>
          你已经系统学习了 React 从入门到精通的全部内容。
          现在可以开始构建自己的 React 应用了！
        </p>
      </footer>
    </div>
  );
}
