const { default: Modal, useModal, DrawerContextHolder } = _ReactModal;
const { Button, Space, Radio, Typography, App } = antd;
const { useState } = React;

const { Text, Paragraph } = Typography;

const fillLines = Array.from({ length: 20 }, (_, i) => `填充行 ${i + 1} · 用于观察高度受限时 body 内滚动`);

const LimitedHeightExample = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('declarative');
  const modal = useModal();

  const content = (
    <div className="demo-modal-height-limited-panel">
      <p className="demo-modal-height-limited-panel-title">高度受限弹窗（kne-modal-height-limited）</p>
      <Paragraph type="secondary" style={{ marginBottom: 12 }}>
        默认从视口垂直居中弹出；body 高度被 CSS 变量压到约 420px，长内容在 SimpleBar 内滚动。移动端仍保持居中卡片，footer 贴在卡片底部（不走全屏）。
      </Paragraph>
      {fillLines.map(text => (
        <p key={text} className="demo-modal-height-limited-line">
          {text}
        </p>
      ))}
    </div>
  );

  const overlayProps = {
    title: '高度受限 · 居中弹窗',
    className: 'kne-modal-height-limited',
    onClose: () => setOpen(false),
    onConfirm: () => setOpen(false),
    confirmText: '知道了'
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Space align="center" wrap>
        <Text type="secondary">打开方式</Text>
        <Radio.Group
          value={mode}
          optionType="button"
          size="small"
          options={[
            { label: '声明式 Modal', value: 'declarative' },
            { label: 'useModal（info）', value: 'imperative' }
          ]}
          onChange={e => setMode(e.target.value)}
        />
      </Space>
      <Button
        type="primary"
        onClick={() => {
          if (mode === 'imperative') {
            modal({
              ...overlayProps,
              children: content
            });
            return;
          }
          setOpen(true);
        }}
      >
        打开高度受限弹窗
      </Button>
      <Text type="secondary">
        useModal 走 antd modal.info，已覆盖 <code>.ant-modal-confirm-paragraph</code> 的 12px 宽度扣减。
      </Text>
      {mode === 'declarative' ? (
        <Modal {...overlayProps} open={open}>
          {content}
        </Modal>
      ) : null}
    </Space>
  );
};

render(
  <App>
    <DrawerContextHolder />
    <LimitedHeightExample />
  </App>
);
