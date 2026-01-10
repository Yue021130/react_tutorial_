# 16 部署运维

> **本章目标**：掌握 React 项目的 CI/CD 和部署方案。  
> **预计学习时间**：60 分钟

---

## 🚀 部署平台

| 平台 | 特点 |
|------|------|
| Vercel | 零配置部署，支持 Next.js |
| Netlify | 静态网站托管 |
| GitHub Pages | 免费，适合文档/演示 |
| AWS S3 + CloudFront | 企业级 CDN |

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t react-app .

# 运行容器
docker run -p 80:80 react-app
```

## 📊 Core Web Vitals

| 指标 | 目标 |
|------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

---

## 📝 总结

- CI/CD 自动化测试和部署
- Docker 容器化保证环境一致
- 性能监控是持续优化的基础

## 📚 延伸阅读

- [Vercel 文档](https://vercel.com/docs)
- [Web Vitals](https://web.dev/vitals/)
