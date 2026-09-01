const { default: Modal, useModal } = _ReactModal;
const { Button, Space, Typography, Tag, App, message, Checkbox } = antd;
const { useState, useEffect } = React;
const { Text, Paragraph, Title } = Typography;

const EXPORT_FIELDS = [
  { label: '基本信息', value: 'basic' },
  { label: '维度评分', value: 'scores' },
  { label: '面试记录', value: 'notes' },
  { label: '附件简历', value: 'resume' }
];

const NestProbe = ({ open }) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!open) {
      setInfo(null);
      return;
    }
    const id = window.setTimeout(() => {
      const titles = Array.from(document.querySelectorAll('.ant-modal-root .modal-title'));
      const outerTitle = titles.find(el => el.textContent === '导出评估报告');
      const innerTitle = titles.find(el => el.textContent === '选择导出字段');
      const outerRoot = outerTitle?.closest('.ant-modal-root');
      const innerRoot = innerTitle?.closest('.ant-modal-root');
      const outerBody = outerRoot?.querySelector('.ant-modal-body');
      const outerZ = Number(outerRoot?.querySelector('.ant-modal-wrap')?.style?.zIndex || 0);
      const innerZ = Number(innerRoot?.querySelector('.ant-modal-wrap')?.style?.zIndex || 0);
      const hoisted = !!(innerRoot && outerBody && !outerBody.contains(innerRoot));
      setInfo({ hoisted, outerZ, innerZ });
    }, 50);
    return () => window.clearTimeout(id);
  }, [open]);

  if (!info) {
    return <Text type="secondary">打开内层后显示挂载探针</Text>;
  }

  return (
    <Space direction="vertical" size={4}>
      <span>
        内层挂载位置：
        <Tag color={info.hoisted ? 'success' : 'error'} style={{ marginLeft: 8 }}>
          {info.hoisted ? '外层 modal-root 外侧' : '异常'}
        </Tag>
      </span>
      <Text type="secondary">zIndex 外层 {info.outerZ} / 内层 {info.innerZ}（antd 管理）</Text>
    </Space>
  );
};

const ExportFieldPicker = () => {
  const [innerOpen, setInnerOpen] = useState(false);
  const [checked, setChecked] = useState(['basic', 'scores', 'notes']);

  return (
    <div>
      <Paragraph>
        已选择本批 <Text strong>8</Text> 位候选人。导出前可勾选需要写入 PDF 的字段；内层声明式{' '}
        <Text code>Modal</Text> 会自动 hoist，无需手动指定容器。
      </Paragraph>
      <Space>
        <Button type="primary" onClick={() => setInnerOpen(true)}>
          配置导出字段
        </Button>
        <Text type="secondary">已选 {checked.length} 项</Text>
      </Space>
      <div style={{ marginTop: 12 }}>
        <NestProbe open={innerOpen} />
      </div>
      <Modal
        title="选择导出字段"
        open={innerOpen}
        size="small"
        onClose={() => setInnerOpen(false)}
        onConfirm={() => {
          message.success(`将导出：${checked.join('、')}`);
          setInnerOpen(false);
        }}
        confirmText="确认字段"
      >
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          options={EXPORT_FIELDS}
          value={checked}
          onChange={setChecked}
        />
      </Modal>
    </div>
  );
};

const NestedModalExample = () => {
  const modal = useModal();

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Button
        type="primary"
        onClick={() => {
          modal({
            title: '导出评估报告',
            size: 'default',
            children: <ExportFieldPicker />,
            onConfirm: () => message.success('报告已进入生成队列'),
            confirmText: '开始导出'
          });
        }}
      >
        导出本批评估（嵌套弹窗）
      </Button>
      <Text type="secondary">外层 useModal + 内层声明式 Modal：关闭内层不影响外层。</Text>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <NestedModalExample />
  </App>
);

render(<BaseExample />);
