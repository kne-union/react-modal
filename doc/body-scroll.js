const { default: Modal, Drawer, DrawerContextHolder } = _ReactModal;
const { Button, Space, Typography, Divider, Radio, App } = antd;
const { useState, useEffect } = React;

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
  const [mode, setMode] = useState('modal');
  const isDrawer = mode === 'drawer';

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
    if (openSelfScroll) {
      setOpenSelfScroll(false);
    }
  }, [mode]);

  const contentHeightVar = isDrawer ? '--kne-drawer-content-height' : '--kne-modal-content-height';
  const Overlay = isDrawer ? Drawer : Modal;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Space align="center" wrap>
        <Text type="secondary">打开方式</Text>
        <Radio.Group
          value={mode}
          optionType="button"
          size="small"
          options={[
            { label: 'Modal', value: 'modal' },
            { label: 'Drawer', value: 'drawer' }
          ]}
          onChange={e => setMode(e.target.value)}
        />
      </Space>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        对比默认 SimpleBar 与 bodyScroll=false 自管滚动；切换 Modal / Drawer 观察高度链一致。
      </Paragraph>
      <Space wrap>
        <Button type="primary" onClick={() => setOpen(true)}>
          打开评估详情（SimpleBar）
        </Button>
        <Button onClick={() => setOpenSelfScroll(true)}>自管滚动（bodyScroll=false）</Button>
      </Space>
      <Overlay
        title="陈思远 · 面试评估纪要"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {}}
        confirmText="保存纪要"
        size={isDrawer ? 'default' : undefined}
      >
        <EvaluationContent />
      </Overlay>
      <Overlay
        title="自管滚动示例"
        open={openSelfScroll}
        onClose={() => setOpenSelfScroll(false)}
        bodyScroll={false}
        footer={null}
        size={isDrawer ? 'large' : undefined}
      >
        <div
          style={{
            height: `var(${contentHeightVar})`,
            minHeight: 0,
            overflow: 'auto',
            boxSizing: 'border-box',
            background: '#fafafa'
          }}
        >
          <div style={{ padding: 20 }}>
            <Paragraph style={{ marginTop: 0 }}>
              内容区高度绑定 <Text code>{contentHeightVar}</Text>，Tabs / 分栏场景同样适用。
            </Paragraph>
            <EvaluationContent />
          </div>
        </div>
      </Overlay>
    </Space>
  );
};

render(
  <App>
    <DrawerContextHolder />
    <LongContentExample />
  </App>
);
