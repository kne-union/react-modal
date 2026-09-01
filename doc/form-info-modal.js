const { createModalRender } = _ReactModal;
const { default: FormInfo, FormModal, Input, TextArea } = _FormInfo;
const { Button, Space, Typography, App, message, Switch, Flex } = antd;
const { useState, useMemo } = React;
const { Text, Paragraph } = Typography;

const SECTION_DEFS = [
  {
    key: 'basic',
    title: '基本信息',
    fields: [
      ['name', '姓名', 'REQ'],
      ['employeeNo', '工号', 'REQ'],
      ['department', '部门', 'REQ'],
      ['position', '职位', 'REQ'],
      ['phone', '手机号', 'REQ TEL'],
      ['email', '邮箱', 'EMAIL'],
      ['city', '工作城市', 'REQ'],
      ['manager', '直属上级', '']
    ]
  },
  {
    key: 'interview',
    title: '面试评估',
    fields: [
      ['commScore', '沟通表达', 'REQ'],
      ['techScore', '专业深度', 'REQ'],
      ['projectScore', '项目复杂度', 'REQ'],
      ['collabScore', '协作推进', 'REQ'],
      ['cultureScore', '文化匹配', 'REQ'],
      ['overallScore', '综合评分', 'REQ']
    ]
  },
  {
    key: 'experience',
    title: '经历与补充',
    fields: Array.from({ length: 16 }, (_, i) => [
      `expField${i + 1}`,
      `经历补充项 ${i + 1}`,
      i % 4 === 0 ? 'REQ' : ''
    ])
  }
];

const buildInitialData = () => {
  const data = {
    name: '张三',
    employeeNo: 'E20240018',
    department: '研发中心',
    position: '高级前端',
    phone: '13800138000',
    email: 'zhangsan@company.com',
    city: '上海',
    manager: '李四',
    commScore: '4',
    techScore: '5',
    projectScore: '4',
    collabScore: '4',
    cultureScore: '5',
    overallScore: '4.5',
    summary:
      '沟通清晰，项目推进稳定。以下为加长评估说明，用于验证弹窗 body 在超长表单下的 SimpleBar 滚动：标题与底部按钮应固定，仅中间表单区域滚动。'.repeat(3)
  };
  SECTION_DEFS[2].fields.forEach(([name], i) => {
    data[name] = `补充说明内容 ${i + 1}：用于拉长表单高度。`;
  });
  return data;
};

const LongFormFields = () => (
  <Flex vertical gap={16}>
    {SECTION_DEFS.map(section => (
      <FormInfo
        key={section.key}
        bordered
        title={section.title}
        column={2}
        gap={20}
        list={section.fields.map(([name, label, rule]) => (
          <Input key={name} name={name} label={label} rule={rule || undefined} />
        ))}
      />
    ))}
    <FormInfo
      bordered
      title="评估摘要（长文本）"
      column={1}
      gap={20}
      list={[
        <TextArea key="summary" name="summary" label="综合评语" rule="REQ" block />,
        <TextArea
          key="risk"
          name="risk"
          label="风险与待跟进"
          block
          placeholder="列出风险点、待确认事项等"
        />,
        <TextArea
          key="plan"
          name="plan"
          label="入职 / 下轮计划"
          block
          placeholder="试用期目标、面试官建议等"
        />
      ]}
    />
    {Array.from({ length: 8 }, (_, block) => (
      <FormInfo
        key={`extra-${block}`}
        bordered
        title={`附加问卷 ${block + 1}`}
        column={2}
        gap={20}
        list={Array.from({ length: 6 }, (_, i) => {
          const name = `q${block + 1}_${i + 1}`;
          return <Input key={name} name={name} label={`问题 ${block + 1}.${i + 1}`} />;
        })}
      />
    ))}
  </Flex>
);

const FormInfoModalExample = () => {
  const [open, setOpen] = useState(false);
  const [bodyScroll, setBodyScroll] = useState(true);
  const initialData = useMemo(() => buildInitialData(), []);

  const renderModalBase = createModalRender({
    footerButtons: [],
    bodyScroll: true,
    size: 'large'
  });

  const renderModal = ({
    formProps,
    saveText,
    autoClose,
    onCancel,
    footer,
    modalRender,
    children,
    ...props
  }) =>
    renderModalBase({
      ...props,
      bodyScroll,
      onClose: onCancel,
      footer: typeof footer === 'function' ? footer() : footer,
      modalRender,
      children
    });

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button type="primary" onClick={() => setOpen(true)}>
          打开深度评估表单（FormModal）
        </Button>
        <Space>
          <Text type="secondary">bodyScroll</Text>
          <Switch checked={bodyScroll} onChange={setBodyScroll} checkedChildren="开" unCheckedChildren="关" />
        </Space>
      </Space>
      <Text type="secondary">
        createModalRender 注入 Modal 默认 props；form-info 宿主字段与 onCancel→onClose 在 renderModal 内映射。
      </Text>

      <FormModal
        title="候选人深度评估（超长表单）"
        open={open}
        onCancel={() => setOpen(false)}
        renderModal={renderModal}
        okText="保存评估"
        cancelText="取消"
        width={1000}
        formProps={{
          data: initialData,
          onSubmit: async data => {
            await new Promise(resolve => setTimeout(resolve, 500));
            message.success(`已保存：${data.name}（共 ${Object.keys(data).length} 个字段）`);
          }
        }}
      >
        <LongFormFields />
      </FormModal>
    </Space>
  );
};

const BaseExample = () => (
  <App>
    <FormInfoModalExample />
  </App>
);

render(<BaseExample />);
