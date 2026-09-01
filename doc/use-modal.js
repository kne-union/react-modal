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
