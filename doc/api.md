### Modal

声明式弹窗。基于 antd Modal，关闭请使用 `onClose`（内部映射 antd `onCancel`）。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| open | boolean | - | 是否显示 |
| onClose | function | - | 关闭回调；受控时由此改 `open` |
| title | ReactNode \| function | - | 标题；为 function 时入参含 `close` |
| children | ReactNode \| function | - | 内容；为 function 时入参含 `close` |
| onConfirm | function | - | 默认确认按钮；支持 Promise；返回 `false` 不关闭 |
| onCancel | function | - | 默认取消按钮；语义同 `onConfirm` |
| confirmText | ReactNode | - | 默认确认文案（默认 intl Confirm） |
| cancelText | ReactNode | - | 默认取消文案（默认 intl Cancel） |
| footer | ReactNode \| function \| null | - | 左侧 footer 插槽；与 `footerButtons` 均为「未设置」且 `footer === null` 时不渲染 footer |
| footerButtons | array \| function | - | 右侧按钮区，见下表；未传时为取消+确认 |
| size | `small` \| `default` \| `large` | `default` | 桌面宽度档位 |
| noPadding | boolean | false | 去掉 body 内边距。未传且 `bodyScroll={false}` 时默认视为 true；显式 `noPadding={false}` 可保留内边距 |
| maskClosable | boolean | false | 点击蒙层是否关闭 |
| closable | boolean | true | 是否显示右上角关闭 |
| bodyScroll | boolean | true | true 使用 SimpleBar；false 不挂 SimpleBar，内容自管滚动，且默认 noPadding（可用 `noPadding={false}` 覆盖） |
| mobileFullscreen | boolean | true | 移动端是否全屏 |
| getContainer | HTMLElement \| function | - | 挂载容器；嵌套时默认挂到外层 `.ant-modal-root` 外侧 |
| width / zIndex / className / afterClose / style / styles | - | - | 透传或覆盖 antd Modal |

其余未列出参数按 antd Modal 习惯透传。

#### footerButtons 项

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| children | ReactNode | - | 按钮文案 |
| type | string | - | antd Button type |
| onClick | function | - | 可返回 Promise；末参为 `targetProps`（含 `close`）；`autoClose` 且结果 `!== false` 时关闭 |
| autoClose | boolean | true | 点击后是否自动关闭 |
| display | boolean \| function | - | `false` 隐藏；function 返回值决定是否展示 |
| ButtonComponent | component | - | 自定义按钮；默认走 ButtonGroup 内 LoadingButton |
| ... | - | - | 其余透传 Button |

- `footerButtons={[]}`：不渲染按钮列（可与左侧 `footer` 并存）。**移动端**此模式且 `footer` 有内容时（如 FormModal 自带 Submit/Cancel），按钮区会自动居中，与默认 `footerButtons` 行为一致。
- `footer === null` 且未传 `footerButtons`：不渲染整个 footer 区

### useModal

命令式打开弹窗，参数同 Modal。需在 antd `App`（或 `App.useApp` 可用）上下文中使用。

#### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| modal | function | 调用后弹出 Modal；返回 `{ close }`；默认 `zIndex` 为 1100 |

### useConfirmModal

命令式确认 / 提示弹窗，底层走 antd `App.modal` 的 `confirm` / `info` / `success` / `warning` / `error`。需在 antd `App` 上下文中使用。

#### 参数

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| type | `confirm` \| `info` \| `success` \| `warning` \| `error` | `confirm` | 调用 `modal[type]` |
| title | ReactNode | - | 标题 |
| message | ReactNode | - | 正文 |
| danger | boolean | false | 为 true 时展示语义图标，确认钮危险色 |
| confirmType | `info` \| `warning` \| `error` \| `success` | `info` | `type=confirm` 时图标语义 |
| icon | ReactNode | - | 自定义图标，覆盖默认 |
| onConfirm | function | - | 映射 antd `onOk` |
| onCancel | function | - | 映射 antd `onCancel` |
| confirmText | ReactNode | - | 映射 `okText` |
| cancelText | ReactNode | - | 映射 `cancelText` |
| onClose | function | - | 调用 `close()` 时触发 |
| maskClosable | boolean | false | 默认不可点蒙层关闭 |
| getContainer | HTMLElement \| function | - | 嵌套时挂到外层 modal 外侧 |
| afterClose / zIndex / wrapClassName | - | - | 透传；默认 `zIndex` 1100 |

其余未列出参数按 antd Modal.confirm 习惯透传。

#### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| confirmModal | function | 调用后弹出确认框；返回 `{ close }` |

与 `useModal` 对比：专用于短文案确认 / 提示，桌面居中窄宽（约 400px），无 SimpleBar body。

### CSS 变量

挂在 `.modal` / `.modal-outer` 上，可业务覆盖。

| 变量 | 说明 |
|------|------|
| `--kne-modal-viewport-height` | 默认 `var(--kne-viewport-height, 100vh)` |
| `--kne-modal-viewport-width` | 默认 `var(--kne-viewport-width, 100vw)` |
| `--kne-modal-title-height` | 标题区高度贡献，默认 `48px`；无 title 为 `0` |
| `--kne-modal-footer-height` | footer 高度贡献，默认 `58px`；无 footer 为 `0` |
| `--kne-modal-viewport-gutter` | 桌面相对视口留白合计，默认 `120px`；移动全屏 `0` |
| `--kne-modal-body-padding-vertical` | body 上下 padding 合计，默认 `48px`；`noPadding` 为 `0` |
| `--kne-modal-body-padding-horizontal` | body 左右 padding 合计，默认 `48px`；`noPadding` 为 `0` |
| `--kne-modal-body-height` | body 容器高度（**不**扣 body padding） |
| `--kne-modal-content-height` | 内容高度；默认 `body-height − padding-vertical`。`bodyScroll={false}` 时在 `.modal-body` 内覆盖为 `100%`（相对 body 实高），供内部滚动容器使用 |
| `--kne-modal-body-min-height` / `--kne-modal-body-max-height` | body 容器 min/max |
| `--kne-modal-content-min-height` | content 侧 min |
| `--kne-modal-content-width` | 内容宽度契约（扣 horizontal padding） |

### 布局组合（Modal / Drawer 共用）

Tabs / N 列分栏等复杂内容区须 **`bodyScroll={false}`**，由 `ScrollRegion`（SimpleBar）分区滚动，避免与弹层 body 双层 SimpleBar。

#### TabsLayout

antd `Tabs` 封装：顶栏占 title 位（配合无 `title` 的弹层）、antd6 高度链、`destroyOnHidden` 默认 true。其余 props 透传 Tabs。

#### ColumnsLayout

固定 N 列 flex 分栏。`widths` 与 `children` 等长（如 `['36%', '1fr']`、`['200px', '1fr', '280px']`）；`'1fr'` 占剩余宽度。

#### ScrollRegion

单块 SimpleBar 滚动区，用于 Tab 面板或每一列。首列/末列背景由父级 `:first-child` / `:last-child` 选中。

- `inset`（默认 `false`）：为 `true` 时内容区增加 `16px 20px` 内边距（适合详情、概览等单列内容）
- 分栏列表左列通常保持 `inset={false}`，由列表项自行控制间距

Tabs / 分栏弹层须 **`bodyScroll={false}`**，此时默认 **noPadding**（内容贴边），以便分栏铺满 body；需要外层留白时可传 **`noPadding={false}`**。

#### modalClassNames

| 常量 | 值 | 用途 |
|------|-----|------|
| `stepsForm` | `react-modal-steps-form` | 分步弹窗挂 `className`，去横向溢出 |
| `splitter` | `react-modal-splitter` | antd Splitter 在弹层内的高度链 |

#### createModalRender

```ts
createModalRender(modalDefaults) => (hostProps) => Modal
```

仅合并 `modalDefaults` 与 `hostProps` 后渲染 Modal。宿主协议（`onCancel`→`onClose`、剥离非 Modal 字段、`footer` 函数等）由调用方在 `renderModal` 回调内完成。

推荐 `modalDefaults`：

| 场景 | modalDefaults |
|------|---------------|
| 子内容自带 Footer | `{ footerButtons: [] }` |
| 长内容 | `{ footerButtons: [], bodyScroll: true, size: 'large' }` |
| 分步弹窗 | `{ footerButtons: [], bodyScroll: true, size: 'default', className: modalClassNames.stepsForm }` |

### Drawer

声明式侧滑层。基于 antd Drawer，关闭请使用 `onClose`（内部映射 antd `onClose`）。API 与 Modal 对齐处不再重复；差异如下。

#### 属性（差异与补充）

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| placement | `left` \| `right` \| `top` \| `bottom` | `right` | 滑出方向；`size` 映射 width（left/right）或 height（top/bottom） |
| size | `small` \| `default` \| `large` | `default` | 600 / 1000 / min(vw−64, 1500) px |
| 移动端 | - | 侧滑全宽 | left/right → 100vw；top/bottom → 100vh（非 Modal 式全屏居中） |

其余 `open` / `onClose` / `title` / `children` / `footer` / `footerButtons` / `bodyScroll` / `noPadding` / `closable` / `maskClosable` / `getContainer` 等与 Modal 相同。

**FormModal**：传入的 `modalRender` 会在 Drawer 内注入 `ModalForm`，包裹整块 chrome（title / body / footer，与 Modal 的 panel 语义一致）；footer 内 Submit/Cancel 需在 Form 上下文内。

嵌套时默认挂到外层 `.ant-drawer-root` 外侧。

### useDrawer

命令式打开 Drawer，参数同 Drawer。须在 antd `App` 内挂载 **`<DrawerContextHolder />`**（对标 antd 内置 `ModalContextHolder`），签名与 `useModal` 相同：`const drawer = useDrawer(); drawer(props) → { close }`。

### Drawer CSS 变量

挂在 `.drawer` / `.drawer-outer` 上；命名 `--kne-drawer-*`，语义与 Modal 对齐（无 viewport gutter，body 占满面板高度链）。`.drawer-outer` 内 bridge `--kne-modal-content-height` 等，供共用 `ScrollRegion` / `TabsLayout` 高度链。

### createDrawerRender

```ts
createDrawerRender(drawerDefaults) => (hostProps) => Drawer
```

单参数合并渲染；宿主字段映射由 `renderModal` 回调内完成（同 `createModalRender`）。

