'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, XCircle, Search, Send, Mail, 
  User, Calendar, Target, UserCheck, Filter, ChevronRight,
  MessageSquare, Clock, Bell, ArrowUp, ArrowDown, ChevronUp,
  Phone, Building
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Textarea } from '@/components/ui/textarea';

// 申请类型定义
type ApplicationType = 'activity' | 'visit' | 'boardMember' | 'visitTarget';

interface Application {
  id: string;
  type: ApplicationType;
  applicantName: string;
  applicantPhone: string;
  applicantCompany?: string;
  applicantPosition?: string;
  targetName?: string;
  targetId?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  applyTime: string;
}

// 会员标签
const memberTags = [
  'AI应用', '数字化转型', '供应链', '智能制造', '新能源',
  '医疗健康', '教育培训', '金融投资', '互联网', '制造业',
  '企业家', '创业者', '高管', '自由职业'
];

const typeConfig = {
  activity: { 
    label: '活动申请', 
    icon: Calendar, 
    color: 'bg-blue-50 text-blue-600',
    targetLabel: '活动名称'
  },
  visit: { 
    label: '探访申请', 
    icon: Target, 
    color: 'bg-green-50 text-green-600',
    targetLabel: '探访对象'
  },
  boardMember: { 
    label: '私董会案主', 
    icon: UserCheck, 
    color: 'bg-purple-50 text-purple-600',
    targetLabel: ''
  },
  visitTarget: { 
    label: '被探访案主', 
    icon: User, 
    color: 'bg-orange-50 text-orange-600',
    targetLabel: ''
  },
};

export default function AdminMessagesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | ApplicationType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [timeSort, setTimeSort] = useState<'asc' | 'desc' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 消息发送相关状态
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');

  // 加载申请数据
  useEffect(() => {
    async function loadApplications() {
      try {
        setIsLoading(true);

        // 从 API 获取活动申请
        const response = await fetch('/api/admin/activity-applications');
        const data = await response.json();

        if (data.success && data.data) {
          // 转换为统一的申请格式
          const formattedApplications: Application[] = data.data.map((app: any) => {
            return {
              id: app.id,
              type: 'activity',
              applicantName: app.user_name || '未知',
              applicantPhone: app.user_phone || '未知',
              applicantCompany: '',
              applicantPosition: '',
              targetName: app.activity_title || '',
              targetId: app.activity_id,
              reason: app.reason || '',
              status: app.status as 'pending' | 'approved' | 'rejected',
              applyTime: app.created_at,
            };
          });

          setApplications(formattedApplications);
        }
      } catch (error) {
        console.error('加载申请数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();
  }, []);

  // 获取待审核数量
  const getPendingCount = (type?: ApplicationType) => {
    return applications.filter(app => 
      app.status === 'pending' && 
      (type ? app.type === type : true)
    ).length;
  };

  // 筛选申请
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.applicantCompany || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || app.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (!timeSort) return 0;
    const dateA = new Date(a.applyTime).getTime();
    const dateB = new Date(b.applyTime).getTime();
    return timeSort === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // 审批处理
  const handleApprove = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/admin/activity-applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      const data = await response.json();
      
      if (!data.success) {
        alert('审核失败');
        return;
      }

      // 更新前端状态
      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: 'approved' as const } : app
      );
      setApplications(updatedApplications);
    } catch (error) {
      console.error('审核失败:', error);
      alert('审核失败');
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/admin/activity-applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      const data = await response.json();
      
      if (!data.success) {
        alert('审核失败');
        return;
      }

      // 更新前端状态
      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: 'rejected' as const } : app
      );
      setApplications(updatedApplications);
    } catch (error) {
      console.error('审核失败:', error);
      alert('审核失败');
    }
  };

  // 消息发送处理
  const handleSendMessage = () => {
    // TODO: 实现消息发送功能
    alert('消息发送功能待实现');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">消息管理</h1>
            <p className="text-sm text-gray-600 mt-1">管理各类申请和通知消息</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowMessageDialog(true)}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            发送消息
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待审核</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {getPendingCount()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已通过</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已拒绝</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {applications.filter(app => app.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总计</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {applications.length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索申请人姓名或公司..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedType('all');
                setSelectedStatus('pending');
                setSearchTerm('');
                setTimeSort(null);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              重置筛选
            </Button>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* 类型筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">类型:</span>
              <Tabs
                value={selectedType}
                onValueChange={(v) => setSelectedType(v as any)}
                className="flex"
              >
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="activity">活动</TabsTrigger>
                  <TabsTrigger value="visit">探访</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 状态筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">状态:</span>
              <Tabs
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as any)}
                className="flex"
              >
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="pending">待审核</TabsTrigger>
                  <TabsTrigger value="approved">已通过</TabsTrigger>
                  <TabsTrigger value="rejected">已拒绝</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 时间排序 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">时间:</span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeSort(timeSort === 'asc' ? null : 'asc')}
                  className={timeSort === 'asc' ? 'bg-blue-50 border-blue-200' : ''}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeSort(timeSort === 'desc' ? null : 'desc')}
                  className={timeSort === 'desc' ? 'bg-blue-50 border-blue-200' : ''}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 申请列表 */}
        <div className="bg-white rounded-lg border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              加载中...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              暂无申请数据
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => {
                const config = typeConfig[application.type];
                const Icon = config.icon;

                return (
                  <div
                    key={application.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* 类型图标 */}
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* 主要信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                {application.applicantName}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {config.label}
                              </Badge>
                              <Badge
                                variant={
                                  application.status === 'approved'
                                    ? 'default'
                                    : application.status === 'rejected'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {application.status === 'pending' && '待审核'}
                                {application.status === 'approved' && '已通过'}
                                {application.status === 'rejected' && '已拒绝'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {application.applicantPhone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3.5 w-3.5" />
                                  {application.applicantPhone}
                                </div>
                              )}
                              {application.applicantCompany && (
                                <div className="flex items-center gap-2">
                                  <Building className="h-3.5 w-3.5" />
                                  {application.applicantCompany}
                                </div>
                              )}
                              {application.targetName && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {config.targetLabel}: {application.targetName}
                                </div>
                              )}
                              {application.reason && (
                                <div className="flex items-start gap-2 mt-2">
                                  <MessageSquare className="h-3.5 w-3.5 mt-0.5" />
                                  <span className="text-xs">{application.reason}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 操作按钮 */}
                          {application.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(application.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                拒绝
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(application.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                通过
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* 申请时间 */}
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          申请时间: {new Date(application.applyTime).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 发送消息对话框 */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                <VisuallyHidden>发送消息</VisuallyHidden>
              </DialogTitle>
              <div className="flex items-center gap-2 mb-4">
                <Send className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold">发送消息</h2>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* 会员标签选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  接收人标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {memberTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 消息内容 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  消息内容
                </label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="请输入消息内容..."
                  rows={6}
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMessageDialog(false);
                    setSelectedTags([]);
                    setMessageContent('');
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  发送
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
