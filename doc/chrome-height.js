const { default: Modal, Drawer, DrawerContextHolder } = _ReactModal;
const { Button, Space, Switch, Radio, Tag, Descriptions, Typography, App } = antd;
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
      const scrollHost = outer && outer.querySelector('[data-height-scroll-host]');
      setMetrics({
        outerClass: outer ? outer.className : '-',
        bodyHeightVar: readCssVar(body || outer, chrome.bodyHeightVar),
        contentHeightVar: readCssVar(inner || body || outer, chrome.contentHeightVar),
        paddingV: readCssVar(outer, `${chrome.varPrefix}-body-padding-vertical`),
        paddingH: readCssVar(outer, `${chrome.varPrefix}-body-padding-horizontal`),
        titleH: readCssVar(outer, `${chrome.varPrefix}-title-height`),
        footerH: readCssVar(outer, `${chrome.varPrefix}-footer-height`),
        bodyClient: body ? `${body.clientHeight}px` : '-',
        innerClient: inner ? `${inner.clientHeight}px` : '-',
        scrollClient: scrollHost ? `${scrollHost.clientHeight}px` : '-'
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [open, revision, mode, chrome]);

  if (!metrics) {
    return <Tag>打开弹层后显示实测高度</Tag>;
  }

  return (
    <Descriptions size="small" bordered column={1} style={{ maxWidth: 640 }}>
      <Descriptions.Item label="outer class">{metrics.outerClass}</Descriptions.Item>
      <Descriptions.Item label={`${chrome.varPrefix}-title-height`}>{metrics.titleH}</Descriptions.Item>
      <Descriptions.Item label={`${chrome.varPrefix}-footer-height`}>{metrics.footerH}</Descriptions.Item>
      <Descriptions.Item label={`${chrome.varPrefix}-body-padding-vertical`}>{metrics.paddingV}</Descriptions.Item>
      <Descriptions.Item label={`${chrome.varPrefix}-body-padding-horizontal`}>{metrics.paddingH}</Descriptions.Item>
      <Descriptions.Item label={chrome.bodyHeightVar}>{metrics.bodyHeightVar}</Descriptions.Item>
      <Descriptions.Item label={chrome.contentHeightVar}>{metrics.contentHeightVar}</Descriptions.Item>
      <Descriptions.Item label="body.clientHeight">{metrics.bodyClient}</Descriptions.Item>
      <Descriptions.Item label="body-inner.clientHeight">{metrics.innerClient}</Descriptions.Item>
      <Descriptions.Item label="scrollHost.clientHeight">{metrics.scrollClient}</Descriptions.Item>
    </Descriptions>
  );
};

const ChromeHeightExample = () => {
  const [open, setOpen] = useState(false);
  const [hasTitle, setHasTitle] = useState(true);
  const [footerMode, setFooterMode] = useState('default');
  const [bodyScroll, setBodyScroll] = useState(false);
  const [noPaddingMode, setNoPaddingMode] = useState('auto');
  const [mode, setMode] = useState('modal');
  const isDrawer = mode === 'drawer';

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [mode]);

  const chrome = getOverlayChrome(mode);
  const Overlay = isDrawer ? Drawer : Modal;
  const revision = [mode, hasTitle, footerMode, bodyScroll, noPaddingMode, open].join('|');

  const noPaddingProp = noPaddingMode === 'auto' ? undefined : noPaddingMode === 'true';

  const overlayProps = {
    open,
    onClose: () => setOpen(false),
    bodyScroll,
    ...(hasTitle ? { title: '候选人评估 · 高度调试' } : {}),
    ...(noPaddingProp === undefined ? {} : { noPadding: noPaddingProp }),
    size: isDrawer ? 'default' : undefined
  };

  if (footerMode === 'null') {
    overlayProps.footer = null;
  } else if (footerMode === 'emptyButtons') {
    overlayProps.footer = <span>仅左侧 footer，按钮为空数组</span>;
    overlayProps.footerButtons = [];
  } else {
    overlayProps.onConfirm = () => {};
  }

  const lines = Array.from({ length: 24 }, (_, i) => `行 ${i + 1} · 用于观察滚动与高度是否贴齐`);

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
      </div>
      <Space wrap>
        <Button type="primary" onClick={() => setOpen(true)}>
          打开并测量
        </Button>
        <Tag>mode={mode}</Tag>
        <Tag>footerMode={footerMode}</Tag>
      </Space>
      <HeightProbe open={open} revision={revision} mode={mode} />
      <Overlay {...overlayProps}>
        {bodyScroll === false ? (
          <div
            data-height-scroll-host
            style={{
              height: `var(${chrome.contentHeightVar})`,
              minHeight: 0,
              overflow: 'auto',
              boxSizing: 'border-box',
              background: noPaddingProp === false ? '#fff7e6' : '#e6f4ff',
              border: noPaddingProp === false ? '2px dashed #fa8c16' : '2px dashed #1677ff'
            }}
          >
            <div style={{ padding: 12 }}>
              <p style={{ marginTop: 0, fontWeight: 600 }}>
                滚动宿主 height: var({chrome.contentHeightVar})。footer=null 时 footer 变量应为 0。
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
      </Overlay>
    </Space>
  );
};

render(
  <App>
    <DrawerContextHolder />
    <ChromeHeightExample />
  </App>
);
