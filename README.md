<!--START_SECTION:DOC_MD-->

# react-modal

### 描述

基于 antd 的 React 弹窗组件，提供 Modal/useModal、Tabs 分栏布局与 renderModal 适配，支持 SimpleBar 滚动与移动端全屏。

### 关键词

react, modal, antd, dialog, simplebar, use-modal, footer-buttons, tabs-layout, mobile, form, component, i18n

### 安装

```shell
npm i --save @kne/react-modal
```

### 概述

#### 概述

`@kne/react-modal` 是基于 Ant Design Modal 的精简弹窗组件，保留声明式 `Modal` 与命令式 `useModal`，兼容 components-core Modal 常用调用（含 `footerButtons` 系统），并内置 SimpleBar 内容滚动与移动端全屏适配。

#### 主要特性

- 声明式 / 命令式同一套 props 与 UI
- `footer` + `footerButtons`（`ButtonComponent` / `display` / `autoClose`）与既有用法对齐
- title / footer 固定在滚动外，body 默认 SimpleBar
- `--kne-modal-*` CSS 变量管理 body / content 高度与 padding
- 移动端全屏（`@kne/responsive-utils`）与嵌套挂载处理
- 布局组合：`ModalTabsLayout`、`ModalColumnsLayout`、`ModalScrollRegion`；`createModalRender` 对接 `renderModal` 宿主

#### 使用场景

需要在不打断当前流程的前提下打开浮层处理事务、表单确认或展示长内容时使用。Tabs 顶栏、N 列分栏、分步表单等可通过布局组件与 `createModalRender` 组合，无需业务侧手写 SCSS。


### 示例

#### 示例样式

```scss
/* 示例业务 UI（布局滚动等仍用 @kne/react-modal/dist/index.css） */

.candidate-list-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.candidate-list-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s ease;

  &:hover:not(.is-active) {
    background: #fafafa;
  }

  &.is-active {
    background: #e6f4ff;
    box-shadow: inset 3px 0 0 #1677ff;
  }
}

.candidate-list-item-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.candidate-list-item-body {
  flex: 1;
  min-width: 0;
}

.candidate-list-item-title {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.4;
}

.candidate-list-item-meta {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.candidate-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.candidate-detail-name {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}

.candidate-detail-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.candidate-score-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 24px;
  margin-bottom: 20px;
}

.candidate-score-item-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

.candidate-note-block {
  padding: 12px 14px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.candidate-note-block-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: rgba(0, 0, 0, 0.88);
}

.candidate-overview-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.candidate-stat-card {
  padding: 12px 14px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.candidate-stat-value {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.88);
}

.candidate-stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.candidate-overview-section {
  padding: 16px 20px 20px;
}

.candidate-schedule-row {
  display: grid;
  grid-template-columns: 72px 1fr 88px 72px;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
}

.candidate-schedule-time {
  color: rgba(0, 0, 0, 0.45);
}

.demo-panel-hint {
  margin: 0;
  padding: 10px 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  background: #fffbe6;
  border-bottom: 1px solid #ffe58f;
}

.demo-job-preview {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  background: #fff;
}

.demo-job-preview-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f6ffed 0%, #fff 100%);
  border-bottom: 1px solid #f0f0f0;
}

.demo-job-preview-body {
  padding: 16px 20px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.7;
}
```

#### 示例代码

- 基础弹窗
- 受控打开与异步 onConfirm（loading / 成功提示）
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd)

```jsx
const { default: Modal } = _ReactModal;
const { Button, Space, message, App, Typography } = antd;
const { useState } = React;

const { Text, Paragraph } = Typography;

const BasicExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Button type="primary" onClick={() => setOpen(true)}>
        保存评估备注
      </Button>
      <Text type="secondary">最简受控弹窗：异步 onConfirm 带 loading，返回 false 可阻止关闭。</Text>
      <Modal
        title="保存评估备注"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          await new Promise(resolve => setTimeout(resolve, 800));
          message.success('备注已保存至候选人档案');
        }}
        confirmText="保存"
      >
        <Paragraph style={{ marginBottom: 8 }}>
          将把当前页面的筛选条件与评估摘要一并写入 <Text strong>陈思远</Text> 的档案备注。
        </Paragraph>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          保存后可在「候选人详情 → 操作记录」中查看历史版本。
        </Paragraph>
      </Modal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <BasicExample />
  </App>
);

render(<BaseExample />);

```

- footerButtons 与尺寸
- 岗位发布确认：size / footerButtons / 左侧 footer 插槽 / noPadding 预览
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd)

```jsx
const { default: Modal } = _ReactModal;
const { Button, Space, Radio, Tag, message, App, Typography } = antd;
const { useState } = React;

const { Text, Title, Paragraph } = Typography;

const FooterButtonsExample = () => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState('default');
  const [noPadding, setNoPadding] = useState(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div>
        <Text type="secondary">切换尺寸与 noPadding，观察岗位预览卡片与 footer 按钮区布局。</Text>
      </div>
      <Radio.Group
        value={size}
        optionType="button"
        options={[
          { label: '小号', value: 'small' },
          { label: '默认', value: 'default' },
          { label: '大号', value: 'large' }
        ]}
        onChange={e => setSize(e.target.value)}
      />
      <Space wrap>
        <Button type="primary" onClick={() => setOpen(true)}>
          发布岗位确认
        </Button>
        <Button type={noPadding ? 'primary' : 'default'} onClick={() => setNoPadding(v => !v)}>
          noPadding={String(noPadding)}
        </Button>
      </Space>
      <Modal
        title="确认发布岗位"
        size={size}
        noPadding={noPadding}
        open={open}
        onClose={() => setOpen(false)}
        footer={<Text type="secondary">发布后将同步至招聘官网与内推渠道</Text>}
        footerButtons={[
          {
            children: '存草稿',
            onClick: () => message.info('已保存草稿')
          },
          {
            children: '预览',
            display: () => size !== 'small',
            onClick: () => message.info('打开预览页')
          },
          {
            type: 'primary',
            children: '立即发布',
            onClick: async () => {
              await new Promise(resolve => setTimeout(resolve, 600));
              message.success('岗位已发布');
            }
          }
        ]}
      >
        <div className="demo-job-preview">
          <div className="demo-job-preview-header">
            <Title level={5} style={{ margin: 0 }}>
              高级前端工程师
            </Title>
            <Space size={8} style={{ marginTop: 8 }}>
              <Tag color="blue">上海</Tag>
              <Tag>25K–40K · 15 薪</Tag>
              <Tag color="green">急招</Tag>
            </Space>
          </div>
          <div className="demo-job-preview-body">
            <Paragraph style={{ marginTop: 0 }}>
              负责招聘中台、候选人评估等 B 端产品的前端交付；要求熟悉 React、工程化与组件库协作。
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              {noPadding
                ? 'noPadding=true：预览卡片应贴齐弹窗内容区边缘。'
                : 'noPadding=false：预览卡片四周保留默认内边距。'}
            </Paragraph>
          </div>
        </div>
      </Modal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <FooterButtonsExample />
  </App>
);

render(<BaseExample />);

```

- useModal 命令式
- 命令式打开候选人快览，children 函数内可 close()
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd)

```jsx
const { useModal } = _ReactModal;
const { Button, Space, message, App, Descriptions, Tag, Typography } = antd;

const { Text, Paragraph } = Typography;

const CommandExample = () => {
  const modal = useModal();

  const openDetail = () => {
    modal({
      title: '候选人快览',
      size: 'small',
      confirmText: '加入待评估',
      children: ({ close }) => (
        <div>
          <Descriptions column={1} size="small" bordered style={{ marginBottom: 12 }}>
            <Descriptions.Item label="姓名">李雨桐</Descriptions.Item>
            <Descriptions.Item label="岗位">前端工程师 · 4 年</Descriptions.Item>
            <Descriptions.Item label="来源">内推 · 张三</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color="processing">简历通过</Tag>
            </Descriptions.Item>
          </Descriptions>
          <Paragraph type="secondary" style={{ marginBottom: 12 }}>
            命令式弹窗适用于列表页「快速查看」场景；children 为函数时可调用 <Text code>close()</Text>{' '}
            主动关闭。
          </Paragraph>
          <Button size="small" onClick={() => close()}>
            关闭
          </Button>
        </div>
      ),
      onConfirm: () => {
        message.success('已加入待评估队列');
      }
    });
  };

  return (
    <Space direction="vertical">
      <Button type="primary" onClick={openDetail}>
        从列表打开候选人快览
      </Button>
      <Text type="secondary">需在 antd App 上下文中使用 useModal。</Text>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <CommandExample />
  </App>
);

render(<BaseExample />);

```

- 长内容滚动
- 面试评估纪要：默认 SimpleBar vs bodyScroll=false 自管滚动
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd)

```jsx
const { default: Modal } = _ReactModal;
const { Button, Space, App, Typography, Divider } = antd;
const { useState } = React;

const { Title, Paragraph, Text } = Typography;

const EVAL_SECTIONS = [
  {
    title: '沟通表达',
    items: [
      '表达结构清晰，能准确复述业务目标与技术约束。',
      '对追问能够给出有层次的回答，而非堆砌名词。'
    ]
  },
  {
    title: '专业深度',
    items: [
      '熟悉 React 渲染机制，能说明列表虚拟化方案选型理由。',
      '了解前端监控与错误边界在生产环境的实践。'
    ]
  },
  {
    title: '项目复杂度',
    items: [
      '参与过多团队协同的中台项目，承担核心模块 Owner。',
      '能描述需求变更下的架构演进与风险控制。'
    ]
  },
  {
    title: '协作推进',
    items: ['主动同步风险，推动联调与验收节点按时完成。']
  }
];

const EvaluationContent = () => (
  <>
    {EVAL_SECTIONS.map(section => (
      <div key={section.title} style={{ marginBottom: 20 }}>
        <Title level={5} style={{ marginTop: 0 }}>
          {section.title}
        </Title>
        {section.items.map(item => (
          <Paragraph key={item} style={{ marginBottom: 8, color: 'rgba(0,0,0,0.65)' }}>
            · {item}
          </Paragraph>
        ))}
      </div>
    ))}
    <Divider />
    <Text type="secondary">以下为填充内容，用于验证长文滚动。</Text>
    {Array.from({ length: 12 }, (_, i) => (
      <Paragraph key={i} style={{ color: 'rgba(0,0,0,0.45)' }}>
        补充记录 {i + 1}：候选人对团队文化、工作方式与交付节奏均表示认可。
      </Paragraph>
    ))}
  </>
);

const LongContentExample = () => {
  const [open, setOpen] = useState(false);
  const [openSelfScroll, setOpenSelfScroll] = useState(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Paragraph type="secondary" style={{ margin: 0 }}>
        对比默认 SimpleBar 与 bodyScroll=false 自管滚动两种长内容场景。
      </Paragraph>
      <Space wrap>
        <Button type="primary" onClick={() => setOpen(true)}>
          打开评估详情（SimpleBar）
        </Button>
        <Button onClick={() => setOpenSelfScroll(true)}>自管滚动（bodyScroll=false）</Button>
      </Space>
      <Modal
        title="陈思远 · 面试评估纪要"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {}}
        confirmText="保存纪要"
      >
        <EvaluationContent />
      </Modal>
      <Modal
        title="自管滚动示例"
        open={openSelfScroll}
        onClose={() => setOpenSelfScroll(false)}
        bodyScroll={false}
        footer={null}
      >
        <div
          style={{
            height: 'var(--kne-modal-content-height)',
            minHeight: 0,
            overflow: 'auto',
            boxSizing: 'border-box',
            background: '#fafafa'
          }}
        >
          <div style={{ padding: 20 }}>
            <Paragraph style={{ marginTop: 0 }}>
              内容区高度绑定 <Text code>--kne-modal-content-height</Text>，在 Tabs / 分栏场景同样适用。
            </Paragraph>
            <EvaluationContent />
          </div>
        </div>
      </Modal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <LongContentExample />
  </App>
);

render(<BaseExample />);

```

- 高度 CSS 变量
- Switch 对比默认/自定义 CSS 变量；色块绑定 --kne-modal-content-height，探针显示变量与 clientHeight
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd)

```jsx
const { default: Modal } = _ReactModal;
const { Button, Space, Switch, Tag, Descriptions, App } = antd;
const { useState, useEffect } = React;

const readCssVar = (el, name) => {
  if (!el) {
    return '-';
  }
  return getComputedStyle(el).getPropertyValue(name).trim() || '-';
};

const HeightProbe = ({ open, revision }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!open) {
      setMetrics(null);
      return undefined;
    }
    const timer = setTimeout(() => {
      const outer = document.querySelector('[data-testid="react-modal"]');
      const body = outer && outer.querySelector('.modal-body');
      const inner = outer && outer.querySelector('.modal-body-inner');
      const fill = outer && outer.querySelector('[data-vars-fill]');
      setMetrics({
        gutter: readCssVar(outer, '--kne-modal-viewport-gutter'),
        bodyHeightVar: readCssVar(body || outer, '--kne-modal-body-height'),
        contentHeightVar: readCssVar(inner || body || outer, '--kne-modal-content-height'),
        bodyMin: readCssVar(outer, '--kne-modal-body-min-height'),
        paddingV: readCssVar(outer, '--kne-modal-body-padding-vertical'),
        bodyClient: body ? &#96;${body.clientHeight}px&#96; : '-',
        fillClient: fill ? &#96;${fill.clientHeight}px&#96; : '-'
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [open, revision]);

  if (!metrics) {
    return <Tag>打开弹窗后显示变量与实测高度</Tag>;
  }

  return (
    <Descriptions size="small" bordered column={1} style={{ maxWidth: 640 }}>
      <Descriptions.Item label="--kne-modal-viewport-gutter">{metrics.gutter}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-body-min-height">{metrics.bodyMin}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-body-padding-vertical">{metrics.paddingV}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-body-height">{metrics.bodyHeightVar}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-content-height">{metrics.contentHeightVar}</Descriptions.Item>
      <Descriptions.Item label="body.clientHeight">{metrics.bodyClient}</Descriptions.Item>
      <Descriptions.Item label="色块 clientHeight（应≈ content-height）">{metrics.fillClient}</Descriptions.Item>
    </Descriptions>
  );
};

const fillLines = Array.from({ length: 18 }, (_, i) => &#96;填充行 ${i + 1} · 用于验证 content-height 滚动&#96;);

const HeightVarsExample = () => {
  const [open, setOpen] = useState(false);
  const [customVars, setCustomVars] = useState(true);
  const revision = &#96;${customVars}|${open}&#96;;

  const modalStyle = customVars
    ? {
        '--kne-modal-viewport-gutter': '240px',
        '--kne-modal-body-min-height': '180px',
        '--kne-modal-body-padding-vertical': '64px'
      }
    : undefined;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Space wrap align="center">
        <Switch
          checked={customVars}
          onChange={setCustomVars}
          checkedChildren="自定义变量"
          unCheckedChildren="默认变量"
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          打开弹窗对比高度
        </Button>
        <Tag color={customVars ? 'blue' : 'default'}>{customVars ? '已覆盖 CSS 变量' : '库内默认值'}</Tag>
      </Space>
      <div style={{ color: 'rgba(0,0,0,0.45)', maxWidth: 640 }}>
        通过 Modal <code>style</code> 覆盖变量（挂在 <code>.modal</code> 根上）。自定义时加大{' '}
        <code>viewport-gutter</code>、<code>body-padding-vertical</code>，body 会明显变矮；下方色块高度绑定{' '}
        <code>--kne-modal-content-height</code>，应与实测 content 高度一致。
      </div>
      <HeightProbe open={open} revision={revision} />
      <Modal
        title={customVars ? '自定义高度 CSS 变量' : '默认高度 CSS 变量'}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {}}
        bodyScroll={false}
        noPadding={false}
        style={modalStyle}
      >
        <div
          data-vars-fill
          style={{
            height: 'var(--kne-modal-content-height)',
            minHeight: 0,
            overflow: 'auto',
            boxSizing: 'border-box',
            background: customVars ? '#fff1f0' : '#e6f4ff',
            border: customVars ? '2px solid #ff4d4f' : '2px solid #1677ff'
          }}
        >
          <div style={{ padding: 12 }}>
            <p style={{ marginTop: 0, fontWeight: 600 }}>
              色块 height = var(--kne-modal-content-height)。切换「自定义/默认」后重新打开，对比色块高度与左侧探针数值。
            </p>
            {customVars ? (
              <p style={{ margin: '0 0 8px' }}>
                当前覆盖：gutter 240px（默认 120px）、padding-vertical 64px（默认 48px）、body-min-height
                180px。
              </p>
            ) : (
              <p style={{ margin: '0 0 8px' }}>未传 style，使用库内 calc 与 size 默认 min-height。</p>
            )}
            {fillLines.map(text => (
              <p key={text} style={{ margin: '4px 0' }}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </Modal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <HeightVarsExample />
  </App>
);

render(<BaseExample />);

```

- title / footer / noPadding 高度探针
- 切换 title 空/有、footer=null、footerButtons=[]、noPadding auto/true/false、bodyScroll，实测 body 与 content 高度变量与 clientHeight
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd)

```jsx
const { default: Modal } = _ReactModal;
const { Button, Space, Switch, Radio, Tag, Descriptions, App } = antd;
const { useState, useEffect } = React;

const readCssVar = (el, name) => {
  if (!el) {
    return '-';
  }
  return getComputedStyle(el).getPropertyValue(name).trim() || '-';
};

const HeightProbe = ({ open, revision }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!open) {
      setMetrics(null);
      return undefined;
    }
    const timer = setTimeout(() => {
      const outer = document.querySelector('[data-testid="react-modal"]');
      const body = outer && outer.querySelector('.modal-body');
      const inner = outer && outer.querySelector('.modal-body-inner');
      const scrollHost = outer && outer.querySelector('[data-height-scroll-host]');
      setMetrics({
        outerClass: outer ? outer.className : '-',
        bodyHeightVar: readCssVar(body || outer, '--kne-modal-body-height'),
        contentHeightVar: readCssVar(inner || body || outer, '--kne-modal-content-height'),
        paddingV: readCssVar(outer, '--kne-modal-body-padding-vertical'),
        paddingH: readCssVar(outer, '--kne-modal-body-padding-horizontal'),
        titleH: readCssVar(outer, '--kne-modal-title-height'),
        footerH: readCssVar(outer, '--kne-modal-footer-height'),
        bodyClient: body ? &#96;${body.clientHeight}px&#96; : '-',
        innerClient: inner ? &#96;${inner.clientHeight}px&#96; : '-',
        scrollClient: scrollHost ? &#96;${scrollHost.clientHeight}px&#96; : '-'
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [open, revision]);

  if (!metrics) {
    return <Tag>打开弹窗后显示实测高度</Tag>;
  }

  return (
    <Descriptions size="small" bordered column={1} style={{ maxWidth: 640 }}>
      <Descriptions.Item label="outer class">{metrics.outerClass}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-title-height">{metrics.titleH}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-footer-height">{metrics.footerH}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-body-padding-vertical">{metrics.paddingV}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-body-padding-horizontal">{metrics.paddingH}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-body-height">{metrics.bodyHeightVar}</Descriptions.Item>
      <Descriptions.Item label="--kne-modal-content-height">{metrics.contentHeightVar}</Descriptions.Item>
      <Descriptions.Item label="body.clientHeight">{metrics.bodyClient}</Descriptions.Item>
      <Descriptions.Item label="body-inner.clientHeight">{metrics.innerClient}</Descriptions.Item>
      <Descriptions.Item label="scrollHost.clientHeight">{metrics.scrollClient}</Descriptions.Item>
    </Descriptions>
  );
};

const ChromeHeightExample = () => {
  const [open, setOpen] = useState(false);
  const [hasTitle, setHasTitle] = useState(true);
  const [footerMode, setFooterMode] = useState('default'); // default | null | emptyButtons
  const [bodyScroll, setBodyScroll] = useState(false);
  const [noPaddingMode, setNoPaddingMode] = useState('auto'); // auto | true | false
  const revision = [hasTitle, footerMode, bodyScroll, noPaddingMode, open].join('|');

  const noPaddingProp =
    noPaddingMode === 'auto' ? undefined : noPaddingMode === 'true';

  const modalProps = {
    open,
    onClose: () => setOpen(false),
    bodyScroll,
    ...(hasTitle ? { title: '候选人评估 · 高度调试' } : {}),
    ...(noPaddingProp === undefined ? {} : { noPadding: noPaddingProp })
  };

  if (footerMode === 'null') {
    modalProps.footer = null;
  } else if (footerMode === 'emptyButtons') {
    modalProps.footer = <span>仅左侧 footer，按钮为空数组</span>;
    modalProps.footerButtons = [];
  } else {
    modalProps.onConfirm = () => {};
  }

  const openModal = () => {
    setOpen(true);
  };

  const lines = Array.from({ length: 24 }, (_, i) => &#96;行 ${i + 1} · 用于观察滚动与高度是否贴齐&#96;);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Space wrap align="center">
        <span>title</span>
        <Switch checked={hasTitle} onChange={setHasTitle} checkedChildren="有" unCheckedChildren="空" />
        <span>bodyScroll</span>
        <Switch
          checked={bodyScroll}
          onChange={setBodyScroll}
          checkedChildren="true"
          unCheckedChildren="false"
        />
      </Space>
      <div>
        <div style={{ marginBottom: 8 }}>footer</div>
        <Radio.Group
          value={footerMode}
          optionType="button"
          options={[
            { label: '默认按钮', value: 'default' },
            { label: 'footer=null（无 footer 区）', value: 'null' },
            { label: 'footerButtons=[]', value: 'emptyButtons' }
          ]}
          onChange={e => setFooterMode(e.target.value)}
        />
      </div>
      <div>
        <div style={{ marginBottom: 8 }}>noPadding</div>
        <Radio.Group
          value={noPaddingMode}
          optionType="button"
          options={[
            { label: '未传（auto）', value: 'auto' },
            { label: 'true', value: 'true' },
            { label: 'false', value: 'false' }
          ]}
          onChange={e => setNoPaddingMode(e.target.value)}
        />
        <div style={{ marginTop: 8, color: 'rgba(0,0,0,0.45)' }}>
          bodyScroll=false 且未传 noPadding 时默认去掉内边距；显式 false 可保留 padding 观察差异。
        </div>
      </div>
      <Space wrap>
        <Button type="primary" onClick={openModal}>
          打开评估弹窗并测量
        </Button>
        <Tag>hasTitle={String(hasTitle)}</Tag>
        <Tag>footerMode={footerMode}</Tag>
        <Tag>bodyScroll={String(bodyScroll)}</Tag>
        <Tag>
          noPadding=
          {noPaddingProp === undefined ? 'undefined(auto)' : String(noPaddingProp)}
        </Tag>
      </Space>
      <HeightProbe open={open} revision={revision} />
      <Modal {...modalProps}>
        {bodyScroll === false ? (
          <div
            data-height-scroll-host
            style={{
              height: 'var(--kne-modal-content-height)',
              minHeight: 0,
              overflow: 'auto',
              boxSizing: 'border-box',
              background: noPaddingProp === false ? '#fff7e6' : '#e6f4ff',
              border: noPaddingProp === false ? '2px dashed #fa8c16' : '2px dashed #1677ff'
            }}
          >
            <div style={{ padding: 12 }}>
              <p style={{ marginTop: 0, fontWeight: 600 }}>
                滚动宿主使用 height: var(--kne-modal-content-height)。蓝/橙底应与 body
                内容区同高；footer=null 时 footer 变量应为 0。
              </p>
              {lines.map(text => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
        ) : (
          <div
            data-height-scroll-host
            style={{
              background: noPaddingProp ? '#e6f4ff' : '#fff7e6',
              border: noPaddingProp ? '2px dashed #1677ff' : '2px dashed #fa8c16',
              minHeight: 120
            }}
          >
            <div style={{ padding: 12 }}>
              <p style={{ marginTop: 0, fontWeight: 600 }}>SimpleBar 模式：看色块是否贴边判断 noPadding。</p>
              {lines.slice(0, 8).map(text => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <ChromeHeightExample />
  </App>
);

render(<BaseExample />);

```

- 批量候选人评估（Tabs + 分栏）
- HR 批量面试评估：左列表右详情、搜索筛选、维度评分；固定分栏 / Splitter / 批次概览
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd),(@kne/current-lib_react-modal/doc/style.scss)

```jsx
const {
  default: Modal,
  ModalTabsLayout,
  ModalColumnsLayout,
  ModalScrollRegion,
  modalClassNames
} = _ReactModal;
const {
  Button,
  Space,
  Splitter,
  Input,
  Avatar,
  Tag,
  Descriptions,
  Progress,
  Typography,
  Divider,
  App,
  message
} = antd;
const { useState, useMemo } = React;

const { Text, Title, Paragraph } = Typography;

const STATUS_MAP = {
  pending: { label: '待评估', color: 'orange' },
  passed: { label: '已通过', color: 'success' },
  hold: { label: '待定', color: 'processing' }
};

const CANDIDATES = [
  {
    key: '1',
    name: '陈思远',
    role: '高级前端工程师',
    years: 6,
    city: '上海',
    edu: '浙江大学 · 本科',
    status: 'pending',
    interviewer: '王面试官',
    scores: { comm: 4, tech: 5, project: 4, collab: 4 },
    summary: '主导过设计系统与性能治理，对 React 生态和工程化有较深实践。',
    notes: [
      { title: '技术深度', body: '能清晰描述虚拟列表、并发特性在项目中的落地方式，并给出可量化的性能收益。' },
      { title: '协作推进', body: '跨端联调经验充足，曾推动组件库在 3 条业务线统一接入。' },
      { title: '待确认', body: '对 Node 中间层经验相对薄弱，需二面补充后端协作场景。' }
    ]
  },
  {
    key: '2',
    name: '李雨桐',
    role: '前端工程师',
    years: 4,
    city: '上海',
    edu: '同济大学 · 硕士',
    status: 'passed',
    interviewer: '赵面试官',
    scores: { comm: 5, tech: 4, project: 4, collab: 5 },
    summary: '表达结构清晰，B 端复杂表单与权限场景经验丰富。',
    notes: [
      { title: '项目经验', body: '负责过审批流配置平台，熟悉动态表单、状态机与低代码接入。' },
      { title: '综合评价', body: '建议通过，可安排 HR 谈薪。' }
    ]
  },
  {
    key: '3',
    name: '周亦凡',
    role: '资深前端',
    years: 8,
    city: '杭州',
    edu: '华中科技大学 · 本科',
    status: 'hold',
    interviewer: '王面试官',
    scores: { comm: 3, tech: 5, project: 5, collab: 3 },
    summary: '技术栈匹配度高，但管理岗预期与当前编制不完全一致。',
    notes: [
      { title: '优势', body: '架构视野好，有微前端与监控体系从 0 到 1 经验。' },
      { title: '风险', body: '期望职级偏高，需与部门负责人对齐编制与职责范围。' }
    ]
  },
  {
    key: '4',
    name: '张可欣',
    role: 'React 开发',
    years: 3,
    city: '上海',
    edu: '华东师范大学 · 本科',
    status: 'pending',
    interviewer: '待分配',
    scores: { comm: 4, tech: 3, project: 3, collab: 4 },
    summary: '基础扎实，学习意愿强，适合参与组件库与文档建设。',
    notes: [{ title: '初面印象', body: 'Coding 完成度较好，需进一步考察复杂状态管理与性能排查。' }]
  },
  {
    key: '5',
    name: '刘浩然',
    role: '全栈工程师',
    years: 5,
    city: '深圳',
    edu: '中山大学 · 本科',
    status: 'passed',
    interviewer: '陈面试官',
    scores: { comm: 4, tech: 4, project: 4, collab: 4 },
    summary: '前后端均可独立交付，适合业务闭环小团队。',
    notes: [{ title: '备注', body: '可优先推进 offer，期望 4 月到岗。' }]
  },
  {
    key: '6',
    name: '赵一鸣',
    role: '前端工程师',
    years: 2,
    city: '上海',
    edu: '上海大学 · 本科',
    status: 'pending',
    interviewer: '待分配',
    scores: { comm: 3, tech: 3, project: 2, collab: 3 },
    summary: '初级候选人，项目复杂度一般，建议放入人才池观察。',
    notes: [{ title: '初筛', body: '基础题通过，项目细节描述不够深入。' }]
  },
  {
    key: '7',
    name: '孙雅琪',
    role: '高级前端',
    years: 7,
    city: '北京',
    edu: '北京邮电大学 · 硕士',
    status: 'hold',
    interviewer: '王面试官',
    scores: { comm: 4, tech: 5, project: 4, collab: 4 },
    summary: '技术匹配，但地域需确认是否接受 base 上海。',
    notes: [{ title: '跟进', body: '已发送 relocate 意愿确认邮件。' }]
  },
  {
    key: '8',
    name: '吴承泽',
    role: '前端架构师',
    years: 10,
    city: '上海',
    edu: '上海交通大学 · 硕士',
    status: 'passed',
    interviewer: '总监面',
    scores: { comm: 5, tech: 5, project: 5, collab: 5 },
    summary: '综合表现优秀，建议进入终面委员会评审。',
    notes: [
      { title: '架构能力', body: '对团队工程规范、发布流程、质量门禁有体系化方法论。' },
      { title: '下一步', body: '安排与研发负责人终面。' }
    ]
  }
];

const EXTRA_CANDIDATES = Array.from({ length: 12 }, (_, i) => ({
  key: String(i + 9),
  name: &#96;候选人 ${i + 9}&#96;,
  role: i % 2 === 0 ? '前端工程师' : '高级前端',
  years: 2 + (i % 6),
  city: ['上海', '杭州', '深圳'][i % 3],
  edu: '本科',
  status: ['pending', 'passed', 'hold'][i % 3],
  interviewer: '待分配',
  scores: { comm: 3 + (i % 3), tech: 3 + (i % 2), project: 3, collab: 3 },
  summary: '批量导入的待评估候选人，用于验证左侧列表滚动与选中切换。',
  notes: [{ title: '系统备注', body: '暂无详细评估记录，请安排初面后补充。' }]
}));

const ALL_CANDIDATES = [...CANDIDATES, ...EXTRA_CANDIDATES];

const SCORE_LABELS = {
  comm: '沟通表达',
  tech: '专业深度',
  project: '项目复杂度',
  collab: '协作推进'
};

const CandidateList = ({ items, activeKey, onSelect, search, onSearchChange }) => (
  <>
    <div className="modal-scroll-region-sticky candidate-list-toolbar">
      <Input
        allowClear
        placeholder="搜索姓名、岗位、城市…"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
      <Text type="secondary">本批 {items.length} 人 · 点击切换右侧详情</Text>
    </div>
    {items.map(item => {
      const status = STATUS_MAP[item.status] || STATUS_MAP.pending;
      return (
        <div
          key={item.key}
          className={&#96;candidate-list-item${item.key === activeKey ? ' is-active' : ''}&#96;}
          onClick={() => onSelect(item.key)}
        >
          <div className="candidate-list-item-main">
            <Avatar style={{ backgroundColor: item.key === activeKey ? '#1677ff' : '#87d068' }}>
              {item.name.slice(-2)}
            </Avatar>
            <div className="candidate-list-item-body">
              <div className="candidate-list-item-title">{item.name}</div>
              <div className="candidate-list-item-meta">
                {item.role} · {item.years} 年 · {item.city}
              </div>
            </div>
            <Tag color={status.color} style={{ margin: 0 }}>
              {status.label}
            </Tag>
          </div>
        </div>
      );
    })}
  </>
);

const CandidateDetail = ({ candidate }) => {
  if (!candidate) {
    return null;
  }
  const status = STATUS_MAP[candidate.status] || STATUS_MAP.pending;
  const avgScore =
    Object.values(candidate.scores).reduce((a, b) => a + b, 0) / Object.values(candidate.scores).length;

  return (
    <div className="candidate-detail">
      <div className="candidate-detail-header">
        <div>
          <Title level={4} className="candidate-detail-name">
            {candidate.name}
          </Title>
          <div className="candidate-detail-sub">
            <Tag>{candidate.role}</Tag>
            <Tag>{candidate.years} 年经验</Tag>
            <Tag>{candidate.city}</Tag>
            <Tag color={status.color}>{status.label}</Tag>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text type="secondary">综合</Text>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#1677ff', lineHeight: 1.2 }}>
            {avgScore.toFixed(1)}
          </div>
        </div>
      </div>

      <Descriptions size="small" bordered column={2} style={{ marginBottom: 20 }}>
        <Descriptions.Item label="学历">{candidate.edu}</Descriptions.Item>
        <Descriptions.Item label="面试官">{candidate.interviewer}</Descriptions.Item>
        <Descriptions.Item label="摘要" span={2}>
          {candidate.summary}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" plain style={{ margin: '0 0 12px' }}>
        维度评分
      </Divider>
      <div className="candidate-score-grid">
        {Object.entries(candidate.scores).map(([key, value]) => (
          <div key={key}>
            <div className="candidate-score-item-label">
              <span>{SCORE_LABELS[key]}</span>
              <span>{value} / 5</span>
            </div>
            <Progress percent={value * 20} showInfo={false} strokeColor="#1677ff" size="small" />
          </div>
        ))}
      </div>

      <Divider orientation="left" plain style={{ margin: '0 0 12px' }}>
        面试记录
      </Divider>
      {candidate.notes.map(note => (
        <div key={note.title} className="candidate-note-block">
          <div className="candidate-note-block-title">{note.title}</div>
          <Paragraph style={{ margin: 0, color: 'rgba(0,0,0,0.65)' }}>{note.body}</Paragraph>
        </div>
      ))}
    </div>
  );
};

const useCandidatePanel = () => {
  const [active, setActive] = useState(ALL_CANDIDATES[0].key);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return ALL_CANDIDATES;
    }
    return ALL_CANDIDATES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [search]);

  const current = filtered.find(item => item.key === active) || filtered[0];

  return { active, setActive, search, setSearch, filtered, current };
};

const ColumnsPane = () => {
  const { setActive, search, setSearch, filtered, current } = useCandidatePanel();

  return (
    <ModalColumnsLayout widths={['34%', '1fr']}>
      <ModalScrollRegion>
        <CandidateList
          items={filtered}
          activeKey={current?.key}
          onSelect={setActive}
          search={search}
          onSearchChange={setSearch}
        />
      </ModalScrollRegion>
      <ModalScrollRegion inset>
        <CandidateDetail candidate={current} />
      </ModalScrollRegion>
    </ModalColumnsLayout>
  );
};

const SplitterPane = () => {
  const { setActive, search, setSearch, filtered, current } = useCandidatePanel();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <p className="demo-panel-hint">可拖拽中间分隔条调整列表宽度，左右列仍各自 SimpleBar 滚动。</p>
      <Splitter
        className={modalClassNames.splitter}
        style={{ flex: 1, minHeight: 0 }}
        defaultSize="34%"
        min="240"
        max="52%"
      >
        <Splitter.Panel>
          <ModalScrollRegion>
            <CandidateList
              items={filtered}
              activeKey={current?.key}
              onSelect={setActive}
              search={search}
              onSearchChange={setSearch}
            />
          </ModalScrollRegion>
        </Splitter.Panel>
        <Splitter.Panel>
          <ModalScrollRegion inset>
            <CandidateDetail candidate={current} />
          </ModalScrollRegion>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

const OverviewPane = () => {
  const stats = useMemo(() => {
    const pending = ALL_CANDIDATES.filter(c => c.status === 'pending').length;
    const passed = ALL_CANDIDATES.filter(c => c.status === 'passed').length;
    const hold = ALL_CANDIDATES.filter(c => c.status === 'hold').length;
    return { total: ALL_CANDIDATES.length, pending, passed, hold };
  }, []);

  const schedule = [
    { time: '09:30', name: '陈思远', role: '高级前端', room: 'A301', status: 'pending' },
    { time: '10:30', name: '李雨桐', role: '前端', room: 'A301', status: 'passed' },
    { time: '14:00', name: '周亦凡', role: '资深前端', room: 'B208', status: 'hold' },
    { time: '15:30', name: '张可欣', role: 'React', room: 'B208', status: 'pending' },
    { time: '16:30', name: '吴承泽', role: '架构师', room: '总监室', status: 'passed' }
  ];

  return (
    <ModalScrollRegion>
      <div className="candidate-overview-stats">
        {[
          { label: '本批人数', value: stats.total },
          { label: '待评估', value: stats.pending },
          { label: '已通过', value: stats.passed },
          { label: '待定', value: stats.hold }
        ].map(item => (
          <div key={item.label} className="candidate-stat-card">
            <div className="candidate-stat-value">{item.value}</div>
            <div className="candidate-stat-label">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="candidate-overview-section">
        <Title level={5} style={{ marginTop: 0 }}>
          今日面试安排
        </Title>
        <div className="candidate-schedule-row" style={{ fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>
          <span>时间</span>
          <span>候选人</span>
          <span>会议室</span>
          <span>状态</span>
        </div>
        {schedule.map(row => {
          const status = STATUS_MAP[row.status];
          return (
            <div key={row.time + row.name} className="candidate-schedule-row">
              <span className="candidate-schedule-time">{row.time}</span>
              <span>
                {row.name}
                <Text type="secondary"> · {row.role}</Text>
              </span>
              <span>{row.room}</span>
              <Tag color={status.color} style={{ margin: 0, justifySelf: 'start' }}>
                {status.label}
              </Tag>
            </div>
          );
        })}
        <Divider />
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          概览 Tab 同样使用 ModalScrollRegion：批次统计与日程较长时在本面板内滚动，不影响 Tabs 顶栏与底部操作区。
        </Paragraph>
        {Array.from({ length: 6 }, (_, i) => (
          <Paragraph key={i} style={{ marginBottom: 8, color: 'rgba(0,0,0,0.45)' }}>
            备注 {i + 1}：终面委员会会议安排在周五 15:00，需提前汇总已通过候选人材料。
          </Paragraph>
        ))}
      </div>
    </ModalScrollRegion>
  );
};

const ExtendLayoutExample = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('columns');

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <div>
        <Button type="primary" onClick={() => setOpen(true)}>
          打开批量评估弹窗
        </Button>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          模拟 HR 批量面试评估：Tabs 占 title 位，左列表右详情，支持固定分栏 / 可调 Splitter / 批次概览。
        </Paragraph>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        bodyScroll={false}
        size="large"
        onConfirm={async () => {
          await new Promise(r => setTimeout(r, 400));
          message.success('本批评估已保存');
        }}
        confirmText="保存本批评估"
        cancelText="稍后处理"
      >
        <ModalTabsLayout
          activeKey={tab}
          onChange={setTab}
          items={[
            { key: 'columns', label: '候选人', children: <ColumnsPane /> },
            { key: 'split', label: '可调分栏', children: <SplitterPane /> },
            { key: 'overview', label: '批次概览', children: <OverviewPane /> }
          ]}
        />
      </Modal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <ExtendLayoutExample />
  </App>
);

render(<BaseExample />);

```

- useModal 内再开声明式 Modal
- 导出评估报告：外层 useModal + 内层字段选择 Modal（嵌套 hoist）
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),antd(antd)

```jsx
const { default: Modal, useModal } = _ReactModal;
const { Button, Space, Typography, Tag, App, message, Checkbox } = antd;
const { useState, useEffect } = React;
const { Text, Paragraph, Title } = Typography;

const EXPORT_FIELDS = [
  { label: '基本信息', value: 'basic' },
  { label: '维度评分', value: 'scores' },
  { label: '面试记录', value: 'notes' },
  { label: '附件简历', value: 'resume' }
];

const NestProbe = ({ open }) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!open) {
      setInfo(null);
      return;
    }
    const id = window.setTimeout(() => {
      const titles = Array.from(document.querySelectorAll('.ant-modal-root .modal-title'));
      const outerTitle = titles.find(el => el.textContent === '导出评估报告');
      const innerTitle = titles.find(el => el.textContent === '选择导出字段');
      const outerRoot = outerTitle?.closest('.ant-modal-root');
      const innerRoot = innerTitle?.closest('.ant-modal-root');
      const outerBody = outerRoot?.querySelector('.ant-modal-body');
      const outerZ = Number(outerRoot?.querySelector('.ant-modal-wrap')?.style?.zIndex || 0);
      const innerZ = Number(innerRoot?.querySelector('.ant-modal-wrap')?.style?.zIndex || 0);
      const hoisted = !!(innerRoot && outerBody && !outerBody.contains(innerRoot));
      setInfo({ hoisted, outerZ, innerZ });
    }, 50);
    return () => window.clearTimeout(id);
  }, [open]);

  if (!info) {
    return <Text type="secondary">打开内层后显示挂载探针</Text>;
  }

  return (
    <Space direction="vertical" size={4}>
      <span>
        内层挂载位置：
        <Tag color={info.hoisted ? 'success' : 'error'} style={{ marginLeft: 8 }}>
          {info.hoisted ? '外层 modal-root 外侧' : '异常'}
        </Tag>
      </span>
      <Text type="secondary">zIndex 外层 {info.outerZ} / 内层 {info.innerZ}（antd 管理）</Text>
    </Space>
  );
};

const ExportFieldPicker = () => {
  const [innerOpen, setInnerOpen] = useState(false);
  const [checked, setChecked] = useState(['basic', 'scores', 'notes']);

  return (
    <div>
      <Paragraph>
        已选择本批 <Text strong>8</Text> 位候选人。导出前可勾选需要写入 PDF 的字段；内层声明式{' '}
        <Text code>Modal</Text> 会自动 hoist，无需手动指定容器。
      </Paragraph>
      <Space>
        <Button type="primary" onClick={() => setInnerOpen(true)}>
          配置导出字段
        </Button>
        <Text type="secondary">已选 {checked.length} 项</Text>
      </Space>
      <div style={{ marginTop: 12 }}>
        <NestProbe open={innerOpen} />
      </div>
      <Modal
        title="选择导出字段"
        open={innerOpen}
        size="small"
        onClose={() => setInnerOpen(false)}
        onConfirm={() => {
          message.success(&#96;将导出：${checked.join('、')}&#96;);
          setInnerOpen(false);
        }}
        confirmText="确认字段"
      >
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          options={EXPORT_FIELDS}
          value={checked}
          onChange={setChecked}
        />
      </Modal>
    </div>
  );
};

const NestedModalExample = () => {
  const modal = useModal();

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Button
        type="primary"
        onClick={() => {
          modal({
            title: '导出评估报告',
            size: 'default',
            children: <ExportFieldPicker />,
            onConfirm: () => message.success('报告已进入生成队列'),
            confirmText: '开始导出'
          });
        }}
      >
        导出本批评估（嵌套弹窗）
      </Button>
      <Text type="secondary">外层 useModal + 内层声明式 Modal：关闭内层不影响外层。</Text>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <NestedModalExample />
  </App>
);

render(<BaseExample />);

```

- FormInfo FormModal + renderModal
- 超长表单：用 @kne/react-modal 重写 renderModal，验收 title/footer 固定与 body SimpleBar 滚动（可关 bodyScroll 对比）
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),_FormInfo(@kne/form-info)[import * as _FormInfo from "@kne/form-info"],(@kne/form-info/dist/index.css),antd(antd)

```jsx
const { createModalRender } = _ReactModal;
const { default: FormInfo, FormModal, Input, TextArea } = _FormInfo;
const { Button, Space, Typography, App, message, Switch, Flex } = antd;
const { useState, useMemo } = React;
const { Text, Paragraph } = Typography;

const SECTION_DEFS = [
  {
    key: 'basic',
    title: '基本信息',
    fields: [
      ['name', '姓名', 'REQ'],
      ['employeeNo', '工号', 'REQ'],
      ['department', '部门', 'REQ'],
      ['position', '职位', 'REQ'],
      ['phone', '手机号', 'REQ TEL'],
      ['email', '邮箱', 'EMAIL'],
      ['city', '工作城市', 'REQ'],
      ['manager', '直属上级', '']
    ]
  },
  {
    key: 'interview',
    title: '面试评估',
    fields: [
      ['commScore', '沟通表达', 'REQ'],
      ['techScore', '专业深度', 'REQ'],
      ['projectScore', '项目复杂度', 'REQ'],
      ['collabScore', '协作推进', 'REQ'],
      ['cultureScore', '文化匹配', 'REQ'],
      ['overallScore', '综合评分', 'REQ']
    ]
  },
  {
    key: 'experience',
    title: '经历与补充',
    fields: Array.from({ length: 16 }, (_, i) => [
      &#96;expField${i + 1}&#96;,
      &#96;经历补充项 ${i + 1}&#96;,
      i % 4 === 0 ? 'REQ' : ''
    ])
  }
];

const buildInitialData = () => {
  const data = {
    name: '张三',
    employeeNo: 'E20240018',
    department: '研发中心',
    position: '高级前端',
    phone: '13800138000',
    email: 'zhangsan@company.com',
    city: '上海',
    manager: '李四',
    commScore: '4',
    techScore: '5',
    projectScore: '4',
    collabScore: '4',
    cultureScore: '5',
    overallScore: '4.5',
    summary:
      '沟通清晰，项目推进稳定。以下为加长评估说明，用于验证弹窗 body 在超长表单下的 SimpleBar 滚动：标题与底部按钮应固定，仅中间表单区域滚动。'.repeat(3)
  };
  SECTION_DEFS[2].fields.forEach(([name], i) => {
    data[name] = &#96;补充说明内容 ${i + 1}：用于拉长表单高度。&#96;;
  });
  return data;
};

const LongFormFields = () => (
  <Flex vertical gap={16}>
    {SECTION_DEFS.map(section => (
      <FormInfo
        key={section.key}
        bordered
        title={section.title}
        column={2}
        gap={20}
        list={section.fields.map(([name, label, rule]) => (
          <Input key={name} name={name} label={label} rule={rule || undefined} />
        ))}
      />
    ))}
    <FormInfo
      bordered
      title="评估摘要（长文本）"
      column={1}
      gap={20}
      list={[
        <TextArea key="summary" name="summary" label="综合评语" rule="REQ" block />,
        <TextArea
          key="risk"
          name="risk"
          label="风险与待跟进"
          block
          placeholder="列出风险点、待确认事项等"
        />,
        <TextArea
          key="plan"
          name="plan"
          label="入职 / 下轮计划"
          block
          placeholder="试用期目标、面试官建议等"
        />
      ]}
    />
    {Array.from({ length: 8 }, (_, block) => (
      <FormInfo
        key={&#96;extra-${block}&#96;}
        bordered
        title={&#96;附加问卷 ${block + 1}&#96;}
        column={2}
        gap={20}
        list={Array.from({ length: 6 }, (_, i) => {
          const name = &#96;q${block + 1}_${i + 1}&#96;;
          return <Input key={name} name={name} label={&#96;问题 ${block + 1}.${i + 1}&#96;} />;
        })}
      />
    ))}
  </Flex>
);

const FormInfoModalExample = () => {
  const [open, setOpen] = useState(false);
  const [bodyScroll, setBodyScroll] = useState(true);
  const initialData = useMemo(() => buildInitialData(), []);

  const renderModalBase = createModalRender({
    footerButtons: [],
    bodyScroll: true,
    size: 'large'
  });

  const renderModal = ({
    formProps,
    saveText,
    autoClose,
    onCancel,
    footer,
    modalRender,
    children,
    ...props
  }) =>
    renderModalBase({
      ...props,
      bodyScroll,
      onClose: onCancel,
      footer: typeof footer === 'function' ? footer() : footer,
      modalRender,
      children
    });

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button type="primary" onClick={() => setOpen(true)}>
          打开深度评估表单（FormModal）
        </Button>
        <Space>
          <Text type="secondary">bodyScroll</Text>
          <Switch checked={bodyScroll} onChange={setBodyScroll} checkedChildren="开" unCheckedChildren="关" />
        </Space>
      </Space>
      <Text type="secondary">
        createModalRender 注入 Modal 默认 props；form-info 宿主字段与 onCancel→onClose 在 renderModal 内映射。
      </Text>

      <FormModal
        title="候选人深度评估（超长表单）"
        open={open}
        onCancel={() => setOpen(false)}
        renderModal={renderModal}
        okText="保存评估"
        cancelText="取消"
        width={1000}
        formProps={{
          data: initialData,
          onSubmit: async data => {
            await new Promise(resolve => setTimeout(resolve, 500));
            message.success(&#96;已保存：${data.name}（共 ${Object.keys(data).length} 个字段）&#96;);
          }
        }}
      >
        <LongFormFields />
      </FormModal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <FormInfoModalExample />
  </App>
);

render(<BaseExample />);

```

- FormStepsModal + renderModal
- 分步表单：FormStepsModal 在 modalProps 中传 renderModal；步骤内 FormInfo gap + Flex 垂直间距
- _ReactModal(@kne/current-lib_react-modal)[import * as _ReactModal from "@kne/react-modal"],(@kne/current-lib_react-modal/dist/index.css),_FormInfo(@kne/form-info)[import * as _FormInfo from "@kne/form-info"],(@kne/form-info/dist/index.css),antd(antd)

```jsx
const { createModalRender, modalClassNames } = _ReactModal;
const { default: FormInfo, FormStepsModal, List, Input, TextArea } = _FormInfo;
const { Button, Space, Typography, App, message, Flex } = antd;
const { useState } = React;
const { Text } = Typography;

const renderStepsModalBase = createModalRender({
  footerButtons: [],
  bodyScroll: true,
  size: 'default',
  className: modalClassNames.stepsForm
});

const renderStepsModal = ({
  formProps,
  saveText,
  autoClose,
  onCancel,
  footer,
  modalRender,
  children,
  className,
  ...props
}) =>
  renderStepsModalBase({
    ...props,
    className,
    onClose: onCancel,
    footer: typeof footer === 'function' ? footer() : footer,
    modalRender,
    children
  });

const STEP_DATA = {
  name: '李四',
  employeeNo: 'E20240023',
  department: '产品部',
  phone: '13900139000',
  email: 'lisi@company.com',
  years: '6',
  position: '高级产品经理',
  commScore: '4',
  techScore: '4',
  projectScore: '5',
  summary: '产品规划清晰，跨团队推进能力强。',
  workExperience: [
    {
      companyName: '某互联网公司',
      role: '产品经理',
      years: '3年'
    }
  ],
  objectives: '1. 独立负责核心模块\n2. 推动跨部门协作\n3. 三个月内熟悉业务',
  risks: '对行业业务理解仍需加深'
};

const FormInfoStepsModalExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        打开分步评估（FormStepsModal）
      </Button>
      <Text type="secondary">
        三步完成候选人评估：基本信息 → 维度评分 → 经历与结论。
      </Text>

      <FormStepsModal
        autoStep
        completeText="提交评估"
        nextText="下一步"
        onComplete={async allData => {
          await new Promise(resolve => setTimeout(resolve, 600));
          message.success(&#96;已提交 ${allData.length} 步数据&#96;);
        }}
        modalProps={{
          open,
          title: '候选人评估（分步）',
          width: 900,
          onCancel: () => setOpen(false),
          renderModal: renderStepsModal
        }}
        items={[
          {
            title: '基本信息',
            formProps: { data: STEP_DATA },
            children: (
              <Flex vertical gap={16}>
                <FormInfo
                  bordered
                  title="候选人信息"
                  column={2}
                  gap={20}
                  list={[
                    <Input name="name" label="姓名" rule="REQ" />,
                    <Input name="employeeNo" label="工号" rule="REQ" disabled />,
                    <Input name="department" label="部门" rule="REQ" />,
                    <Input name="position" label="职位" rule="REQ" />,
                    <Input name="phone" label="手机号" rule="REQ TEL" />,
                    <Input name="email" label="邮箱" rule="EMAIL" />,
                    <Input name="years" label="工作年限" rule="REQ" />
                  ]}
                />
              </Flex>
            )
          },
          {
            title: '面试评分',
            formProps: { data: STEP_DATA },
            children: (
              <Flex vertical gap={16}>
                <FormInfo
                  bordered
                  title="维度评分"
                  column={2}
                  gap={20}
                  list={[
                    <Input name="commScore" label="沟通表达" rule="REQ" />,
                    <Input name="techScore" label="专业深度" rule="REQ" />,
                    <Input name="projectScore" label="项目复杂度" rule="REQ" />
                  ]}
                />
                <FormInfo
                  bordered
                  title="评语"
                  column={1}
                  gap={20}
                  list={[
                    <TextArea name="summary" label="综合评语" rule="REQ" block rows={4} />
                  ]}
                />
              </Flex>
            )
          },
          {
            title: '经历与结论',
            formProps: { data: STEP_DATA },
            children: (
              <Flex vertical gap={16}>
                <List
                  title="工作经历"
                  name="workExperience"
                  bordered
                  important
                  maxLength={5}
                  addText="添加经历"
                  itemTitle={({ index, data }) => data?.companyName || &#96;经历 ${index + 1}&#96;}
                  list={[
                    <Input name="companyName" label="公司" rule="REQ" />,
                    <Input name="role" label="职位" rule="REQ" />,
                    <Input name="years" label="年限" placeholder="例如 2年" />
                  ]}
                />
                <FormInfo
                  bordered
                  title="目标与风险"
                  column={1}
                  gap={20}
                  list={[
                    <TextArea name="objectives" label="培养目标" rule="REQ" block rows={4} />,
                    <TextArea name="risks" label="风险与跟进" block rows={3} />
                  ]}
                />
              </Flex>
            )
          }
        ]}
      />
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <FormInfoStepsModalExample />
  </App>
);

render(<BaseExample />);

```

### API

#### Modal

声明式弹窗。基于 antd Modal，关闭请使用 `onClose`（内部映射 antd `onCancel`）。

##### 属性

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

##### footerButtons 项

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

#### useModal

命令式打开弹窗，参数同 Modal。需在 antd `App`（或 `App.useApp` 可用）上下文中使用。

##### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| modal | function | 调用后弹出 Modal；返回 `{ close }`；默认 `zIndex` 为 1100 |

#### CSS 变量

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

#### 布局组合

Tabs / N 列分栏等复杂内容区须 **`bodyScroll={false}`**，由 `ModalScrollRegion`（SimpleBar）分区滚动，避免与 Modal body 双层 SimpleBar。

##### ModalTabsLayout

antd `Tabs` 封装：顶栏占 title 位（配合无 `title` 的 Modal）、antd6 高度链、`destroyOnHidden` 默认 true。其余 props 透传 Tabs。

##### ModalColumnsLayout

固定 N 列 flex 分栏。`widths` 与 `children` 等长（如 `['36%', '1fr']`、`['200px', '1fr', '280px']`）；`'1fr'` 占剩余宽度。

##### ModalScrollRegion

单块 SimpleBar 滚动区，用于 Tab 面板或每一列。首列/末列背景由父级 `:first-child` / `:last-child` 选中。

- `inset`（默认 `false`）：为 `true` 时内容区增加 `16px 20px` 内边距（适合详情、概览等单列内容）
- 分栏列表左列通常保持 `inset={false}`，由列表项自行控制间距

Tabs / 分栏弹窗须 **`bodyScroll={false}`**，此时 Modal 默认 **noPadding**（内容贴边），以便分栏铺满 body；需要外层留白时可传 **`noPadding={false}`**。

##### modalClassNames

| 常量 | 值 | 用途 |
|------|-----|------|
| `stepsForm` | `react-modal-steps-form` | 分步弹窗挂 Modal `className`，去横向溢出 |
| `splitter` | `react-modal-splitter` | antd Splitter 在 Modal 内的高度链 |

##### createModalRender

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

<!--END_SECTION:DOC_MD-->
