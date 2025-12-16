# 03 State 与事件

> **本章目标**：掌握 useState、事件处理和受控组件。

---

## 🎣 useState Hook

useState 是 React 最常用的 Hook，用于在函数组件中添加状态：

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 关键规则

- **不可直接修改 State**：`count++` ❌ → `setCount(c => c + 1)` ✅
- **Setter 是异步的**：连续调用会被批量处理
- **函数式更新**：新状态依赖旧状态时，使用函数形式

## 🖱️ 事件处理

React 使用合成事件系统，提供跨浏览器一致性：

```jsx
function handleClick(event) {
  event.preventDefault();   // 阻止默认行为
  event.stopPropagation();  // 阻止冒泡
}
```

## 📝 受控组件

表单元素的值由 React State 控制：

```jsx
const [value, setValue] = useState('');

<input value={value} onChange={e => setValue(e.target.value)} />
```

| 元素类型 | 处理方式 |
|---------|---------|
| `<input type="text">` | `value` + `onChange` |
| `<textarea>` | 同 text input |
| `<select>` | `value` + `onChange` |
| `<input type="checkbox">` | `checked` + `onChange` |
| `<input type="radio">` | `checked` + `onChange` |


为什么不同元素处理方式不同？
表格的核心意思是：不同表单元素读取/写入值的属性名不一样，但受控模式的思路完全相同：

| 元素 | 绑定值的属性 | 事件回调中取值的方式 | 原因 |
| :--- | :--- | :--- | :--- |
| `text/textarea/select` | `value` | `e.target.value` | 这些元素的值存在 `value` 属性里 |
| `checkbox/radio` | `checked` | `e.target.checked` | 勾选状态不在 `value` 里，而在 `checked` 布尔属性里 |


| | 受控组件 | 非受控组件 |
| :--- | :--- | :--- |
| 数据源 | React state | DOM 自身 |
| 写法 | `value` + `onChange` | 不传 `value`，用 `ref` 取值 |
| 实时校验/联动 | ✅ 天然支持 | ❌ 需要手动监听 |
| 代码量 | 稍多 | 较少 |
| 推荐程度 | 绝大多数场景首选 | 仅简单表单/第三方库集成 |



## 🧠 常见面试题

**Q: 为什么 setState 是异步的？**  
A: React 为了性能优化会批量（batch）多个 setState 调用，减少不必要的重渲染。

**Q: useState 的初始值可以是一个函数吗？**  
A: 可以。如果初始值需要复杂计算，传入函数可避免每次渲染都执行：`useState(() => expensive())`。

---

## 📝 总结

- useState 是函数组件的状态管理基础
- 事件处理使用合成事件，注意阻止默认行为
- 表单推荐使用受控组件，数据流清晰可控

## 📚 延伸阅读

- [React 官方文档 - State](https://react.dev/learn/state-a-components-memory)
- [React 官方文档 - 表单](https://react.dev/learn/thinking-in-react)
