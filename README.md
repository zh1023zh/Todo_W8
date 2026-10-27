# Todo_W8 W9：TypeScript 重构与单元测试

本目录是在原 Todo_W8 事件委托练习基础上整理的 W9 代码版本，保留新增、切换、删除、编辑、事件委托和“缺陷复现版/修复版”行为。

## 环境

- Node.js 20 或更高版本
- npm

## 安装与运行

```bash
npm install
npm test
```

`npm test` 会依次：

1. 使用 TypeScript 严格模式检查源码（`strict`、`noImplicitAny`，没有使用 `any`）。
2. 将 `src/app.ts` 打包为浏览器使用的 `app.js`。
3. 运行 Vitest 单元测试，覆盖 `addTodo`、`toggleTodo`、`parseTodoId`。
4. 使用 linkedom 运行原有风格的 DOM 事件委托回归测试。

本地查看页面：

```bash
npm run build
```

然后直接用浏览器打开 `index.html`。若希望热更新开发体验，可按需再配置开发服务器；本作业不依赖开发服务器。

## 目录说明

- `src/todo.ts`：`Todo` interface、`addTodo`、`toggleTodo`、`parseTodoId` 纯函数。
- `src/app.ts`：DOM 类型约束、空值保护、事件委托和页面交互。
- `tests/todo.test.ts`：Vitest 单元测试。
- `tests/events.cjs`：DOM 事件委托回归测试。
- `app.js`：由 `npm run build` 生成的浏览器运行文件。

注意：请先在本目录执行 `npm install`、`npm test`，确认本机结果后，再把代码复制或合并进你的 `Todo_W8` 仓库，并提交 Git commit。不要把尚未运行的测试写成已通过。
