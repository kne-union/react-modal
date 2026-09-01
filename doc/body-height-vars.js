const { default: Modal, Drawer, DrawerContextHolder } = _ReactModal;
const { Button, Space, Switch, Tag, Descriptions, Radio, Typography, App } = antd;
const { useState, useEffect } = React;

const { Text } = Typography;

const readCssVar = (el, name) => {
  if (!el) {
    return '-';
  }
  return getComputedStyle(el).getPropertyValue(name).trim() || '-';
};

const getOverlayChrome = mode => {
  const isDrawer = mode === 'drawer';
  return {
    isDrawer,
    testId: isDrawer ? 'react-drawer' : 'react-modal',
    bodyClass: isDrawer ? 'drawer-body' : 'modal-body',
    innerClass: isDrawer ? 'drawer-body-inner' : 'modal-body-inner',
    contentHeightVar: isDrawer ? '--kne-drawer-content-height' : '--kne-modal-content-height',
    bodyHeightVar: isDrawer ? '--kne-drawer-body-height' : '--kne-modal-body-height',
    varPrefix: isDrawer ? '--kne-drawer' : '--kne-modal'
  };
};

const HeightProbe = ({ open, revision, mode }) => {
  const [metrics, setMetrics] = useState(null);
  const chrome = getOverlayChrome(mode);

  useEffect(() => {
    if (!open) {
      setMetrics(null);
      return undefined;
    }
    const timer = setTimeout(() => {
      const outer = document.querySelector(`[data-testid="${chrome.testId}"]`);
      const body = outer && outer.querySelector(`.${chrome.bodyClass}`);
      const inner = outer && outer.querySelector(`.${chrome.innerClass}`);
      const fill = outer && outer.querySelector('[data-vars-fill]');
      setMetrics({
        gutter: readCssVar(outer, `${chrome.varPrefix}-viewport-gutter`),
        bodyHeightVar: readCssVar(body || outer, chrome.bodyHeightVar),
        contentHeightVar: readCssVar(inner || body || outer, chrome.contentHeightVar),
        bodyMin: readCssVar(outer, `${chrome.varPrefix}-body-min-height`),
        paddingV: readCssVar(outer, `${chrome.varPrefix}-body-padding-vertical`),
        bodyClient: body ? `${body.clientHeight}px` : '-',
        fillClient: fill ? `${fill.clientHeight}px` : '-'
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [open, revision, mode, chrome]);

  if (!metrics) {
    return <Tag>打开弹层后显示变量与实测高度</Tag>;
  }

  return (
    <Descriptions size="small" bordered column={1} style={{ maxWidth: 640 }}>
      <Descriptions.Item label={`${chrome.varPrefix}-viewport-gutter`}>{metrics.gutter}</Descriptions.Item>
      <Descriptions.Item label={`${chrome.varPrefix}-body-min-height`}>{metrics.bodyMin}</Descriptions.Item>
      <Descriptions.Item label={`${chrome.varPrefix}-body-padding-vertical`}>{metrics.paddingV}</Descriptions.Item>
      <Descriptions.Item label={chrome.bodyHeightVar}>{metrics.bodyHeightVar}</Descriptions.Item>
      <Descriptions.Item label={chrome.contentHeightVar}>{metrics.contentHeightVar}</Descriptions.Item>
      <Descriptions.Item label="body.clientHeight">{metrics.bodyClient}</Descriptions.Item>
      <Descriptions.Item label="色块 clientHeight（应≈ content-height）">{metrics.fillClient}</Descriptions.Item>
    </Descriptions>
  );
};

const fillLines = Array.from({ length: 18 }, (_, i) => `填充行 ${i + 1} · 用于验证 content-height 滚动`);

const HeightVarsExample = () => {
  const [open, setOpen] = useState(false);
  const [customVars, setCustomVars] = useState(true);
  const [mode, setMode] = useState('modal');
  const isDrawer = mode === 'drawer';

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [mode]);

  const chrome = getOverlayChrome(mode);
  const revision = `${mode}|${customVars}|${open}`;
  const Overlay = isDrawer ? Drawer : Modal;

  const overlayStyle = customVars
    ? isDrawer
      ? {
          '--kne-drawer-body-min-height': '180px',
          '--kne-drawer-body-padding-vertical': '64px'
        }
      : {
          '--kne-modal-viewport-gutter': '240px',
          '--kne-modal-body-min-height': '180px',
          '--kne-modal-body-padding-vertical': '64px'
        }
    : undefined;

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
      <Space wrap align="center">
        <Switch
          checked={customVars}
          onChange={setCustomVars}
          checkedChildren="自定义变量"
          unCheckedChildren="默认变量"
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          打开弹层对比高度
        </Button>
        <Tag color={customVars ? 'blue' : 'default'}>{customVars ? '已覆盖 CSS 变量' : '库内默认值'}</Tag>
      </Space>
      <div style={{ color: 'rgba(0,0,0,0.45)', maxWidth: 640 }}>
        通过 <code>style</code> 覆盖 {chrome.varPrefix}-* 变量。Drawer 无 viewport-gutter；Modal 可加大 gutter
        使 body 明显变矮。色块绑定 <code>{chrome.contentHeightVar}</code>。
      </div>
      <HeightProbe open={open} revision={revision} mode={mode} />
      <Overlay
        title={customVars ? '自定义高度 CSS 变量' : '默认高度 CSS 变量'}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {}}
        bodyScroll={false}
        noPadding={false}
        style={overlayStyle}
        size={isDrawer ? 'default' : undefined}
      >
        <div
          data-vars-fill
          style={{
            height: `var(${chrome.contentHeightVar})`,
            minHeight: 0,
            overflow: 'auto',
            boxSizing: 'border-box',
            background: customVars ? '#fff1f0' : '#e6f4ff',
            border: customVars ? '2px solid #ff4d4f' : '2px solid #1677ff'
          }}
        >
          <div style={{ padding: 12 }}>
            <p style={{ marginTop: 0, fontWeight: 600 }}>
              色块 height = var({chrome.contentHeightVar})。切换「自定义/默认」与 Modal/Drawer 后重新打开对比。
            </p>
            {fillLines.map(text => (
              <p key={text} style={{ margin: '4px 0' }}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </Overlay>
    </Space>
  );
};

render(
  <App>
    <DrawerContextHolder />
    <HeightVarsExample />
  </App>
);
