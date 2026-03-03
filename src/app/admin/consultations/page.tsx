'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, CheckCircle, Clock } from 'lucide-react';

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

// 模拟咨询数据
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
    status: 'pending',
    reply: null,
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
    status: 'replied',
    reply: '失败是创业路上的常态，重要的是从失败中学习。建议先调整心态，寻找同行者支持，可以考虑参加我们的创业支持小组。',
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
    status: 'pending',
    reply: null,
  },
];

export default function AdminConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('');
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingPlaceholder, setEditingPlaceholder] = useState('');

  const filteredConsultations = mockConsultations.filter((consult) => {
    const matchesSearch =
      consult.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consult.question.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic =
      selectedTopicFilter === '' || consult.topicId === selectedTopicFilter;

    return matchesSearch && matchesTopic;
  });

  // 编辑引导话术
  const handleSavePlaceholder = (topicId: string) => {
    const topic = consultationTopics.find((t) => t.id === topicId);
    if (topic) {
      // 实际项目中需要调用API保存
      console.log('保存引导话术:', topicId, editingPlaceholder);
      alert('引导话术保存成功！');
      setEditingTopic(null);
      setEditingPlaceholder('');
    }
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    if (status === 'pending') {
      return (
        <Badge className="rounded-none bg-yellow-400 text-white font-normal text-[10px]">
          待处理
        </Badge>
      );
    }
    return (
      <Badge className="rounded-none bg-green-400 text-white font-normal text-[10px]">
        已回复
      </Badge>
    );
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
          </div>

          {/* 话题筛选 */}
          <div className="flex items-center space-x-2">
            <span className="text-[13px] text-[rgba(0,0,0,0.6)]">话题筛选：</span>
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
        </div>

        {/* 咨询列表 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900">
              咨询列表（{filteredConsultations.length}）
            </h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {filteredConsultations.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  暂无符合条件的咨询
                </p>
              </div>
            ) : (
              filteredConsultations.map((consult) => (
                <div
                  key={consult.id}
                  className="p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* 用户头像 */}
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={consult.userAvatar}
                        alt={consult.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 标题行 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
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

                      {/* 回复内容 */}
                      {consult.reply && (
                        <div className="bg-[rgba(0,0,0,0.03)] p-3 rounded-none">
                          <div className="flex items-center space-x-1 mb-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-[11px] font-medium text-gray-700">
                              回复
                            </span>
                          </div>
                          <p className="text-[12px] text-[rgba(0,0,0,0.7)] leading-relaxed">
                            {consult.reply}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
