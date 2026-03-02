'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Flame, TrendingUp, Briefcase, Award, ChevronRight, PlayCircle, Clock, Heart, Edit, Mic, Upload } from 'lucide-react';

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

// 量表结果数据（图形化展示）
const assessmentResults = [
  {
    name: '创业心理评估',
    score: 85,
    level: '优秀',
    dimensions: [
      { name: '抗压能力', score: 90 },
      { name: '创新能力', score: 85 },
      { name: '团队协作', score: 80 },
      { name: '风险意识', score: 82 }
    ]
  },
  {
    name: '商业认知评估',
    score: 78,
    level: '良好',
    dimensions: [
      { name: '市场洞察', score: 75 },
      { name: '商业模式', score: 80 },
      { name: '财务分析', score: 72 },
      { name: '战略规划', score: 85 }
    ]
  },
  {
    name: 'AI认知评估',
    score: 88,
    level: '优秀',
    dimensions: [
      { name: 'AI工具应用', score: 92 },
      { name: 'AI趋势理解', score: 85 },
      { name: 'AI思维', score: 88 },
      { name: 'AI落地实践', score: 85 }
    ]
  }
];

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
  assessments: assessmentResults,
};

// 正在进行的连接
const activeConnections = [
  {
    id: '1',
    name: '李明',
    avatar: '/avatar-2.jpg',
    tags: ['投融资', '战略规划'],
    status: '洽谈中',
  },
  {
    id: '2',
    name: '张总',
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=ceo',
    tags: ['制造业', '企业转型'],
    status: '已确认',
  },
];

// 探访记录
const visitRecords = [
  {
    id: '1',
    title: '上海某制造业企业数字化转型探访',
    date: '2024年3月15日',
    role: '探访人',
    skill: '人力资源',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=120&fit=crop',
  },
  {
    id: '2',
    title: '杭州科技创业公司战略规划探访',
    date: '2024年3月12日',
    role: '探访人',
    skill: '组织优化',
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
  },
  {
    icon: TrendingUp,
    label: '探访记录',
    subtitle: '12次',
    action: 'view-visits',
  },
  {
    icon: Briefcase,
    label: '能力连接',
    subtitle: '5个进行中',
    action: 'view-connections',
  },
  {
    icon: Award,
    label: '数字资产',
    subtitle: '8个',
    action: 'view-assets',
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'records' | 'assets'>('records');
  const [showEditModal, setShowEditModal] = useState(false);

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

            {/* 一句说清你的需要 */}
            <div className="mt-4 p-3 bg-[rgba(0,0,0,0.02)]">
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
              <Button 
                onClick={() => setShowEditModal(true)}
                className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-6 py-2 flex items-center space-x-2"
              >
                <Edit className="w-3 h-3" />
                <span>完善资料</span>
              </Button>
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
            <div className="space-y-4">
              {userInfo.assessments.map((assessment, idx) => (
                <div key={idx} className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">{assessment.name}</h3>
                    <Badge className={`rounded-none font-normal text-[10px] ${
                      assessment.level === '优秀' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {assessment.level} · {assessment.score}分
                    </Badge>
                  </div>
                  {/* 维度条形图 */}
                  <div className="space-y-2">
                    {assessment.dimensions.map((dimension, dimIdx) => (
                      <div key={dimIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[rgba(0,0,0,0.25)]">
                          <span>{dimension.name}</span>
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 正在进行的连接 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">正在</span>
                <span className="text-blue-400">连接</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-3">
              {activeConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors flex items-start space-x-3"
                >
                  <div className="w-10 h-10 flex-shrink-0 overflow-hidden">
                    <img
                      src={conn.avatar}
                      alt={conn.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{conn.name}</h3>
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px]">
                        {conn.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {conn.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[10px] font-normal line-clamp-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 行动轨迹与数字资产 */}
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('records')}
                className={`text-sm font-normal transition-colors ${
                  activeTab === 'records' ? 'text-blue-400' : 'text-[rgba(0,0,0,0.25)]'
                }`}
              >
                探访记录
              </button>
              <button
                onClick={() => setActiveTab('assets')}
                className={`text-sm font-normal transition-colors ${
                  activeTab === 'assets' ? 'text-blue-400' : 'text-[rgba(0,0,0,0.25)]'
                }`}
              >
                数字资产
              </button>
            </div>

            {/* 探访记录 */}
            {activeTab === 'records' && (
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
                        <div className="flex items-center space-x-2 text-[10px] text-[rgba(0,0,0,0.25)]">
                          <span>{record.date}</span>
                          <span>·</span>
                          <span>{record.role}</span>
                          <span>·</span>
                          <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px]">
                            {record.skill}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 数字资产 */}
            {activeTab === 'assets' && (
              <div className="space-y-3">
                {digitalAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  >
                    <div className="mb-2 overflow-hidden">
                      <img
                        src={asset.cover}
                        alt={asset.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-1">
                          {asset.title}
                        </h4>
                        <p className="text-[11px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-2">
                          {asset.description}
                        </p>
                      </div>
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px] ml-2 flex-shrink-0">
                        {asset.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[rgba(0,0,0,0.25)]">
                      <span>{asset.size}</span>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{asset.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <button
                key={item.label}
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
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
