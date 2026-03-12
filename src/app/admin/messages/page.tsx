'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, XCircle, Search, Send, Mail, 
  User, Calendar, Target, UserCheck, Filter, ChevronRight,
  MessageSquare, Clock, Bell, ArrowUp, ArrowDown, ChevronUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db';

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
  status: 'registered' | 'approved' | 'rejected';
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
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'registered' | 'approved' | 'rejected'>('registered');
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

        // 调用API获取待审批记录
        const response = await fetch('/admin/api/approvals?status=registered');

        if (!response.ok) {
          throw new Error('加载数据失败');
        }

        const result = await response.json();

        if (result.success) {
          // 转换为统一的申请格式
          const formattedApplications: Application[] = result.data.map((item: any) => ({
            id: String(item.id),
            type: item.registrationType as ApplicationType,
            applicantName: item.userName || '未知',
            applicantPhone: item.userPhone || '未知',
            applicantCompany: item.userCompany || '',
            applicantPosition: item.userPosition || '',
            targetName: item.activityTitle || item.visitCompanyName || '',
            targetId: item.activityId || item.visitId,
            reason: item.note || '',
            status: item.status as 'pending' | 'approved' | 'rejected',
            applyTime: item.registeredAt,
          }));

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
      app.status === 'registered' && 
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
  const handleApprove = async (applicationId: string, type: ApplicationType) => {
    try {
      const response = await fetch(`/admin/api/approvals/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('审核失败');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '审核失败');
      }

      // 更新前端状态
      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: 'approved' as const } : app
      );
      setApplications(updatedApplications);
    } catch (error: any) {
      console.error('审核失败:', error);
      alert(error.message || '审核失败');
    }
  };

  const handleReject = async (applicationId: string, type: ApplicationType) => {
    try {
      const response = await fetch(`/admin/api/approvals/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('审核失败');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '审核失败');
      }

      // 更新前端状态
      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: 'rejected' as const } : app
      );
      setApplications(updatedApplications);
    } catch (error: any) {
      console.error('审核失败:', error);
      alert(error.message || '审核失败');
    }
  };

  // 切换标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 发送消息
  const handleSendMessage = () => {
    if (selectedTags.length === 0 || !messageContent.trim()) {
      alert('请选择标签并填写消息内容');
      return;
    }

    // 模拟发送消息
    const memberCount = Math.floor(Math.random() * 20) + 5;
    alert(`消息已发送给 ${memberCount} 位标签包含 ${selectedTags.join('、')} 的会员`);
    
    // 重置表单
    setSelectedTags([]);
    setMessageContent('');
    setShowMessageDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 mb-1">消息管理</h1>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">审批各类申请并群发消息</p>
          </div>
          <Button 
            className="bg-blue-400 hover:bg-blue-500 text-white text-[13px]"
            onClick={() => setShowMessageDialog(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            发送消息
          </Button>
        </div>

        <Tabs defaultValue="registered" className="space-y-4">
          <TabsList className="bg-[rgba(0,0,0,0.05)] p-1">
            <TabsTrigger value="registered" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              待审批 ({getPendingCount()})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              全部申请
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registered" className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
                <Input
                  placeholder="搜索申请人或公司..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <button
                onClick={() => setTimeSort(timeSort === 'desc' ? null : 'desc')}
                className={`flex items-center space-x-2 px-3 py-2 border text-[13px] transition-colors ${
                  timeSort === 'desc' 
                    ? 'border-blue-400 bg-blue-50 text-blue-600' 
                    : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                }`}
                title="按时间降序"
              >
                <Clock className="w-4 h-4" />
                <ArrowDown className="w-3 h-3" />
                <span>最新</span>
              </button>
              <button
                onClick={() => setTimeSort(timeSort === 'asc' ? null : 'asc')}
                className={`flex items-center space-x-2 px-3 py-2 border text-[13px] transition-colors ${
                  timeSort === 'asc' 
                    ? 'border-blue-400 bg-blue-50 text-blue-600' 
                    : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                }`}
                title="按时间升序"
              >
                <Clock className="w-4 h-4" />
                <ArrowUp className="w-3 h-3" />
                <span>最早</span>
              </button>
            </div>
            {renderApplicationList('pending')}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4 mb-4">
              {/* 搜索框 */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
                  <Input
                    placeholder="搜索申请人或公司..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <button
                  onClick={() => setTimeSort(timeSort === 'desc' ? null : 'desc')}
                  className={`flex items-center space-x-2 px-3 py-2 border text-[13px] transition-colors ${
                    timeSort === 'desc' 
                      ? 'border-blue-400 bg-blue-50 text-blue-600' 
                      : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                  }`}
                  title="按时间降序"
                >
                  <Clock className="w-4 h-4" />
                  <ArrowDown className="w-3 h-3" />
                  <span>最新</span>
                </button>
                <button
                  onClick={() => setTimeSort(timeSort === 'asc' ? null : 'asc')}
                  className={`flex items-center space-x-2 px-3 py-2 border text-[13px] transition-colors ${
                    timeSort === 'asc' 
                      ? 'border-blue-400 bg-blue-50 text-blue-600' 
                      : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                  }`}
                  title="按时间升序"
                >
                  <Clock className="w-4 h-4" />
                  <ArrowUp className="w-3 h-3" />
                  <span>最早</span>
                </button>
              </div>

              {/* 类型标签筛选 */}
              <div className="flex items-center space-x-3">
                <span className="text-[13px] text-[rgba(0,0,0,0.6)]">类型筛选：</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedType === 'all'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    全部类型
                  </button>
                  <button
                    onClick={() => setSelectedType('activity')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedType === 'activity'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    活动申请
                  </button>
                  <button
                    onClick={() => setSelectedType('boardMember')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedType === 'boardMember'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    私董会案主
                  </button>
                  <button
                    onClick={() => setSelectedType('visit')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedType === 'visit'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    探访项目
                  </button>
                  <button
                    onClick={() => setSelectedType('visitTarget')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedType === 'visitTarget'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    被探访案主
                  </button>
                </div>
              </div>

              {/* 状态筛选 */}
              <div className="flex items-center space-x-3">
                <span className="text-[13px] text-[rgba(0,0,0,0.6)]">状态筛选：</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedStatus === 'all'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    全部状态
                  </button>
                  <button
                    onClick={() => setSelectedStatus('registered')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedStatus === 'registered'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    待审批
                  </button>
                  <button
                    onClick={() => setSelectedStatus('approved')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedStatus === 'approved'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    已通过
                  </button>
                  <button
                    onClick={() => setSelectedStatus('rejected')}
                    className={`px-3 py-1.5 text-[12px] border transition-colors ${
                      selectedStatus === 'rejected'
                        ? 'bg-blue-400 border-blue-400 text-white'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                    }`}
                  >
                    已拒绝
                  </button>
                </div>
              </div>
            </div>

            {renderApplicationList(selectedStatus)}
          </TabsContent>
        </Tabs>

        {/* 发送消息弹窗 */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="w-[95%] max-w-[600px] max-h-[85vh] overflow-y-auto">
            <VisuallyHidden>
              <DialogTitle>发送消息</DialogTitle>
            </VisuallyHidden>
            
            <div className="space-y-6">
              {/* 标题 */}
              <div className="flex items-center space-x-3 pb-4 border-b border-[rgba(0,0,0,0.1)]">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">发送群发消息</h3>
                  <p className="text-[12px] text-[rgba(0,0,0,0.6)]">按标签向会员发送消息通知</p>
                </div>
              </div>

              {/* 标签选择 */}
              <div>
                <label className="block text-[13px] font-medium text-gray-900 mb-3">
                  选择接收会员标签
                  <span className="text-[rgba(0,0,0,0.4)] font-normal ml-2">
                    (已选 {selectedTags.length} 个)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {memberTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 text-[12px] border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-400 border-blue-400 text-white'
                          : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:border-blue-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 消息内容 */}
              <div>
                <label className="block text-[13px] font-medium text-gray-900 mb-3">
                  消息内容
                </label>
                <Textarea
                  placeholder="请输入要发送的消息内容..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="min-h-[150px] text-[13px]"
                  maxLength={500}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[12px] text-[rgba(0,0,0,0.4)]">
                    消息将发送给标签匹配的会员
                  </span>
                  <span className="text-[12px] text-[rgba(0,0,0,0.4)]">
                    {messageContent.length}/500
                  </span>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(0,0,0,0.1)]">
                <Button
                  variant="outline"
                  onClick={() => setShowMessageDialog(false)}
                  className="border-[rgba(0,0,0,0.1)] text-[13px]"
                >
                  取消
                </Button>
                <Button
                  className="bg-blue-400 hover:bg-blue-500 text-white text-[13px]"
                  onClick={handleSendMessage}
                  disabled={selectedTags.length === 0 || !messageContent.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  发送消息
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );

  function renderApplicationList(statusFilter: 'all' | 'registered' | 'approved' | 'rejected') {
    let listToRender: Application[];

    if (statusFilter === 'registered') {
      // 待审批列表：筛选状态为registered，然后应用搜索和排序
      listToRender = applications
        .filter(app => app.status === 'registered')
        .filter(app => {
          const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (app.applicantCompany || '').toLowerCase().includes(searchTerm.toLowerCase());
          return matchesSearch;
        })
        .sort((a, b) => {
          if (!timeSort) return 0;
          const dateA = new Date(a.applyTime).getTime();
          const dateB = new Date(b.applyTime).getTime();
          return timeSort === 'asc' ? dateA - dateB : dateB - dateA;
        });
    } else {
      // 其他列表使用filteredApplications
      listToRender = filteredApplications;
    }

    if (listToRender.length === 0) {
      return (
        <div className="text-center py-12 bg-[rgba(0,0,0,0.02)] border border-dashed border-[rgba(0,0,0,0.1)]">
          <MessageSquare className="w-12 h-12 text-[rgba(0,0,0,0.2)] mx-auto mb-3" />
          <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
            暂无相关申请
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {listToRender.map((application) => {
          const config = typeConfig[application.type];
          const Icon = config.icon;
          
          return (
            <div
              key={application.id}
              className="bg-white border border-[rgba(0,0,0,0.08)] p-4 space-y-3"
            >
              {/* 申请头部 */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* 类型图标 */}
                  <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* 申请信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[13px] font-medium text-gray-900">
                        {application.applicantName}
                      </span>
                      {application.applicantCompany && (
                        <>
                          <span className="text-[rgba(0,0,0,0.3)]">·</span>
                          <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                            {application.applicantCompany}
                          </span>
                        </>
                      )}
                      {application.applicantPosition && (
                        <>
                          <span className="text-[rgba(0,0,0,0.3)]">·</span>
                          <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                            {application.applicantPosition}
                          </span>
                        </>
                      )}
                    </div>

                    {/* 申请类型和目标 */}
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-[11px] font-normal ${config.color}`}>
                        {config.label}
                      </Badge>
                      {application.targetName && (
                        <>
                          <ChevronRight className="w-3 h-3 text-[rgba(0,0,0,0.3)]" />
                          <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                            {application.targetName}
                          </span>
                        </>
                      )}
                    </div>

                    {/* 申请理由 */}
                    <p className="text-[13px] text-[rgba(0,0,0,0.6)] line-clamp-2">
                      {application.reason}
                    </p>
                  </div>
                </div>

                {/* 时间和状态 */}
                <div className="text-right ml-4">
                  <div className="flex items-center justify-end space-x-1 mb-2">
                    <Clock className="w-3 h-3 text-[rgba(0,0,0,0.4)]" />
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      {application.applyTime}
                    </span>
                  </div>
                  <Badge
                    className={`text-[11px] font-normal ${
                      application.status === 'registered'
                        ? 'bg-yellow-50 text-yellow-600'
                        : application.status === 'approved'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {application.status === 'registered' && '待审批'}
                    {application.status === 'approved' && '已通过'}
                    {application.status === 'rejected' && '已拒绝'}
                  </Badge>
                </div>
              </div>

              {/* 操作按钮 */}
              {application.status === 'registered' && (
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[rgba(0,0,0,0.05)]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(application.id, application.type)}
                    className="border-red-400 text-red-600 hover:bg-red-50 text-[12px]"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    拒绝
                  </Button>
                  <Button
                    className="bg-blue-400 hover:bg-blue-500 text-white text-[12px]"
                    onClick={() => handleApprove(application.id, application.type)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    通过
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
