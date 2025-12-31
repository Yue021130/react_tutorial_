 # React Router 完整指南

> 基于 `07-router` 项目整理，覆盖 React Router v6 的核心用法。

---

## 一、什么是 React Router？

React Router 是 React 生态最流行的路由库，用于在**单页应用（SPA）**中管理页面导航。

### 传统网页 vs SPA

| 类型 | 跳转方式 | 体验 |
|------|---------|------|
| 传统多页应用 | 点击 `<a>` → 请求新 HTML → 整页刷新 | 慢，有白屏 |
| 单页应用（SPA） | React Router 切换 URL → JS 动态替换组件 | 快，无刷新 |

### 核心作用

把 **URL 路径** 映射到 **React 组件**：

```text
/           → Home 组件
/about      → About 组件
/products   → Products 组件
/products/1 → ProductDetail 组件
```

---

## 二、两种配置方式

React Router v6 有两种写法：

### 方式一：createBrowserRouter（现代推荐）

```jsx
// src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },      // / → Home
      { path: 'about', element: <About /> },   // /about → About
    ],
  },
]);

export default router;
```

```jsx
// src/App.jsx
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

优点：
- 路由配置集中管理
- 支持 `loader`、`action`、`errorElement` 等高级特性
- 适合中大型项目

---

### 方式二：BrowserRouter + Routes（组件式）

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

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

优点：
- 写法直观
- 适合小型项目或快速演示

本章项目主要使用 **方式一（createBrowserRouter）**。

---

## 三、核心 API 详解

### 1. BrowserRouter

使用 HTML5 History API，URL 不带 `#`。

```jsx
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <App />
</BrowserRouter>
```

一般在 `main.jsx` 最外层包裹一次即可。

---

### 2. RouterProvider

配合 `createBrowserRouter` 使用，把路由对象注入应用。

```jsx
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return <RouterProvider router={router} />;
}
```

---

### 3. Route

定义一条路由规则：什么 URL 渲染什么组件。

```jsx
<Route path="/about" element={<About />} />
```

- `path`：URL 路径
- `element`：匹配的组件
- `index`：表示父路由的默认子路由
- `children`：嵌套子路由

---

### 4. Link / NavLink

声明式导航，替代 `<a>` 标签。

```jsx
import { Link, NavLink } from 'react-router-dom';

// 普通链接
<Link to="/about">关于</Link>

// 带激活状态的链接（当前路由会自动加 active 类）
<NavLink to="/about">关于</NavLink>
```

`NavLink` 会自动给当前匹配的链接添加 `.active` 类名，方便高亮。

---

### 5. Outlet

嵌套路由中，子路由组件渲染的位置。

```jsx
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />  {/* 子路由在这里渲染 */}
      <Footer />
    </div>
  );
}
```

---

### 6. useParams

读取 URL 动态参数。

```jsx
// 路由配置
<Route path="/products/:id" element={<ProductDetail />} />

// 组件中使用
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();  // /products/3 → id = "3"
  return <div>商品 ID: {id}</div>;
}
```

---

### 7. ==useNavigate==

编程式导航，在代码里控制跳转。

```jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 登录成功后跳转到仪表盘
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>登录</button>;
}
```

返回上一页：

```jsx
navigate(-1);
```

---

### 8. ==Navigate==

用于重定向，常用于路由守卫。

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
```

- `replace`：替换当前历史记录，==不会留下历史==

| 属性          | 说明                                                  |
| ------------- | ----------------------------------------------------- |
| `<Navigate>`  | React Router v6 引入的组件，用于**编程式导航/重定向** |
| `to="/login"` | 跳转目标路径                                          |
| `replace`     | 替换当前历史记录条目（不保留当前页在浏览历史中）      |

---

## 四、路由模式实战

### 1. 普通路由

```jsx
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
]);
```

---

### 2. 嵌套路由

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,           // 外层布局
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      {
        path: 'products',
        element: <ProductsLayout />,
        children: [
          { index: true, element: <ProductList /> },
          { path: ':id', element: <ProductDetail /> },
        ],
      },
    ],
  },
]);
```

访问 `/products` → `Layout` + `ProductsLayout` + `ProductList`

访问 `/products/5` → `Layout` + `ProductsLayout` + `ProductDetail`

---

### 3. 动态路由

```jsx
{ path: '/products/:id', element: <ProductDetail /> }
```

```jsx
function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));

  if (!product) return <div>商品不存在</div>;

  return <div>{product.name}</div>;
}
```

---

### 4. 路由守卫

```jsx
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
```

使用：

```jsx
{
  path: '/dashboard',
  element: (
    <ProtectedRoute isLoggedIn={isLoggedIn}>
      <Dashboard />
    </ProtectedRoute>
  ),
}
```

---

### 5. 404 兜底

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },  // 匹配所有未定义路径
    ],
  },
]);
```

---

## 五、完整项目结构示例

```
src/
├── main.jsx
├── App.jsx
├── router/
│   └── index.jsx
├── components/
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── NotFound.jsx
```

---

## 💫 插话

## 对比`<Link>` 和`<NavLink>`

| 特性                  | `<Link>`         | `<NavLink>`                |
| --------------------- | ---------------- | -------------------------- |
| `className`           | 只能传**字符串** | 可以传**字符串**或**函数** |
| `style`               | 只能传**对象**   | 可以传**对象**或**函数**   |
| `end`                 | ❌ 没有           | ✅ 有（精确匹配）           |
| 自动加 `aria-current` | ❌ 没有           | ✅ 有（无障碍支持）         |

## 核心区别

**`<Link>` 的 className：**
```jsx
<Link to="/about" className="nav-link">关于</Link>
// 只能写死字符串，不会随路由变化
```

**`<NavLink>` 的 className：**
```jsx
<NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
  关于
</NavLink>
// 可以传函数，根据是否匹配动态返回类名
```

## 一句话

> **`Link` 也有 `className`，但只能写死；`NavLink` 的 `className` 可以接收函数，根据当前路由自动切换样式。此外 `NavLink` 还多了 `end`、`style` 函数、`aria-current` 等功能。**

所以你的理解可以修正为：**`NavLink` 相当于 `Link` 的"增强版"，主要是让 `className` 和 `style` 能"动起来"**。



| 组件                 | 像什么                                          |
| -------------------- | ----------------------------------------------- |
| `<a href="...">`     | 原生超链接（会刷新整个页面）                    |
| `<Link to="...">`    | React Router 的"智能跳转"（不刷新，仅切换内容） |
| `<NavLink to="...">` | 在 `Link` 基础上加了"高亮当前页"的功能          |

---

## 💫 伏笔

 Q：为什么用 MemoryRouter？

 A：因为 BrowserRouter 和 createBrowserRouter 都会监听同一个浏览器地址栏。如果两个同时用真实路由，点击一个 demo 的链接会同时影响另一个 demo，导致混乱。

​		==MemoryRouter 把路由状态存在内存里，不碰地址栏==，所以两个 demo 可以独立运行。

---

## 🥵 Yue的对比

- ` useNavigate()`

> 类比：就像你写 `window.location.href = '...'`，但**不刷新页面**。

~~~react
// 普通跳转
navigate('/products');

// 带参数跳转
navigate('/products/123');

// 后退一页（相当于浏览器返回键）
navigate(-1);

// 前进一页
navigate(1);

// 替换当前历史记录（用户点返回不会回到这页）
navigate('/login', { replace: true });
~~~



- `Navigate 组件`

> **在 JSX 里写"如果渲染到我就跳走"**，通常配合条件判断。   
>
> 是一种 “声明式重定向”

> 和 `useNavigate()` 的区别：
>
> - `useNavigate()` 是**你==主动==调用函数**跳转
> - `<Navigate />` 是==**渲染这个组件时自动**==跳转



- `Routes 和 Route 组件`

> **整个应用的"URL → 页面"映射表**。所有路由必须包在 `<Routes>` 里。



- `NavLink 组件`

> **专门用于导航菜单**，比 `<Link>` 多了"当前页面高亮"能力。

> 和 `<Link>` 的区别：
>
> - `<Link to="...">`：只管跳转，没有激活状态
> - `<NavLink to="...">`：能感知当前 URL，自动告诉你 `isActive`



| 名称                   | 类型                 | 一句话                 | 在哪用               | 典型场景                   |
| ---------------------- | -------------------- | ---------------------- | -------------------- | -------------------------- |
| `useNavigate()`        | **Hook**（==函数==） | 代码里"命令"跳转       | 事件处理、逻辑判断中 | 登出后跳转、表单提交后跳转 |
| `<Navigate />`         | **组件**             | 条件满足时"自动"跳转   | JSX 渲染中           | 未登录时自动重定向到登录页 |
| `<Routes>` + `<Route>` | **组件对**           | 定义"URL 对应什么页面" | 应用顶层/路由配置    | 整个应用的路由表           |
| `<NavLink>`            | **组件**             | 带高亮状态的导航链接   | 导航栏、菜单         | 顶部 Navbar 的菜单项       |



---

## 😣关于 **`<Routes>` + `<Route>`** 和 `createBrowserRouter(routes)`

别急！混乱很正常，因为你看到的是 React Router **同一套东西的两种写法**。我帮你理清楚 👇

## 先说结论

> **`<Routes>` + `<Route>`** 和 **`createBrowserRouter(routes)`** 做的是**完全一样的事**——定义"URL 对应哪个页面"。
>
> 只是 React Router 提供了 **JSX 写法** 和 **对象写法** 两种风格，对象写法是新版（v6.4+）推荐的。

---

## 两种写法对比

### 写法 1：JSX 风格（你之前学的）

```jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

### 写法 2：对象风格（你现在看到的）

```jsx
import { createBrowserRouter } from 'react-router-dom';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'login', element: <Login /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter(routes);
```

---

## 它们是什么关系？

|            | JSX 写法           | 对象写法                            |
| ---------- | ------------------ | ----------------------------------- |
| **本质**   | 用组件写配置       | 用对象写配置                        |
| **最终**   | React 内部转成对象 | 直接就是对象                        |
| **功能**   | 基础路由功能 ✅     | 基础路由功能 ✅ + 数据加载等新特性 ✅ |
| **推荐度** | 兼容旧项目         | **官方推荐**（v6.4+）               |

---

## 为什么要搞两种？

React Router v6.4 之前只有 JSX 写法。后来为了支持**数据加载**（`loader`）、**表单提交**（`action`）、**错误处理**（`errorElement`）等新功能，推出了对象写法。

```jsx
// 对象写法才能方便地加 loader、action
const routes = [
  {
    path: 'products/:id',
    element: <ProductDetail />,
    loader: async ({ params }) => {
      // 页面渲染前自动加载数据
      return fetch(`/api/products/${params.id}`);
    },
    errorElement: <ErrorPage />,  // 加载出错时显示
  },
];
```

这些新特性用 JSX 写会很啰嗦，所以对象写法成了官方推荐。

---

## 怎么用对象写法？

对象写法需要一个**新的 Provider**：

```jsx
// main.jsx
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />  // ← 用 RouterProvider，不是 BrowserRouter
);
```

> 注意：用了 `createBrowserRouter` 后，**不需要**再写 `<BrowserRouter>` 和 `<Routes>`，它们被 `RouterProvider` 替代了。

---

## 快速转换对照表

| JSX 写法                           | 对象写法                        |
| ---------------------------------- | ------------------------------- |
| `<Routes>`                         | 不需要，对象数组本身就是路由表  |
| `<Route path="..." element={...}>` | `{ path: "...", element: ... }` |
| `<Route index element={...}>`      | `{ index: true, element: ... }` |
| `<Route path="*" element={...}>`   | `{ path: "*", element: ... }`   |
| 嵌套 `<Route>`                     | `children: [...]`               |
| `<Outlet />`                       | 还是 `<Outlet />`，不变         |

---

## 一句话总结

> **对象写法就是把 JSX 路由配置"拍平"成了 JavaScript 对象数组，功能一模一样，但对象写法能解锁更多新特性。你可以理解为：JSX 写法是"旧语法"，对象写法是"新语法"。**

你现在看到的代码就是对象写法，它等价于你之前学的 JSX 写法，只是换了个皮囊 😄

---

## 六、常见面试题

**Q: React Router v6 和 v5 的主要区别？**

A:
- v6 用 `element` 替代 `component`
- v6 引入 `Routes` 替代 `Switch`
- v6 推荐 `createBrowserRouter` + `RouterProvider`
- v6 的嵌套路由更强大，支持 `<Outlet />`

**Q: `Link` 和 `a` 标签的区别？**

A: `Link` 不会刷新页面，只是更新 URL 并切换组件；`a` 会触发整页刷新。

**Q: `useParams` 和 `useSearchParams` 的区别？**

A: `useParams` 获取 URL 路径参数（如 `/user/:id`）；`useSearchParams` 获取查询字符串（如 `?name=alice`）。

---

## 七、一句话总结

> React Router 是 SPA 的“URL ↔ 组件”映射器。`createBrowserRouter` 集中配置路由，`Link/NavLink` 声明式跳转，`Outlet` 渲染嵌套子路由，`useParams/useNavigate` 处理动态参数和编程式导航。
