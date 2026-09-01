const { default: Modal, Drawer, DrawerContextHolder } = _ReactModal;
const { Button, Space, message, Typography, Radio, App } = antd;
const { useState, useEffect } = React;

const { Text, Paragraph } = Typography;

const BasicExample = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('modal');
  const isDrawer = mode === 'drawer';

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [mode]);

  const overlayProps = {
    title: '保存评估备注',
    open,
    onClose: () => setOpen(false),
    onConfirm: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('备注已保存至候选人档案');
    },
    confirmText: '保存'
  };

  const content = (
    <>
      <Paragraph style={{ marginBottom: 8 }}>
        将把当前页面的筛选条件与评估摘要一并写入 <Text strong>陈思远</Text> 的档案备注。
      </Paragraph>
      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        保存后可在「候选人详情 → 操作记录」中查看历史版本。
      </Paragraph>
    </>
  );

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
      <Button type="primary" onClick={() => setOpen(true)}>
        保存评估备注
      </Button>
      <Text type="secondary">
        最简受控弹层：切换 Modal / Drawer 对比同一套 props；异步 onConfirm 带 loading。
      </Text>
      {isDrawer ? (
        <Drawer {...overlayProps} size="default">
          {content}
        </Drawer>
      ) : (
        <Modal {...overlayProps}>{content}</Modal>
      )}
    </Space>
  );
};

render(
  <App>
    <DrawerContextHolder />
    <BasicExample />
  </App>
);
