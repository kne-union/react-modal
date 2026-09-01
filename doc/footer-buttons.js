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
