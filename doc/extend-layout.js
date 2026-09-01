const {
  default: Modal,
  Drawer,
  DrawerContextHolder,
  TabsLayout,
  ColumnsLayout,
  ScrollRegion,
  modalClassNames
} = _ReactModal;
const {
  Button,
  Space,
  Splitter,
  Input,
  Avatar,
  Tag,
  Descriptions,
  Progress,
  Typography,
  Divider,
  App,
  message,
  Radio
} = antd;
const { useState, useMemo, useEffect } = React;

const { Text, Title, Paragraph } = Typography;

const STATUS_MAP = {
  pending: { label: '待评估', color: 'orange' },
  passed: { label: '已通过', color: 'success' },
  hold: { label: '待定', color: 'processing' }
};

const CANDIDATES = [
  {
    key: '1',
    name: '陈思远',
    role: '高级前端工程师',
    years: 6,
    city: '上海',
    edu: '浙江大学 · 本科',
    status: 'pending',
    interviewer: '王面试官',
    scores: { comm: 4, tech: 5, project: 4, collab: 4 },
    summary: '主导过设计系统与性能治理，对 React 生态和工程化有较深实践。',
    notes: [
      { title: '技术深度', body: '能清晰描述虚拟列表、并发特性在项目中的落地方式，并给出可量化的性能收益。' },
      { title: '协作推进', body: '跨端联调经验充足，曾推动组件库在 3 条业务线统一接入。' },
      { title: '待确认', body: '对 Node 中间层经验相对薄弱，需二面补充后端协作场景。' }
    ]
  },
  {
    key: '2',
    name: '李雨桐',
    role: '前端工程师',
    years: 4,
    city: '上海',
    edu: '同济大学 · 硕士',
    status: 'passed',
    interviewer: '赵面试官',
    scores: { comm: 5, tech: 4, project: 4, collab: 5 },
    summary: '表达结构清晰，B 端复杂表单与权限场景经验丰富。',
    notes: [
      { title: '项目经验', body: '负责过审批流配置平台，熟悉动态表单、状态机与低代码接入。' },
      { title: '综合评价', body: '建议通过，可安排 HR 谈薪。' }
    ]
  },
  {
    key: '3',
    name: '周亦凡',
    role: '资深前端',
    years: 8,
    city: '杭州',
    edu: '华中科技大学 · 本科',
    status: 'hold',
    interviewer: '王面试官',
    scores: { comm: 3, tech: 5, project: 5, collab: 3 },
    summary: '技术栈匹配度高，但管理岗预期与当前编制不完全一致。',
    notes: [
      { title: '优势', body: '架构视野好，有微前端与监控体系从 0 到 1 经验。' },
      { title: '风险', body: '期望职级偏高，需与部门负责人对齐编制与职责范围。' }
    ]
  },
  {
    key: '4',
    name: '张可欣',
    role: 'React 开发',
    years: 3,
    city: '上海',
    edu: '华东师范大学 · 本科',
    status: 'pending',
    interviewer: '待分配',
    scores: { comm: 4, tech: 3, project: 3, collab: 4 },
    summary: '基础扎实，学习意愿强，适合参与组件库与文档建设。',
    notes: [{ title: '初面印象', body: 'Coding 完成度较好，需进一步考察复杂状态管理与性能排查。' }]
  },
  {
    key: '5',
    name: '刘浩然',
    role: '全栈工程师',
    years: 5,
    city: '深圳',
    edu: '中山大学 · 本科',
    status: 'passed',
    interviewer: '陈面试官',
    scores: { comm: 4, tech: 4, project: 4, collab: 4 },
    summary: '前后端均可独立交付，适合业务闭环小团队。',
    notes: [{ title: '备注', body: '可优先推进 offer，期望 4 月到岗。' }]
  },
  {
    key: '6',
    name: '赵一鸣',
    role: '前端工程师',
    years: 2,
    city: '上海',
    edu: '上海大学 · 本科',
    status: 'pending',
    interviewer: '待分配',
    scores: { comm: 3, tech: 3, project: 2, collab: 3 },
    summary: '初级候选人，项目复杂度一般，建议放入人才池观察。',
    notes: [{ title: '初筛', body: '基础题通过，项目细节描述不够深入。' }]
  },
  {
    key: '7',
    name: '孙雅琪',
    role: '高级前端',
    years: 7,
    city: '北京',
    edu: '北京邮电大学 · 硕士',
    status: 'hold',
    interviewer: '王面试官',
    scores: { comm: 4, tech: 5, project: 4, collab: 4 },
    summary: '技术匹配，但地域需确认是否接受 base 上海。',
    notes: [{ title: '跟进', body: '已发送 relocate 意愿确认邮件。' }]
  },
  {
    key: '8',
    name: '吴承泽',
    role: '前端架构师',
    years: 10,
    city: '上海',
    edu: '上海交通大学 · 硕士',
    status: 'passed',
    interviewer: '总监面',
    scores: { comm: 5, tech: 5, project: 5, collab: 5 },
    summary: '综合表现优秀，建议进入终面委员会评审。',
    notes: [
      { title: '架构能力', body: '对团队工程规范、发布流程、质量门禁有体系化方法论。' },
      { title: '下一步', body: '安排与研发负责人终面。' }
    ]
  }
];

const EXTRA_CANDIDATES = Array.from({ length: 12 }, (_, i) => ({
  key: String(i + 9),
  name: `候选人 ${i + 9}`,
  role: i % 2 === 0 ? '前端工程师' : '高级前端',
  years: 2 + (i % 6),
  city: ['上海', '杭州', '深圳'][i % 3],
  edu: '本科',
  status: ['pending', 'passed', 'hold'][i % 3],
  interviewer: '待分配',
  scores: { comm: 3 + (i % 3), tech: 3 + (i % 2), project: 3, collab: 3 },
  summary: '批量导入的待评估候选人，用于验证左侧列表滚动与选中切换。',
  notes: [{ title: '系统备注', body: '暂无详细评估记录，请安排初面后补充。' }]
}));

const ALL_CANDIDATES = [...CANDIDATES, ...EXTRA_CANDIDATES];

const SCORE_LABELS = {
  comm: '沟通表达',
  tech: '专业深度',
  project: '项目复杂度',
  collab: '协作推进'
};

const CandidateList = ({ items, activeKey, onSelect, search, onSearchChange }) => (
  <>
    <div className="modal-scroll-region-sticky candidate-list-toolbar">
      <Input
        allowClear
        placeholder="搜索姓名、岗位、城市…"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
      <Text type="secondary">本批 {items.length} 人 · 点击切换右侧详情</Text>
    </div>
    {items.map(item => {
      const status = STATUS_MAP[item.status] || STATUS_MAP.pending;
      return (
        <div
          key={item.key}
          className={`candidate-list-item${item.key === activeKey ? ' is-active' : ''}`}
          onClick={() => onSelect(item.key)}
        >
          <div className="candidate-list-item-main">
            <Avatar style={{ backgroundColor: item.key === activeKey ? '#1677ff' : '#87d068' }}>
              {item.name.slice(-2)}
            </Avatar>
            <div className="candidate-list-item-body">
              <div className="candidate-list-item-title">{item.name}</div>
              <div className="candidate-list-item-meta">
                {item.role} · {item.years} 年 · {item.city}
              </div>
            </div>
            <Tag color={status.color} style={{ margin: 0 }}>
              {status.label}
            </Tag>
          </div>
        </div>
      );
    })}
  </>
);

const CandidateDetail = ({ candidate }) => {
  if (!candidate) {
    return null;
  }
  const status = STATUS_MAP[candidate.status] || STATUS_MAP.pending;
  const avgScore =
    Object.values(candidate.scores).reduce((a, b) => a + b, 0) / Object.values(candidate.scores).length;

  return (
    <div className="candidate-detail">
      <div className="candidate-detail-header">
        <div>
          <Title level={4} className="candidate-detail-name">
            {candidate.name}
          </Title>
          <div className="candidate-detail-sub">
            <Tag>{candidate.role}</Tag>
            <Tag>{candidate.years} 年经验</Tag>
            <Tag>{candidate.city}</Tag>
            <Tag color={status.color}>{status.label}</Tag>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text type="secondary">综合</Text>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#1677ff', lineHeight: 1.2 }}>
            {avgScore.toFixed(1)}
          </div>
        </div>
      </div>

      <Descriptions size="small" bordered column={2} style={{ marginBottom: 20 }}>
        <Descriptions.Item label="学历">{candidate.edu}</Descriptions.Item>
        <Descriptions.Item label="面试官">{candidate.interviewer}</Descriptions.Item>
        <Descriptions.Item label="摘要" span={2}>
          {candidate.summary}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" plain style={{ margin: '0 0 12px' }}>
        维度评分
      </Divider>
      <div className="candidate-score-grid">
        {Object.entries(candidate.scores).map(([key, value]) => (
          <div key={key}>
            <div className="candidate-score-item-label">
              <span>{SCORE_LABELS[key]}</span>
              <span>{value} / 5</span>
            </div>
            <Progress percent={value * 20} showInfo={false} strokeColor="#1677ff" size="small" />
          </div>
        ))}
      </div>

      <Divider orientation="left" plain style={{ margin: '0 0 12px' }}>
        面试记录
      </Divider>
      {candidate.notes.map(note => (
        <div key={note.title} className="candidate-note-block">
          <div className="candidate-note-block-title">{note.title}</div>
          <Paragraph style={{ margin: 0, color: 'rgba(0,0,0,0.65)' }}>{note.body}</Paragraph>
        </div>
      ))}
    </div>
  );
};

const useCandidatePanel = () => {
  const [active, setActive] = useState(ALL_CANDIDATES[0].key);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return ALL_CANDIDATES;
    }
    return ALL_CANDIDATES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [search]);

  const current = filtered.find(item => item.key === active) || filtered[0];

  return { active, setActive, search, setSearch, filtered, current };
};

const ColumnsPane = () => {
  const { setActive, search, setSearch, filtered, current } = useCandidatePanel();

  return (
    <ColumnsLayout widths={['34%', '1fr']}>
      <ScrollRegion>
        <CandidateList
          items={filtered}
          activeKey={current?.key}
          onSelect={setActive}
          search={search}
          onSearchChange={setSearch}
        />
      </ScrollRegion>
      <ScrollRegion inset>
        <CandidateDetail candidate={current} />
      </ScrollRegion>
    </ColumnsLayout>
  );
};

const SplitterPane = () => {
  const { setActive, search, setSearch, filtered, current } = useCandidatePanel();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <p className="demo-panel-hint">可拖拽中间分隔条调整列表宽度，左右列仍各自 SimpleBar 滚动。</p>
      <Splitter
        className={modalClassNames.splitter}
        style={{ flex: 1, minHeight: 0 }}
        defaultSize="34%"
        min="240"
        max="52%"
      >
        <Splitter.Panel>
          <ScrollRegion>
            <CandidateList
              items={filtered}
              activeKey={current?.key}
              onSelect={setActive}
              search={search}
              onSearchChange={setSearch}
            />
          </ScrollRegion>
        </Splitter.Panel>
        <Splitter.Panel>
          <ScrollRegion inset>
            <CandidateDetail candidate={current} />
          </ScrollRegion>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

const OverviewPane = () => {
  const stats = useMemo(() => {
    const pending = ALL_CANDIDATES.filter(c => c.status === 'pending').length;
    const passed = ALL_CANDIDATES.filter(c => c.status === 'passed').length;
    const hold = ALL_CANDIDATES.filter(c => c.status === 'hold').length;
    return { total: ALL_CANDIDATES.length, pending, passed, hold };
  }, []);

  const schedule = [
    { time: '09:30', name: '陈思远', role: '高级前端', room: 'A301', status: 'pending' },
    { time: '10:30', name: '李雨桐', role: '前端', room: 'A301', status: 'passed' },
    { time: '14:00', name: '周亦凡', role: '资深前端', room: 'B208', status: 'hold' },
    { time: '15:30', name: '张可欣', role: 'React', room: 'B208', status: 'pending' },
    { time: '16:30', name: '吴承泽', role: '架构师', room: '总监室', status: 'passed' }
  ];

  return (
    <ScrollRegion>
      <div className="candidate-overview-stats">
        {[
          { label: '本批人数', value: stats.total },
          { label: '待评估', value: stats.pending },
          { label: '已通过', value: stats.passed },
          { label: '待定', value: stats.hold }
        ].map(item => (
          <div key={item.label} className="candidate-stat-card">
            <div className="candidate-stat-value">{item.value}</div>
            <div className="candidate-stat-label">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="candidate-overview-section">
        <Title level={5} style={{ marginTop: 0 }}>
          今日面试安排
        </Title>
        <div className="candidate-schedule-row" style={{ fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>
          <span>时间</span>
          <span>候选人</span>
          <span>会议室</span>
          <span>状态</span>
        </div>
        {schedule.map(row => {
          const status = STATUS_MAP[row.status];
          return (
            <div key={row.time + row.name} className="candidate-schedule-row">
              <span className="candidate-schedule-time">{row.time}</span>
              <span>
                {row.name}
                <Text type="secondary"> · {row.role}</Text>
              </span>
              <span>{row.room}</span>
              <Tag color={status.color} style={{ margin: 0, justifySelf: 'start' }}>
                {status.label}
              </Tag>
            </div>
          );
        })}
        <Divider />
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          概览 Tab 同样使用 ScrollRegion：批次统计与日程较长时在本面板内滚动，不影响 Tabs 顶栏与底部操作区。
        </Paragraph>
        {Array.from({ length: 6 }, (_, i) => (
          <Paragraph key={i} style={{ marginBottom: 8, color: 'rgba(0,0,0,0.45)' }}>
            备注 {i + 1}：终面委员会会议安排在周五 15:00，需提前汇总已通过候选人材料。
          </Paragraph>
        ))}
      </div>
    </ScrollRegion>
  );
};

const ExtendLayoutExample = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('columns');
  const [mode, setMode] = useState('modal');
  const isDrawer = mode === 'drawer';

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [mode]);

  const Overlay = isDrawer ? Drawer : Modal;

  const layout = (
    <TabsLayout
      activeKey={tab}
      onChange={setTab}
      items={[
        { key: 'columns', label: '候选人', children: <ColumnsPane /> },
        { key: 'split', label: '可调分栏', children: <SplitterPane /> },
        { key: 'overview', label: '批次概览', children: <OverviewPane /> }
      ]}
    />
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
      <div>
        <Button type="primary" onClick={() => setOpen(true)}>
          打开批量评估弹层
        </Button>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          模拟 HR 批量面试评估：Tabs 占 title 位，左列表右详情；切换 Modal / Drawer 对比布局高度链。
        </Paragraph>
      </div>
      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        bodyScroll={false}
        size="large"
        onConfirm={async () => {
          await new Promise(r => setTimeout(r, 400));
          message.success('本批评估已保存');
        }}
        confirmText="保存本批评估"
        cancelText="稍后处理"
      >
        {layout}
      </Overlay>
    </Space>
  );
};

render(
  <App>
    <DrawerContextHolder />
    <ExtendLayoutExample />
  </App>
);
