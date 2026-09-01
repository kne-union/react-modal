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
        bodyClient: body ? `${body.clientHeight}px` : '-',
        innerClient: inner ? `${inner.clientHeight}px` : '-',
        scrollClient: scrollHost ? `${scrollHost.clientHeight}px` : '-'
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

  const lines = Array.from({ length: 24 }, (_, i) => `行 ${i + 1} · 用于观察滚动与高度是否贴齐`);

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
