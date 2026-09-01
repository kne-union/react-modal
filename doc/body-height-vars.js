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
        bodyClient: body ? `${body.clientHeight}px` : '-',
        fillClient: fill ? `${fill.clientHeight}px` : '-'
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

const fillLines = Array.from({ length: 18 }, (_, i) => `填充行 ${i + 1} · 用于验证 content-height 滚动`);

const HeightVarsExample = () => {
  const [open, setOpen] = useState(false);
  const [customVars, setCustomVars] = useState(true);
  const revision = `${customVars}|${open}`;

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
