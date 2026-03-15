'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  X, 
  Send, 
  UserCheck, 
  MapPin,
  Clock,
  User,
  Users,
  Search
} from 'lucide-react';

export default function MessagesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">消息管理</h2>
          <p className="text-muted-foreground">管理审核任务和发送平台消息</p>
        </div>

        <Tabs defaultValue="ai-circle" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai-circle">
              <UserCheck className="w-4 h-4 mr-2" />
              2026AI圈审核
            </TabsTrigger>
            <TabsTrigger value="visit">
              <MapPin className="w-4 h-4 mr-2" />
              申请探访审核
            </TabsTrigger>
            <TabsTrigger value="platform">
              <Send className="w-4 h-4 mr-2" />
              平台消息发送
            </TabsTrigger>
          </TabsList>

          {/* 2026AI圈审核 */}
          <TabsContent value="ai-circle" className="mt-6">
            <AICircleApprovalTab />
          </TabsContent>

          {/* 申请探访审核 */}
          <TabsContent value="visit" className="mt-6">
            <VisitApprovalTab />
          </TabsContent>

          {/* 平台消息发送 */}
          <TabsContent value="platform" className="mt-6">
            <PlatformMessageTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// 2026AI圈审核组件
function AICircleApprovalTab() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载待审核的2026AI圈申请
  const loadApprovals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/admin/api/approvals?status=pending&type=ai-circle');
      const data = await response.json();
      
      if (data.success) {
        setApprovals(data.data || []);
      }
    } catch (error) {
      console.error('加载AI圈审核列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理审核
  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/admin/api/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      const data = await response.json();
      if (data.success) {
        // 重新加载列表
        await loadApprovals();
        alert(action === 'approve' ? '审核通过！已发送消息给用户' : '已拒绝该申请');
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('审核操作失败:', error);
      alert('操作失败，请稍后重试');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>待审核的2026AI圈申请</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>待审核的2026AI圈申请</CardTitle>
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            暂无待审核的申请
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {approval.userName || approval.userNickname || '未知用户'}
                      </h3>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(approval.createdAt).toLocaleDateString('zh-CN')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      申请加入2026AI圈
                    </p>
                    {approval.description && (
                      <div className="bg-gray-50 rounded-md p-3 mb-3">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {approval.description}
                        </p>
                      </div>
                    )}
                    {approval.userName && (
                      <div className="text-sm text-muted-foreground">
                        <div>申请人: {approval.userName}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(approval.id, 'reject')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      拒绝
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproval(approval.id, 'approve')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      通过
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 申请探访审核组件
function VisitApprovalTab() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载待审核的探访申请
  const loadApprovals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/admin/api/approvals?status=pending&type=visit');
      const data = await response.json();
      
      if (data.success) {
        setApprovals(data.data || []);
      }
    } catch (error) {
      console.error('加载探访审核列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理审核
  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/admin/api/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      const data = await response.json();
      if (data.success) {
        // 重新加载列表
        await loadApprovals();
        alert(action === 'approve' ? '审核通过！已创建报名记录并发送消息给用户' : '已拒绝该申请');
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('审核操作失败:', error);
      alert('操作失败，请稍后重试');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>待审核的探访申请</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>待审核的探访申请</CardTitle>
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            暂无待审核的申请
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {approval.userName || approval.userNickname || '未知用户'}
                      </h3>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(approval.createdAt).toLocaleDateString('zh-CN')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      申请探访: {approval.title || '未填写'}
                    </p>
                    {approval.description && (
                      <div className="bg-gray-50 rounded-md p-3 mb-3">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {approval.description}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(approval.id, 'reject')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      拒绝
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproval(approval.id, 'approve')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      通过
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 平台消息发送组件
function PlatformMessageTab() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [sendHistory, setSendHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // 加载用户列表和发送记录
  useEffect(() => {
    loadUsers();
    loadSendHistory();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch('/api/members/selectable');
      const data = await response.json();
      
      if (data.success) {
        setAvailableUsers(data.data || []);
      }
    } catch (error) {
      console.error('加载用户列表失败:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadSendHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch('/admin/api/notifications/history');
      const data = await response.json();
      
      if (data.success) {
        setSendHistory(data.data || []);
      }
    } catch (error) {
      console.error('加载发送记录失败:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const filteredUsers = availableUsers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.nickname?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm)
    );
  });

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSend = async () => {
    if (!title.trim()) {
      alert('请输入消息标题');
      return;
    }
    
    if (!message.trim()) {
      alert('请输入消息内容');
      return;
    }

    const target = targetType === 'all' ? 'all' : selectedUsers;

    try {
      setIsSending(true);
      const response = await fetch('/admin/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          target,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`群发成功！已发送给 ${data.count} 位用户`);
        setTitle('');
        setMessage('');
        setSelectedUsers([]);
        loadSendHistory();
      } else {
        alert(data.error || '发送失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送失败，请稍后重试');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 发送消息 */}
      <Card>
        <CardHeader>
          <CardTitle>发送消息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">消息标题 <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="请输入消息标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">消息内容 <span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              placeholder="请输入消息内容..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="mt-1 resize-none"
            />
            <div className="text-sm text-muted-foreground mt-1">
              {message.length} 字
            </div>
          </div>

          <div>
            <Label>发送对象 <span className="text-red-500">*</span></Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="all"
                  name="targetType"
                  checked={targetType === 'all'}
                  onChange={() => setTargetType('all')}
                  className="w-4 h-4"
                />
                <Label htmlFor="all" className="cursor-pointer">
                  全部用户
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="specific"
                  name="targetType"
                  checked={targetType === 'specific'}
                  onChange={() => setTargetType('specific')}
                  className="w-4 h-4"
                />
                <Label htmlFor="specific" className="cursor-pointer">
                  指定用户
                </Label>
              </div>
            </div>
          </div>

          {targetType === 'specific' && (
            <Card className="border">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <Label>搜索用户</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="输入姓名、昵称或手机号"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="border rounded-md max-h-[200px] overflow-y-auto">
                    {isLoadingUsers ? (
                      <div className="py-8 text-center text-muted-foreground">
                        加载中...
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        没有找到匹配的用户
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => toggleUser(user.id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {user.nickname || user.name || '未命名'}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {user.phone || '无手机号'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    已选择 {selectedUsers.length} 位用户
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleSend}
            disabled={isSending || !title.trim() || !message.trim() || (targetType === 'specific' && selectedUsers.length === 0)}
            className="w-full"
          >
            {isSending ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                发送中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                发送消息
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 发送记录 */}
      <Card>
        <CardHeader>
          <CardTitle>发送记录</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="py-8 text-center text-muted-foreground">
              加载中...
            </div>
          ) : sendHistory.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              暂无发送记录
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {sendHistory.map((record) => (
                <div key={record.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate flex-1">
                      {record.title}
                    </h3>
                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(record.createdAt).toLocaleString('zh-CN')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {record.message}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      发送给 {record.count} 位用户
                    </div>
                    {record.actionUrl && (
                      <span className="text-xs text-muted-foreground">
                        有跳转链接
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
