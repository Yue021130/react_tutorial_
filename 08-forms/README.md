# 08 表单处理

> **本章目标**：掌握表单验证和 React Hook Form。  
> **预计学习时间**：60 分钟

---

## 📝 原生验证 vs React Hook Form

| 特性 | 原生受控组件 | React Hook Form |
|------|-----------|----------------|
| 重渲染 | 每个输入都触发 | 非受控，最小重渲染 |
| 代码量 | 较多 | 精简 |
| 验证集成 | 手动实现 | 内置 + 可扩展 |
| 性能 | 一般 | 优秀 |

## 🎣 React Hook Form 基础

```jsx
import { useForm } from 'react-hook-form';

function Form() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      <button type="submit">提交</button>
    </form>
  );
}
```

---

## 📝 总结

- 简单表单可用原生受控组件
- 复杂表单推荐 React Hook Form
- 验证规则应与业务逻辑保持一致

## 📚 延伸阅读

- [React Hook Form 官方文档](https://react-hook-form.com/)
