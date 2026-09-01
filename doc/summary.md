### 概述

`@kne/react-modal` 是基于 Ant Design Modal 的精简弹窗组件，保留声明式 `Modal` 与命令式 `useModal`，兼容 components-core Modal 常用调用（含 `footerButtons` 系统），并内置 SimpleBar 内容滚动与移动端全屏适配。

### 主要特性

- 声明式 / 命令式同一套 props 与 UI
- `footer` + `footerButtons`（`ButtonComponent` / `display` / `autoClose`）与既有用法对齐
- title / footer 固定在滚动外，body 默认 SimpleBar
- `--kne-modal-*` CSS 变量管理 body / content 高度与 padding
- 移动端全屏（`@kne/responsive-utils`）与嵌套挂载处理
- 布局组合：`ModalTabsLayout`、`ModalColumnsLayout`、`ModalScrollRegion`；`createModalRender` 对接 `renderModal` 宿主

### 使用场景

需要在不打断当前流程的前提下打开浮层处理事务、表单确认或展示长内容时使用。Tabs 顶栏、N 列分栏、分步表单等可通过布局组件与 `createModalRender` 组合，无需业务侧手写 SCSS。
