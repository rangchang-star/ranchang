'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Clock, ChevronUp, ChevronDown, User, X, Briefcase, Users, Tag, Activity } from 'lucide-react';

// 咨询话题配置
const consultationTopics = [
  {
    id: 'ai-frontier',
    name: 'AI前沿',
    placeholder: '您在AI应用中遇到什么挑战？请描述具体场景，例如：如何将AI整合到现有业务流程中、选择合适的AI工具、AI实施的风险和成本控制等...',
    icon: '🤖',
  },
  {
    id: 'entrepreneur-psychology',
    name: '创业心理',
    placeholder: '作为创业者，您最困扰的是什么？请描述您的心境，例如：如何应对创业不确定性、团队管理中的心理挑战、失败后的心理重建、如何保持创业激情等...',
    icon: '🧠',
  },
  {
    id: 'business-logic',
    name: '商业逻辑',
    placeholder: '您的商业模式中遇到什么困惑？请具体描述，例如：如何找到盈利点、如何设计可持续的商业模式、如何验证市场需求、如何优化成本结构等...',
    icon: '💡',
  },
  {
    id: 'mission-navigation',
    name: '使命导航',
    placeholder: '您对事业使命有什么迷茫？请详细说明，例如：如何找到个人使命感、使命与现实的冲突、如何传递使命给团队、使命与盈利的平衡等...',
    icon: '🎯',
  },
];

// 咨询状态类型
type ConsultationStatus = 'pending' | 'processing' | 'completed';

// 模拟用户详细信息
const mockUserDetails = {
  '1': {
    id: '1',
    name: '王芳',
    avatar: '/avatar-3.jpg',
    age: 45,
    gender: '女',
    phone: '13812348888',
    email: 'wangfang@example.com',
    industry: '企业服务',
    company: 'XX科技有限公司',
    position: 'HRBP总监',
    connectionType: 'personLookingForJob',
    need: '希望找到传统制造业的数字化转型项目机会，用15年HRBP经验帮助企业搭建AI时代的人才培养体系',
    abilityTags: ['HRBP', '团队管理', '人才发展', '组织优化', '数字化转型'],
    resourceTags: ['人才', '技术', '品牌'],
    registerDate: '2024-01-15',
    lastLoginDate: '2024-03-15',
    consultationCount: 5,
    activityCount: 3,
  },
  '2': {
    id: '2',
    name: '李明',
    avatar: '/avatar-2.jpg',
    age: 38,
    gender: '男',
    phone: '13912346666',
    email: 'liming@example.com',
    industry: '互联网',
    company: 'YY创业公司',
    position: 'CEO',
    connectionType: 'jobLookingForPerson',
    need: '寻找合伙人，共同推进教育科技项目',
    abilityTags: ['产品管理', '市场营销', '融资', '团队搭建'],
    resourceTags: ['资金', '渠道', '品牌'],
    registerDate: '2024-02-01',
    lastLoginDate: '2024-03-14',
    consultationCount: 2,
    activityCount: 5,
  },
  '3': {
    id: '3',
    name: '张总',
    avatar: '/avatar-1.jpg',
    age: 52,
    gender: '男',
    phone: '13612349999',
    email: 'zhang@example.com',
    industry: '制造业',
    company: 'ZZ制造集团',
    position: '创始人',
    connectionType: 'personLookingForJob',
    need: '寻找数字化转型合作伙伴和资源',
    abilityTags: ['战略规划', '供应链管理', '品牌建设', '数字化转型'],
    resourceTags: ['资金', '供应链', '场地'],
    registerDate: '2024-01-20',
    lastLoginDate: '2024-03-13',
    consultationCount: 8,
    activityCount: 10,
  },
};

// 模拟咨询数据（不需要回复字段）
const mockConsultations = [
  {
    id: '1',
    userId: '1',
    userName: '王芳',
    userAvatar: '/avatar-3.jpg',
    topicId: 'ai-frontier',
    topicName: 'AI前沿',
    question: '我是做传统制造业的，想引入AI来优化生产线，但不知道从哪里开始，也不知道应该选择什么样的AI工具？',
    submitDate: '2024-03-15 14:30',
    status: 'pending' as ConsultationStatus,
  },
  {
    id: '2',
    userId: '2',
    userName: '李明',
    userAvatar: '/avatar-2.jpg',
    topicId: 'entrepreneur-psychology',
    topicName: '创业心理',
    question: '第一次创业失败后，心里一直很焦虑，不知道该不该继续创业，家人也不支持我继续尝试。',
    submitDate: '2024-03-14 10:15',
    status: 'processing' as ConsultationStatus,
  },
  {
    id: '3',
    userId: '3',
    userName: '张总',
    userAvatar: '/avatar-1.jpg',
    topicId: 'business-logic',
    topicName: '商业逻辑',
    question: '我们的产品很好，但就是找不到盈利模式，用户愿意用但不愿意付费，应该如何设计合理的商业模式？',
    submitDate: '2024-03-13 16:45',
    status: 'completed' as ConsultationStatus,
  },
  {
    id: '4',
    userId: '1',
    userName: '王芳',
    userAvatar: '/avatar-3.jpg',
    topicId: 'mission-navigation',
    topicName: '使命导航',
    question: '我现在在转型期，不太清楚自己的使命是什么，感觉自己没有方向，如何找到自己的使命感？',
    submitDate: '2024-03-12 09:20',
    status: 'processing' as ConsultationStatus,
  },
  {
    id: '5',
    userId: '2',
    userName: '李明',
    userAvatar: '/avatar-2.jpg',
    topicId: 'business-logic',
    topicName: '商业逻辑',
    question: '我想了解如何进行产品定价，以及如何建立可持续的盈利模式？',
    submitDate: '2024-03-11 15:30',
    status: 'pending' as ConsultationStatus,
  },
];

export default function AdminConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingPlaceholder, setEditingPlaceholder] = useState('');
  const [consultations, setConsultations] = useState(mockConsultations);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUserDetailDialog, setShowUserDetailDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showStatusConfirmDialog, setShowStatusConfirmDialog] = useState(false);
  const [statusConfirmInfo, setStatusConfirmInfo] = useState<{
    consultId: string;
    consultName: string;
    fromStatus: ConsultationStatus;
    toStatus: ConsultationStatus;
  } | null>(null);

  // 过滤咨询
  const filteredConsultations = consultations.filter((consult) => {
    const matchesSearch =
      consult.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consult.question.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic =
      selectedTopicFilter === '' || consult.topicId === selectedTopicFilter;

    const matchesStatus =
      selectedStatusFilter === '' || consult.status === selectedStatusFilter;

    return matchesSearch && matchesTopic && matchesStatus;
  });

  // 排序
  const sortedConsultations = [...filteredConsultations].sort((a, b) => {
    const dateA = new Date(a.submitDate).getTime();
    const dateB = new Date(b.submitDate).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // 编辑引导话术
  const handleSavePlaceholder = (topicId: string) => {
    const topic = consultationTopics.find((t) => t.id === topicId);
    if (topic) {
      console.log('保存引导话术:', topicId, editingPlaceholder);
      alert('引导话术保存成功！');
      setEditingTopic(null);
      setEditingPlaceholder('');
    }
  };

  // 切换咨询状态
  const handleStatusChange = (consultId: string, newStatus: ConsultationStatus) => {
    const consult = consultations.find(c => c.id === consultId);
    if (!consult) return;

    // 如果点击的是当前状态，不显示确认对话框
    if (consult.status === newStatus) return;

    // 显示确认对话框
    setStatusConfirmInfo({
      consultId,
      consultName: consult.userName,
      fromStatus: consult.status,
      toStatus: newStatus,
    });
    setShowStatusConfirmDialog(true);
  };

  // 确认状态切换
  const confirmStatusChange = () => {
    if (!statusConfirmInfo) return;

    setConsultations(prev =>
      prev.map(consult =>
        consult.id === statusConfirmInfo.consultId
          ? { ...consult, status: statusConfirmInfo.toStatus }
          : consult
      )
    );

    setShowStatusConfirmDialog(false);
    setStatusConfirmInfo(null);
  };

  // 取消状态切换
  const cancelStatusChange = () => {
    setShowStatusConfirmDialog(false);
    setStatusConfirmInfo(null);
  };

  // 获取状态标签配置
  const getStatusBadge = (status: ConsultationStatus) => {
    const statusConfig = {
      pending: { label: '待处理', bg: 'bg-yellow-400' },
      processing: { label: '处理中', bg: 'bg-blue-400' },
      completed: { label: '已处理', bg: 'bg-green-400' },
    };
    const config = statusConfig[status];
    return (
      <Badge className={`rounded-none ${config.bg} text-white font-normal text-[10px]`}>
        {config.label}
      </Badge>
    );
  };

  // 获取连接类型标签
  const getConnectionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      personLookingForJob: '人找事',
      jobLookingForPerson: '事找人',
      pureExchange: '纯交流',
    };
    return typeMap[type] || type;
  };

  // 显示用户详细信息
  const showUserDetail = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserDetailDialog(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">咨询管理</h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">管理用户咨询与话题引导话术</p>
          </div>
          <Button>导出数据</Button>
        </div>

        {/* 话题引导话术管理 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900">话题引导话术</h3>
          </div>
          <div className="p-4 space-y-4">
            {consultationTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[rgba(0,0,0,0.02)] p-4 hover:bg-[rgba(0,0,0,0.03)] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{topic.icon}</span>
                    <h4 className="text-[13px] font-semibold text-gray-900">
                      {topic.name}
                    </h4>
                  </div>
                  {editingTopic !== topic.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTopic(topic.id);
                        setEditingPlaceholder(topic.placeholder);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                  )}
                </div>

                {editingTopic === topic.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingPlaceholder}
                      onChange={(e) => setEditingPlaceholder(e.target.value)}
                      placeholder="编辑引导话术..."
                      className="text-[13px]"
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSavePlaceholder(topic.id)}
                      >
                        保存
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTopic(null);
                          setEditingPlaceholder('');
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] text-[rgba(0,0,0,0.6)] leading-relaxed">
                    {topic.placeholder}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                placeholder="搜索用户、问题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-[13px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[13px] text-[rgba(0,0,0,0.6)]">时间排序：</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-1"
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>{sortOrder === 'asc' ? '升序' : '降序'}</span>
              </Button>
            </div>
          </div>

          {/* 筛选标签 */}
          <div className="flex items-center flex-wrap gap-3">
            {/* 话题筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-[13px] text-[rgba(0,0,0,0.6)]">话题：</span>
              <button
                onClick={() => setSelectedTopicFilter('')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  selectedTopicFilter === ''
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                全部
              </button>
              {consultationTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicFilter(topic.id)}
                  className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                    selectedTopicFilter === topic.id
                      ? 'bg-[rgba(59,130,246,0.4)] text-white'
                      : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                  }`}
                >
                  {topic.icon} {topic.name}
                </button>
              ))}
            </div>

            {/* 状态筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-[13px] text-[rgba(0,0,0,0.6)]">状态：</span>
              <button
                onClick={() => setSelectedStatusFilter('')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  selectedStatusFilter === ''
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedStatusFilter('pending')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  selectedStatusFilter === 'pending'
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                待处理
              </button>
              <button
                onClick={() => setSelectedStatusFilter('processing')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  selectedStatusFilter === 'processing'
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                处理中
              </button>
              <button
                onClick={() => setSelectedStatusFilter('completed')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  selectedStatusFilter === 'completed'
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                已处理
              </button>
            </div>
          </div>
        </div>

        {/* 咨询列表 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900">
              咨询列表（{sortedConsultations.length}）
            </h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {sortedConsultations.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  暂无符合条件的咨询
                </p>
              </div>
            ) : (
              sortedConsultations.map((consult) => (
                <div
                  key={consult.id}
                  className="p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* 用户头像（可点击） */}
                    <button
                      onClick={() => showUserDetail(consult.userId)}
                      className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-blue-400 transition-colors"
                    >
                      <img
                        src={consult.userAvatar}
                        alt={consult.userName}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* 标题行 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h4 className="text-[13px] font-semibold text-gray-900">
                            {consult.userName}
                          </h4>
                          <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[10px]">
                            {consult.topicName}
                          </Badge>
                          {getStatusBadge(consult.status)}
                        </div>
                        <div className="flex items-center space-x-1 text-[11px] text-[rgba(0,0,0,0.4)]">
                          <Clock className="w-3 h-3" />
                          <span>{consult.submitDate}</span>
                        </div>
                      </div>

                      {/* 问题内容 */}
                      <p className="text-[13px] text-[rgba(0,0,0,0.8)] leading-relaxed mb-3">
                        {consult.question}
                      </p>

                      {/* 状态切换按钮 */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[12px] text-[rgba(0,0,0,0.5)]">状态：</span>
                        {(['pending', 'processing', 'completed'] as ConsultationStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(consult.id, status)}
                            className={`px-2 py-1 text-[11px] font-normal transition-colors ${
                              consult.status === status
                                ? status === 'pending'
                                  ? 'bg-yellow-400 text-white'
                                  : status === 'processing'
                                  ? 'bg-blue-400 text-white'
                                  : 'bg-green-400 text-white'
                                : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                            }`}
                          >
                            {status === 'pending' ? '待处理' : status === 'processing' ? '处理中' : '已处理'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 状态切换确认对话框 */}
      {showStatusConfirmDialog && statusConfirmInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-md">
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">确认状态切换</h3>
            </div>

            {/* 内容 */}
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                您要将咨询状态从
                <span className="mx-1 font-semibold text-gray-900">
                  {statusConfirmInfo.fromStatus === 'pending' ? '待处理' : statusConfirmInfo.fromStatus === 'processing' ? '处理中' : '已处理'}
                </span>
                切换为
                <span className="mx-1 font-semibold text-gray-900">
                  {statusConfirmInfo.toStatus === 'pending' ? '待处理' : statusConfirmInfo.toStatus === 'processing' ? '处理中' : '已处理'}
                </span>
                吗？
              </p>
              <div className="bg-[rgba(0,0,0,0.03)] p-4 rounded-none">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-[rgba(0,0,0,0.5)]">用户：</span>
                  <span className="text-sm font-medium text-gray-900">{statusConfirmInfo.consultName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[rgba(0,0,0,0.5)]">咨询ID：</span>
                  <span className="text-sm text-gray-700">{statusConfirmInfo.consultId}</span>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex border-t border-gray-200">
              <button
                onClick={cancelStatusChange}
                className="flex-1 py-3 text-sm text-gray-600 hover:bg-gray-50 border-r border-gray-200"
              >
                取消
              </button>
              <button
                onClick={confirmStatusChange}
                className="flex-1 py-3 text-sm text-white bg-[rgba(59,130,246,0.4)] hover:bg-[rgba(59,130,246,0.5)]"
              >
                确认切换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 用户详细信息悬浮页面 */}
      {showUserDetailDialog && selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 头部 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-gray-900">用户详细信息</h3>
              </div>
              <button
                onClick={() => setShowUserDetailDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-none"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {(() => {
                const user = mockUserDetails[selectedUserId as keyof typeof mockUserDetails];
                if (!user) return null;
                return (
                  <>
                    {/* 基本信息 */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                          <div className="flex items-center space-x-3 mt-1 text-[13px] text-[rgba(0,0,0,0.6)]">
                            <span>{user.gender}</span>
                            <span>{user.age}岁</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* 联系方式 */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span>联系方式</span>
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">手机：</span>
                          <span className="text-gray-700">{user.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">邮箱：</span>
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* 职业信息 */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <span>职业信息</span>
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">公司：</span>
                          <span className="text-gray-700">{user.company}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">职位：</span>
                          <span className="text-gray-700">{user.position}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">行业：</span>
                          <span className="text-gray-700">{user.industry}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">类型：</span>
                          <Badge className="rounded-none bg-[rgba(59,130,246,0.15)] text-blue-600 font-normal text-[11px]">
                            {getConnectionTypeLabel(user.connectionType)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* 需求描述 */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-blue-400" />
                        <span>需求描述</span>
                      </h5>
                      <p className="text-[13px] text-gray-700 leading-relaxed">
                        {user.need}
                      </p>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* 能力标签 */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>能力标签</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {user.abilityTags.map((tag) => (
                          <Badge
                            key={tag}
                            className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.7)] font-normal text-[11px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* 资源标签 */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <span>资源标签</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {user.resourceTags.map((tag) => (
                          <Badge
                            key={tag}
                            className="rounded-none bg-[rgba(34,197,94,0.15)] text-green-600 font-normal text-[11px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* 账户信息 */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span>账户信息</span>
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">注册时间：</span>
                          <span className="text-gray-700">{user.registerDate}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">最后登录：</span>
                          <span className="text-gray-700">{user.lastLoginDate}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">咨询次数：</span>
                          <span className="text-gray-700">{user.consultationCount}次</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[rgba(0,0,0,0.5)] w-16">活动次数：</span>
                          <span className="text-gray-700">{user.activityCount}次</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* 底部按钮 */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUserDetailDialog(false)}
                  className="flex-1"
                >
                  关闭
                </Button>
                <Button className="flex-1 bg-[rgba(59,130,246,0.4)] hover:bg-[rgba(59,130,246,0.5)]">
                  查看完整资料
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
