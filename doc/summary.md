### 概述

`@kne/react-modal` 是基于 Ant Design 的弹层组件库，提供声明式 / 命令式 **Modal** 与 **Drawer**，兼容 `footerButtons` 体系，内置 SimpleBar 滚动与移动端适配。

### 主要特性

- 声明式 / 命令式同一套 props 与 UI（Modal `useModal`；Drawer `useDrawer` + `DrawerContextHolder`；确认框 `useConfirmModal`）
- `footer` + `footerButtons`（`ButtonComponent` / `display` / `autoClose`）
- title / footer 固定在滚动外，body 默认 SimpleBar
- `--kne-modal-*` / `--kne-drawer-*` CSS 变量管理高度链
- Modal 移动端全屏；Drawer 移动端侧滑全宽
- **示例**：各场景示例顶部提供 **Modal / Drawer** 切换，同一套 props 与内容对比两种弹层
- **共用布局**：`TabsLayout`、`ColumnsLayout`、`ScrollRegion`；`createModalRender` / `createDrawerRender` 对接 renderModal 宿主

### 使用场景

列表快览、表单确认、侧滑详情、Tabs / 分栏复杂内容区均可通过布局组件组合，无需业务侧手写 SCSS。
