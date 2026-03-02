'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Flame, TrendingUp, Briefcase, Award, ChevronRight, PlayCircle, Clock, Heart, Edit, Mic, Upload, RotateCcw, Bell, User } from 'lucide-react';

// 量表维度类型
interface AssessmentDimension {
  name: string;
  score: number;
  description: string;
}

// 量表类型
interface Assessment {
  name: string;
  score: number;
  level: string;
  summary: string;
  dimensions: AssessmentDimension[];
}

// 行业数据项（必选）
const industryOptions = [
  '企业服务', '金融投资', '制造业', '教育培训', '医疗健康', 
  '消费零售', '房地产', '互联网', '人工智能', '新能源',
  '汽车行业', '物流运输', '传媒娱乐', '农业', '政府公共',
  '法律咨询', '建筑设计', '化工环保', '通信', '其他'
];

// 资源标签数据项（必选，参考同类平台）
const resourceTags = [
  '资金', '人才', '技术', '渠道', '客户资源',
  '供应链', '品牌', '专利', '场地', '设备',
  '数据资源', '政府关系', '媒体资源', '合作伙伴', '其他'
];

// 人找事/事找人/纯交流选项（必选）
const connectionType = [
  { id: 'personLookingForJob', label: '人找事', description: '我有能力，寻找项目机会' },
  { id: 'jobLookingForPerson', label: '事找人', description: '我有项目，寻找合作伙伴' },
  { id: 'pureExchange', label: '纯交流', description: '只想交流学习，暂无合作需求' }
];

// 高燃宣告方向选项
const declarationDirections = [
  { id: 'confidence', name: '信心', icon: 'icon-confidence.jpg' },
  { id: 'mission', name: '使命', icon: 'icon-mission.jpg' },
  { id: 'self', name: '自我', icon: 'icon-self.jpg' },
  { id: 'opponent', name: '对手', icon: 'icon-opponent.jpg' },
  { id: 'environment', name: '环境', icon: 'icon-environment.jpg' }
];

// 量表结果数据（基于成熟量表设计）

/**
 * 量表1：创业心理评估
 * 理论基础：心理资本理论（Psychological Capital Theory - Luthans et al.）
 * 参考量表：PCQ-24心理资本问卷、创业自我效能感量表
 */
const entrepreneurialPsychologyAssessment = {
  name: '创业心理评估',
  score: 85,
  level: '优秀',
  summary: '您的创业心理素质全面，具备出色的抗压能力、创新思维和风险把控能力，适合在充满不确定性的创业环境中发挥领导力。',
  dimensions: [
    { name: '抗压韧性', score: 90, description: '面对挫折和压力时的恢复能力' },
    { name: '创新思维', score: 85, description: '产生新想法和解决方案的能力' },
    { name: '团队协作', score: 80, description: '与他人合作并建立信任的能力' },
    { name: '风险意识', score: 82, description: '识别、评估和管理风险的能力' },
    { name: '成就动机', score: 88, description: '追求卓越和实现目标的内在驱动力' },
    { name: '适应性', score: 84, description: '适应变化和环境调整的能力' }
  ]
};

/**
 * 量表2：商业认知评估
 * 理论基础：创业认知理论（Entrepreneurial Cognition Theory - Baron & Shane）
 * 参考量表：商业洞察力评估、创业认知量表
 */
const businessCognitionAssessment = {
  name: '商业认知评估',
  score: 78,
  level: '良好',
  summary: '您对商业模式和市场策略有基本理解，但在财务分析和战略规划方面还有提升空间，建议加强商业系统性思维的训练。',
  dimensions: [
    { name: '市场洞察', score: 75, description: '识别市场机会和用户需求的能力' },
    { name: '商业模式', score: 80, description: '设计和优化盈利模式的能力' },
    { name: '财务分析', score: 72, description: '理解和运用财务指标的能力' },
    { name: '战略规划', score: 85, description: '制定和执行长期战略的能力' },
    { name: '资源整合', score: 76, description: '有效配置和整合资源的能力' },
    { name: '竞争分析', score: 79, description: '理解和应对市场竞争的能力' }
  ]
};

/**
 * 量表3：AI认知评估
 * 理论基础：AI素养框架（EU DigComp Framework）、数字素养模型
 * 参考量表：AI应用能力评估、数字素养问卷
 */
const aiCognitionAssessment = {
  name: 'AI认知评估',
  score: 88,
  level: '优秀',
  summary: '您对AI工具有深入理解和丰富实践经验，具备将AI技术落地应用的能力，是组织中推动AI转型的关键人才。',
  dimensions: [
    { name: 'AI工具应用', score: 92, description: '使用各类AI工具解决实际问题的能力' },
    { name: 'AI趋势理解', score: 85, description: '理解AI发展趋势和技术边界的能力' },
    { name: 'AI思维模式', score: 88, description: '用AI思维优化工作流程的能力' },
    { name: 'AI落地实践', score: 85, description: '将AI技术整合到业务中的能力' },
    { name: 'AI伦理意识', score: 86, description: '理解AI伦理和合规要求的能力' },
    { name: 'AI学习能力', score: 90, description: '持续学习AI新技术的能力' }
  ]
};

/**
 * 量表4：事业使命感评估
 * 理论基础：使命感理论（Calling Theory - Steger et al.）、职业价值观理论（Super）
 * 参考量表：使命承诺量表（Calling and Vocation Questionnaire）、职业价值观问卷
 */
const careerMissionAssessment = {
  name: '事业使命感评估',
  score: 82,
  level: '良好',
  summary: '您有清晰的职业使命感，能够将个人价值观与社会价值结合，建议在使命传达和团队感召方面进一步加强影响力。',
  dimensions: [
    { name: '使命感清晰度', score: 85, description: '对自身使命和愿景的清晰程度' },
    { name: '社会价值认同', score: 80, description: '认同工作对社会贡献的程度' },
    { name: '内在驱动力', score: 84, description: '基于使命感而非外部奖励的工作动力' },
    { name: '使命坚持', score: 78, description: '在困难中坚持使命的韧性' },
    { name: '使命传达', score: 79, description: '向他人传达使命和价值观的能力' },
    { name: '使命整合', score: 86, description: '将使命融入日常工作决策的能力' }
  ]
};

// 用户基本信息
const userInfo = {
  name: '王芳',
  age: 45,
  avatar: '/avatar-3.jpg',
  connectionType: 'personLookingForJob', // 人找事/事找人/纯交流
  industry: '企业服务',
  need: '希望找到传统制造业的数字化转型项目机会，用15年HRBP经验帮助企业搭建AI时代的人才培养体系',
  abilityTags: ['HRBP', '团队管理', '人才发展', '组织优化', '数字化转型'],
  resourceTags: ['人才', '技术', '品牌'],
  currentDeclaration: {
    direction: 'confidence',
    text: '用15年HRBP经验，帮助企业搭建AI时代的人才培养体系，实现从传统HR到数字化HRBP的转型',
    summary: '基于15年人力资源管理经验，专注于企业数字化转型中的人才体系搭建与AI赋能实践',
    date: '2024年3月1日',
    views: 2847,
  },
  assessments: [entrepreneurialPsychologyAssessment, businessCognitionAssessment, aiCognitionAssessment, careerMissionAssessment] as Assessment[],
};

// 探访记录（管理员后台确认后出现）
const visitRecords = [
  {
    id: '1',
    title: '上海某制造业企业数字化转型探访',
    date: '2024年3月15日',
    role: '探访人',
    skill: '人力资源',
    industry: '企业转型',
    visitors: [
      { name: '李明', avatar: '/avatar-2.jpg', skill: '战略' },
      { name: '王芳', avatar: '/avatar-3.jpg', skill: '人力资源' },
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=120&fit=crop',
  },
  {
    id: '2',
    title: '杭州科技创业公司战略规划探访',
    date: '2024年3月12日',
    role: '探访人',
    skill: '组织优化',
    industry: '战略规划',
    visitors: [
      { name: '王芳', avatar: '/avatar-3.jpg', skill: '组织优化' },
      { name: '赵芳', avatar: '/avatar-3.jpg', skill: '运营' },
    ],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=120&fit=crop',
  },
];

// 参与的活动
const activities = [
  {
    id: '1',
    title: 'CEO转型期私董会',
    date: '2024年3月20日',
    status: '即将开始',
    category: '私董会',
  },
  {
    id: '2',
    title: 'AI加油圈2026期',
    date: '2024年3月15日',
    status: '进行中',
    category: '沙龙',
  },
];

// 数字资产产出
const digitalAssets = [
  {
    id: '1',
    title: 'AI时代HRBP实战手册',
    description: '基于15年经验总结的AI赋能人力资源管理全流程指南',
    type: '文档',
    size: '3.8MB',
    likes: 156,
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop',
  },
  {
    id: '2',
    title: '企业人才培养体系模板',
    description: '包含招聘、培养、晋升、激励全环节的实用模板',
    type: '表格',
    size: '2.1MB',
    likes: 234,
    cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&h=120&fit=crop',
  },
];

// 功能菜单
const menuItems = [
  {
    icon: Flame,
    label: '我的宣告',
    subtitle: '3条',
    action: 'view-declarations',
    route: '/declarations',
  },
  {
    icon: TrendingUp,
    label: '探访记录',
    subtitle: '2次',
    action: 'view-visits',
    route: '/visit/1',
  },
  {
    icon: Award,
    label: '数字资产',
    subtitle: '2个',
    action: 'view-assets',
    route: '/assets',
  },
  {
    icon: Briefcase,
    label: '参与活动',
    subtitle: '2个',
    action: 'view-activities',
    route: '/activities',
  },
  {
    icon: Bell,
    label: '消息通知',
    subtitle: '5条',
    action: 'view-notifications',
    route: '/notifications',
  },
  {
    icon: Settings,
    label: '设置',
    subtitle: '',
    action: 'view-settings',
    route: '/settings',
  },
];

// 量表图标映射
const getAssessmentIcon = (name: string) => {
  if (name === '创业心理评估') return '🧠';
  if (name === '商业认知评估') return '💼';
  if (name === 'AI认知评估') return '🤖';
  if (name === '事业使命感评估') return '🎯';
  return '📊';
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'records' | 'assets'>('records');

  return (
    <div className="min-h-screen bg-white pb-14">
      {/* 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        <div className="px-5 pt-[60px] pb-4 space-y-8">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-gray-900">个人中心</h1>
            <button className="p-2 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
              <Settings className="w-5 h-5 text-[rgba(0,0,0,0.25)]" />
            </button>
          </div>

          {/* 用户信息卡片 */}
          <div className="p-4 bg-white relative">
            {/* 标签戳 */}
            {userInfo.connectionType && (
              <div className={`absolute top-0 right-0 px-2 py-0.5 text-[9px] font-medium rounded-bl-md z-10 border-l-2 border-t-2 ${
                userInfo.connectionType === 'personLookingForJob'
                  ? 'bg-[rgba(34,197,94,0.15)] text-gray-600 border-gray-400'
                  : userInfo.connectionType === 'jobLookingForPerson'
                  ? 'bg-blue-100 text-gray-600 border-gray-400'
                  : 'bg-gray-100 text-gray-600 border-gray-400'
              }`}>
                {connectionType.find(t => t.id === userInfo.connectionType)?.label}
              </div>
            )}

            <div className="flex items-start space-x-4">
              {/* 方形头像 */}
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative">
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-400 flex items-center justify-center">
                  <Upload className="w-3 h-3 text-white" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{userInfo.name}</h2>
                  <p className="text-[13px] text-[rgba(0,0,0,0.25)]">{userInfo.age}岁</p>
                </div>
                {/* 行业标签 */}
                <div className="mt-2">
                  <span className="px-2.5 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal line-clamp-1">
                    {userInfo.industry}
                  </span>
                </div>
              </div>
            </div>

            {/* 能力标签 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {userInfo.abilityTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1"
                >
                  {tag}
                </span>
              ))}
              <button className="px-2.5 py-1 border border-dashed border-[rgba(0,0,0,0.25)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                +添加
              </button>
            </div>

            {/* 资源标签 */}
            <div className="mt-4">
              <div className="text-[11px] text-[rgba(0,0,0,0.25)] mb-2">资源标签（必填）</div>
              <div className="flex flex-wrap gap-2">
                {userInfo.resourceTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1"
                  >
                    {tag}
                  </span>
                ))}
                <button className="px-2.5 py-1 border border-dashed border-[rgba(0,0,0,0.25)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                  +添加
                </button>
              </div>
            </div>

            {/* 一句说清你的需要 */}
            <div className="mt-4 p-3 bg-[rgba(0,0,0,0.02)]">
              <div className="text-[11px] text-[rgba(0,0,0,0.25)] mb-1">一句话说清你的需求</div>
              <p className="text-[13px] text-gray-900 leading-relaxed line-clamp-3">
                {userInfo.need}
              </p>
            </div>

            {/* 当前宣告 */}
            <div className="mt-4 p-3 bg-[rgba(0,0,0,0.02)]">
              <div className="flex items-start space-x-2">
                <Flame className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[rgba(0,0,0,0.25)]">
                      {declarationDirections.find(d => d.id === userInfo.currentDeclaration.direction)?.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                        <Mic className="w-3 h-3 text-[rgba(0,0,0,0.25)]" />
                      </button>
                      <button className="p-1 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                        <PlayCircle className="w-3 h-3 text-[rgba(0,0,0,0.25)]" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-900 leading-relaxed line-clamp-2 mb-2">
                    {userInfo.currentDeclaration.text}
                  </p>
                  <p className="text-[11px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-2 mb-2">
                    {userInfo.currentDeclaration.summary}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[rgba(0,0,0,0.25)]">
                    <span>{userInfo.currentDeclaration.date}</span>
                    <span>{userInfo.currentDeclaration.views.toLocaleString()}次</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 编辑按钮 */}
            <div className="mt-4 flex justify-center">
              <Link href="/profile/edit">
                <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-6 py-2 flex items-center space-x-2">
                  <Edit className="w-3 h-3" />
                  <span>完善资料</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* 量表结果展示 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">量表</span>
                <span className="text-blue-400">评估</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-5">
              {userInfo.assessments.map((assessment: Assessment, idx: number) => (
                <div key={idx} className="p-4 bg-white">
                  {/* 量表标题和总分 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getAssessmentIcon(assessment.name)}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{assessment.name}</h3>
                        <Badge className={`rounded-none font-normal text-[10px] mt-1 ${
                          assessment.level === '优秀' ? 'bg-green-100 text-green-600' : 
                          assessment.level === '良好' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {assessment.level} · {assessment.score}分
                        </Badge>
                      </div>
                    </div>
                    <Link
                      href={`/assessment/${assessment.name === '创业心理评估' ? 'entrepreneurial-psychology' : assessment.name === '商业认知评估' ? 'business-cognition' : assessment.name === 'AI认知评估' ? 'ai-cognition' : 'career-mission'}`}
                    >
                      <Button className="bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.25)] font-normal text-[10px] px-3 py-1 h-7 flex items-center space-x-1">
                        <RotateCcw className="w-3 h-3" />
                        <span>重新测试</span>
                      </Button>
                    </Link>
                  </div>

                  {/* 一句话总结 */}
                  <div className="p-3 bg-[rgba(0,0,0,0.02)] mb-3">
                    <p className="text-[12px] text-gray-700 leading-relaxed">
                      {assessment.summary}
                    </p>
                  </div>

                  {/* 维度条形图 */}
                  <div className="space-y-2">
                    {assessment.dimensions.map((dimension: AssessmentDimension, dimIdx: number) => (
                      <div key={dimIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[rgba(0,0,0,0.25)]">
                          <span className="font-medium">{dimension.name}</span>
                          <span>{dimension.score}分</span>
                        </div>
                        <div className="w-full bg-[rgba(0,0,0,0.05)] h-2">
                          <div 
                            className={`h-2 rounded-none transition-all ${
                              dimension.score >= 90 ? 'bg-green-500' :
                              dimension.score >= 80 ? 'bg-blue-500' :
                              dimension.score >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${dimension.score}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-[rgba(0,0,0,0.25)] pl-1">
                          {dimension.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 探访记录 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">探访</span>
                <span className="text-blue-400">记录</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-3">
              {visitRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                      <img
                        src={record.image}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                        {record.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-[10px] text-[rgba(0,0,0,0.25)] mb-2">
                        <span>{record.date}</span>
                        <span>·</span>
                        <Badge className="rounded-none bg-[rgba(34,197,94,0.15)] text-green-600 font-normal text-[10px]">
                          {record.industry}
                        </Badge>
                        <span>·</span>
                        <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px]">
                          {record.role}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {record.visitors.map((visitor, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={visitor.avatar}
                                alt={visitor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[9px]">
                              {visitor.skill}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 参与的活动 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">参与</span>
                <span className="text-blue-400">活动</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {activity.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] text-[rgba(0,0,0,0.25)]">
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px]">
                        {activity.category}
                      </Badge>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-none font-normal text-[10px] ml-2 flex-shrink-0 ${
                      activity.status === '进行中'
                        ? 'bg-blue-400 text-white'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)]'
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 功能菜单 */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.route}
                className="w-full p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors flex items-center"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[rgba(0,0,0,0.25)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.label}
                      </span>
                      <span className="text-[13px] text-[rgba(0,0,0,0.25)] line-clamp-1">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.25)] ml-3 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
