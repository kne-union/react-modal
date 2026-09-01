const { createModalRender, createDrawerRender, modalClassNames, DrawerContextHolder } = _ReactModal;
const { default: FormInfo, FormStepsModal, List, Input, TextArea } = _FormInfo;
const { Button, Space, Typography, App, message, Flex, Radio } = antd;
const { useState, useEffect } = React;
const { Text } = Typography;

const renderStepsModalBase = isDrawer =>
  isDrawer
    ? createDrawerRender({
        placement: 'right',
        footerButtons: [],
        bodyScroll: true,
        size: 'default',
        className: modalClassNames.stepsForm
      })
    : createModalRender({
        footerButtons: [],
        bodyScroll: true,
        size: 'default',
        className: modalClassNames.stepsForm
      });

const renderStepsModal = isDrawer => ({
  formProps,
  saveText,
  autoClose,
  onCancel,
  footer,
  modalRender,
  children,
  className,
  ...props
}) =>
  renderStepsModalBase(isDrawer)({
    ...props,
    className,
    onClose: onCancel,
    footer: typeof footer === 'function' ? footer() : footer,
    modalRender,
    children
  });

const STEP_DATA = {
  name: '李四',
  employeeNo: 'E20240023',
  department: '产品部',
  phone: '13900139000',
  email: 'lisi@company.com',
  years: '6',
  position: '高级产品经理',
  commScore: '4',
  techScore: '4',
  projectScore: '5',
  summary: '产品规划清晰，跨团队推进能力强。',
  workExperience: [
    {
      companyName: '某互联网公司',
      role: '产品经理',
      years: '3年'
    }
  ],
  objectives: '1. 独立负责核心模块\n2. 推动跨部门协作\n3. 三个月内熟悉业务',
  risks: '对行业业务理解仍需加深'
};

const FormInfoStepsModalExample = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('modal');
  const isDrawer = mode === 'drawer';

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [mode]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
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
        打开分步评估（FormStepsModal）
      </Button>
      <Text type="secondary">三步完成候选人评估；切换 Modal / Drawer 对比分步表单高度链。</Text>

      <FormStepsModal
        autoStep
        completeText="提交评估"
        nextText="下一步"
        onComplete={async allData => {
          await new Promise(resolve => setTimeout(resolve, 600));
          message.success(`已提交 ${allData.length} 步数据`);
        }}
        modalProps={{
          open,
          title: isDrawer ? '候选人评估（侧滑分步）' : '候选人评估（分步）',
          width: 900,
          onCancel: () => setOpen(false),
          renderModal: renderStepsModal(isDrawer)
        }}
        items={[
          {
            title: '基本信息',
            formProps: { data: STEP_DATA },
            children: (
              <Flex vertical gap={16}>
                <FormInfo
                  bordered
                  title="候选人信息"
                  column={2}
                  gap={20}
                  list={[
                    <Input name="name" label="姓名" rule="REQ" />,
                    <Input name="employeeNo" label="工号" rule="REQ" disabled />,
                    <Input name="department" label="部门" rule="REQ" />,
                    <Input name="position" label="职位" rule="REQ" />,
                    <Input name="phone" label="手机号" rule="REQ TEL" />,
                    <Input name="email" label="邮箱" rule="EMAIL" />,
                    <Input name="years" label="工作年限" rule="REQ" />
                  ]}
                />
              </Flex>
            )
          },
          {
            title: '面试评分',
            formProps: { data: STEP_DATA },
            children: (
              <Flex vertical gap={16}>
                <FormInfo
                  bordered
                  title="维度评分"
                  column={2}
                  gap={20}
                  list={[
                    <Input name="commScore" label="沟通表达" rule="REQ" />,
                    <Input name="techScore" label="专业深度" rule="REQ" />,
                    <Input name="projectScore" label="项目复杂度" rule="REQ" />
                  ]}
                />
                <FormInfo
                  bordered
                  title="评语"
                  column={1}
                  gap={20}
                  list={[
                    <TextArea name="summary" label="综合评语" rule="REQ" block rows={4} />
                  ]}
                />
              </Flex>
            )
          },
          {
            title: '经历与结论',
            formProps: { data: STEP_DATA },
            children: (
              <Flex vertical gap={16}>
                <List
                  title="工作经历"
                  name="workExperience"
                  bordered
                  important
                  maxLength={5}
                  addText="添加经历"
                  itemTitle={({ index, data }) => data?.companyName || `经历 ${index + 1}`}
                  list={[
                    <Input name="companyName" label="公司" rule="REQ" />,
                    <Input name="role" label="职位" rule="REQ" />,
                    <Input name="years" label="年限" placeholder="例如 2年" />
                  ]}
                />
                <FormInfo
                  bordered
                  title="目标与风险"
                  column={1}
                  gap={20}
                  list={[
                    <TextArea name="objectives" label="培养目标" rule="REQ" block rows={4} />,
                    <TextArea name="risks" label="风险与跟进" block rows={3} />
                  ]}
                />
              </Flex>
            )
          }
        ]}
      />
    </Space>
  );
};

render(
  <App>
    <DrawerContextHolder />
    <FormInfoStepsModalExample />
  </App>
);
