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
