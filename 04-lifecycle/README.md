# 04 生命周期

> **本章目标**：深入理解 useEffect 和函数组件生命周期。
---

## 🔄 useEffect 概览

```jsx
useEffect(effect, dependencies);
```

| 依赖数组 | 执行时机 |
|---------|---------|
| 无 | 每次渲染后 |
| `[]` | 只在组件挂载时 |
| `[a, b]` | 挂载时 + 依赖变化时 |

## 🧹 清理副作用

组件卸载前或依赖变化前，返回的清理函数会被调用：

```jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // 清理
}, []);
```

---


## 💫 useEffect 的本质

 useEffect 的 setup 函数不是在“挂载时”执行的，而是在每次==渲染完成后==**异步**执行的。

 它的执行时机由依赖数组决定：

| 依赖数组     | setup 何时执行                                 | cleanup 何时执行                         |
| ------------ | ---------------------------------------------- | ---------------------------------------- |
| 不写（默认） | 每次渲染后都执行                               | 每次重新执行 effect 前执行，卸载时也执行 |
| `[]`         | 只在第一次渲染后执行                           | 只在卸载前执行                           |
| `[a, b]`     | 某次渲染后，==发现 a 或 b 和上次不一样时执行== | 每次重新执行 effect 前执行，卸载时也执行 |

---



## 😍useEffect的返回

 useEffect 期望回调函数返回：

   • undefined（什么都不返回）
   • 或者一个 cleanup 清理函数

如果你把 useEffect 写成 async：

   ```jsx
     useEffect(async () => {
       const res = await fetch(...);
       // ...
       return () => controller.abort(); // ❌ 不行！
     }, []);
   ```

   async 函数默认返回一个 Promise，React 会把这个 Promise 当成 cleanup 函数，这会导致错误。



 正确做法：内部声明 async 函数，然后直接调用

   ```jsx
     useEffect(() => {
       const controller = new AbortController();

       async function fetchUser() {
         setLoading(true);
         setError(null);
         try {
           const res = await fetch(...);
           // ...
         } catch (err) {
           // ...
         } finally {
           setLoading(false);
         }
       }

       fetchUser(); // 直接调用，不需要 await

       return () => controller.abort();
     }, [userId]);
   ```

   这里：

   1. useEffect 本身是正常的同步函数
   2. fetchUser 是在它内部定义的 async 函数
   3. fetchUser() 启动异步请求后立刻返回一个 Promise
   4. ==这个 Promise 我们不关心，所以不用 await==
   5. useEffect 仍然可以正常返回 cleanup 函数



 await fetchUser() 行不行？

   理论上可以写：

   ```jsx
     await fetchUser();
   ```

   但这样 useEffect 的回调就也得是 async，这就不行了。

   或者你写成：

   ```jsx
     (async () => {
       await fetchUser();
     })();
   ```

   这样也能跑，但没必要，因为：
   • 请求已经开始
   • 结果会通过 setData 更新 state
   • React 会自动重新渲染



> Ｑ：为什么  理论上可以写：
>
>    ```jsx
>   await fetchUser();
>    ```
>
>    但这样 useEffect 的回调就也得是 async，这就不行了 ？
>
> 
>
> Ａ：
>
>  因为 await 只能在 async 函数里使用。
>
>    这是 JavaScript 的语法规则。
>
> 
>
>    直接写 await 会报错
>
>    假设你这么写：
>
>    ```jsx
>      useEffect(() => {
>        const controller = new AbortController();
> 
>        async function fetchUser() {
>          const res = await fetch(...);
>          // ...
>        }
> 
>        await fetchUser(); // ❌ 报错！
> 
>        return () => controller.abort();
>      }, []);
>    ```
>
>    JavaScript 看到 await 就会检查：这个函数是不是 async？
>
>    这里的函数是 useEffect(() => {...}) 里的箭头函数，它不是 async，所以会直接报语法错误：
>
>    ```text
>      SyntaxError: await is only valid in async functions and the top-level bodies of modules
>    ```
>
>    要让 await 合法，必须加 async
>
>    那你就得改成：
>
>    ```jsx
>      useEffect(async () => {  // ✅ await 合法了
>        const controller = new AbortController();
> 
>        async function fetchUser() {
>          const res = await fetch(...);
>          // ...
>        }
> 
>        await fetchUser();
> 
>        return () => controller.abort();
>      }, []);
>    ```
>
>    但是！这一步就出问题了：
>
>    • useEffect 的回调变成了 async 函数
>    • async 函数返回的是 Promise
>    • React 期望返回的是 cleanup 函数或 undefined
>    • 所以 React 报错
>
>    
>
>    逻辑链
>
>    ```text
>      想要在 useEffect 里用 await
>              ↓
>      必须把 useEffect 的回调变成 async
>              ↓
>      async 函数返回 Promise
>              ↓
>      React 不允许 useEffect 返回 Promise
>              ↓
>      ❌ 不行
>    ```
>
> 
>
>    所以解决方案是什么？
>
>    不在 useEffect 回调里直接 await，而是：
>
>    ```jsx
>      useEffect(() => {
>        const controller = new AbortController();
> 
>        async function fetchUser() {
>          const res = await fetch(...);
>          // ...
>        }
> 
>        fetchUser(); // ✅ 直接调用，不用 await
> 
>        return () => controller.abort();
>      }, []);
>    ```
>
>    这样：
>
>    • useEffect 本身是普通函数，可以正常返回 cleanup
>    • fetchUser 是内部的 async 函数，里面有合法的 await
>    • fetchUser() 调用后返回 Promise，但我们不关心，直接忽略
>
> 
>
>    一句话总结
>
> > await 必须写在 async 函数里。一旦把 useEffect 回调变成 async，它就会返回 Promise，而 React 不允许。所以不能直接在 useEffect 回调里 await，只能在内部再套一层 async 函数。



## 🧠 常见面试题

**Q: useEffect 和 useLayoutEffect 的区别？**  
A: useEffect 在浏览器绘制后异步执行；useLayoutEffect 在绘制前同步执行，可能阻塞渲染。

**Q: 为什么依赖数组里要包含所有用到的变量？**  
A: 遗漏依赖会导致闭包陷阱，使用到旧的 state 值。

---

## 📝 总结

- useEffect 处理副作用：订阅、定时器、请求
- 清理函数防止内存泄漏
- 依赖数组决定执行时机，不要遗漏

## 📚 延伸阅读

- [React 官方文档 - useEffect](https://react.dev/reference/react/useEffect)
