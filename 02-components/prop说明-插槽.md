# REACT的插槽

~~~react
<section className="card">
    <h2>🧩 组件组合</h2>

    {/* 传递组件 或者 HTML元素 ， 类似于插槽。 */}

    <Card>

      <CardHeader title="可复用卡片" subtitle="通过 children 实现灵活内容" />

      <CardBody>
        <p>这是通过 <code>children</code> 传递的内容。父组件不需要知道子组件内部实现。</p>
      </CardBody>

      <CardFooter>
        <button className="btn">确认</button>
      </CardFooter>

    </Card>
</section> 


function Card(prop) {
  return <div className="card">{prop.children}</div>;
}

function CardHeader({ title, subtitle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
      <h3>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{subtitle}</p>
    </div>
  );
}

function CardBody({ children }) {
  return <div style={{ marginBottom: '0.75rem' }}>{children}</div>;
}

function CardFooter({ children }) {
  return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>{children}</div>;
}
~~~

==prop.**children**==  就是标签之间夹带的所有内容，打包起来就是`children`。

---



是的，**这就是 React 的"插槽"机制**，只是 React 里不叫 `slot`，叫 **`children`（子元素）** 或 **组件组合（Composition）**。

---

## 1. `children` 的本质

在 JSX 中，==**标签之间的所有内容**都会被 React 打包成一个 `children` prop，传给组件==。

```jsx
<Card>
  <CardHeader ... />
  <CardBody>...</CardBody>
</Card>
```

等价于：

```jsx
Card({
  children: [
    <CardHeader ... />,
    <CardBody>...</CardBody>
  ]
})
```

所以 `Card` 组件里写 `prop.children`，就是在渲染"标签中间塞进来的那些东西"。

---

## 2. 代码拆解：三种"插槽"风格

你这段代码实际上展示了 **三种不同的内容传递方式**：

### ① 默认插槽（children）
```jsx
function Card(prop) {
  return <div className="card">{prop.children}</div>;
}

// 用法：中间塞什么，就渲染什么
<Card>这里的内容就是 prop.children</Card>
```

### ② 具名插槽（特定 props）
```jsx
function CardHeader({ title, subtitle }) {
  return (
    <div>
      <h3>{title}</h3>      {/* ← 具名插槽：title */}
      <p>{subtitle}</p>     {/* ← 具名插槽：subtitle */}
    </div>
  );
}

// 用法：通过属性名精确传入
<CardHeader title="可复用卡片" subtitle="通过 children..." />
```

### ③ 嵌套插槽（children 再嵌套 children）  

> 有点乱~  

```jsx
function CardBody({ children }) {
  return <div>{children}</div>;
}

// 用法：CardBody 标签中间的内容，成为 CardBody 的 children
<CardBody>
  <p>这是通过 children 传递的内容...</p>
</CardBody>
```

---

## 3. 与 Vue 插槽的对比

| 概念       | Vue                    | React                                              |
| ---------- | ---------------------- | -------------------------------------------------- |
| 默认插槽   | `<slot></slot>`        | `{children}`                                       |
| 具名插槽   | `<slot name="header">` | 没有内置语法，直接用 props（如 `title`、`footer`） |
| 作用域插槽 | `v-slot="{ data }"`    | 用 render props 或自定义 Hook                      |

React 没有专门的 `<slot>` 标签，因为它**直接用 props 就能实现一切**——`children` 本质上就是一个特殊的 prop。

---

## 4. 为什么要这样设计？

React 官方推崇 **"组合优于继承"（Composition over Inheritance）**。

```jsx
// ❌ 继承思路：Card 内部硬编码 Header/Body/Footer 的样子
<Card type="with-header-and-footer" />

// ✅ 组合思路：Card 只负责外壳，内容你随意组装
<Card>
  <CardHeader ... />
  <CardBody>...</CardBody>
  <CardFooter>...</CardFooter>
</Card>
```

**好处：**
- `Card` 完全不知道里面是什么，只负责边框/背景/阴影等外壳样式
- 你可以把 `CardBody` 换成任意内容：表格、表单、图片……
- 组件之间解耦，复用性更强

---

## 一句话总结

> `children` 就是 React 的插槽。  
> 标签中间的内容 = 传入 `children` prop = 组件内部用 `{children}` 渲染出来。  
> 配合具名 props（如 `title`）和嵌套组件，就能实现 Vue 里各种插槽的同等效果。





# 组合优于继承
## 一.解释

**"组合优于继承"** 是面向对象设计的一条黄金法则，意思是：

> **与其让一个组件"继承"另一个组件的能力，不如让它们"组合"在一起工作。**

---

### 1. 继承思路（❌ 不推荐）

假设你想做一个"带标题的卡片"，继承式思维会这样写：

```jsx
// 先定义一个基础卡片
class BaseCard extends React.Component {
  render() {
    return <div className="card">{this.props.children}</div>;
  }
}

// 带标题的卡片"继承"基础卡片
class TitledCard extends BaseCard {
  render() {
    return (
      <div className="card">
        <h2>{this.props.title}</h2>
        {this.props.children}
      </div>
    );
  }
}
```

**问题在哪？**
- `TitledCard` 和 `BaseCard` 绑死了，想换个标题样式？改 `BaseCard` 可能把 `TitledCard` 也搞崩
- 想要"带标题但没有边框的卡片"？继承链会越来越复杂
- 复用困难：你只能拿走整个 `TitledCard`，无法单独拿走它的标题逻辑

---

### 2. 组合思路（✅ React 推荐）

React 用 **props + children** 实现组合，你的代码就是典范：

```jsx
// Card 只负责"外壳"（边框、背景、阴影）
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// CardHeader 只负责"标题区"
function CardHeader({ title }) {
  return <h2>{title}</h2>;
}

// 使用时像搭积木一样组装
<Card>
  <CardHeader title="标题" />
  <p>内容随便写</p>
</Card>
```

**优势：**
| 场景                  | 继承                     | 组合                                         |
| --------------------- | ------------------------ | -------------------------------------------- |
| 想要"带标题的卡片"    | 新建一个继承类           | `<Card><CardHeader/>...</Card>`              |
| 想要"带标题+底部按钮" | 再新建一个继承类         | `<Card><CardHeader/>...<CardFooter/></Card>` |
| 标题想换样式          | 改父类，可能牵一发动全身 | 直接改 `CardHeader` 或换个组件               |
| 复用标题逻辑          | 跟着卡片一起拿走         | `CardHeader` 可以插到任何容器里              |

---

### 3. 一句话总结

> **继承是"is-a"（是一个）**：`TitledCard` 是一个特殊的 `Card`  
> **组合是"has-a"（有一个）**：`Card` 有一个 `CardHeader`，也可以没有

React 官方甚至直接说：**"我们不推荐用继承来构建组件"**，所有场景都可以用组合 + props 解决。

你的那段 `Card` / `CardHeader` / `CardBody` / `CardFooter` 代码，就是组合思想的完美体现——每个部件独立，按需拼装。

## 二.本质

**本质：控制权的归属。**

---

### 继承 = "我被定义成什么"

```js
class Dog extends Animal { ... }
```

- ==你的**身份**在写代码时就固定了==
- 你**是**一个 Animal，一辈子改不了
- 父类变了，你**必须跟着变**（即使你不愿意）

### 组合 = "我能组装什么"

```jsx
<Card>
  <Header />
  <Body />
</Card>
```

- 你的**能力**在==运行时==才确定
- 你**有**一个 Header，但明天可以换成 `VideoHeader`、`<h1>`、甚至 `null`
- 部件变了，Card **不需要知道**

---

### 更深一层：耦合的位置

|                | 继承                       | 组合                   |
| -------------- | -------------------------- | ---------------------- |
| **耦合时机**   | 编译时（代码层面）         | 运行时（渲染时）       |
| **耦合方向**   | 子类依赖父类               | 父容器依赖传入的 props |
| **改动的代价** | 牵一发动全身（继承链震动） | 只改被替换的那个部件   |

---

### React 为什么彻底放弃继承？

因为 **UI 是极度不稳定的**：

- 今天卡片有标题，明天可能变成视频封面
- 今天按钮在底部，明天可能移到侧边栏

如果用继承，每次需求变更都要**重构类层次结构**；  
如果用组合，只需要**换一块积木**。

> ==**组合的本质是"委托"（Delegation）**==
> 容器不自己实现功能，而是把功能**委托**给传入的部件。  
> ==继承的本质是"特化"（Specialization）== 
> 你生来就是这个东西的一种，逃不掉。

---

### 一句话

**继承是"血缘关系"，改不了、拆不开；**  
**组合是"雇佣关系"，用谁、怎么用，运行时说了算。**