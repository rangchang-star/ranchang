'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Check, 
  X, 
  Send, 
  UserCheck, 
  MapPin,
  Clock,
  User
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
                    {approval.reason && (
                      <div className="bg-gray-50 rounded-md p-3 mb-3">
                        <p className="text-sm text-muted-foreground">
                          申请理由: {approval.reason}
                        </p>
                      </div>
                    )}
                    {approval.userInfo && (
                      <div className="text-sm text-muted-foreground">
                        <div>行业: {approval.userInfo.industry || '未填写'}</div>
                        <div>公司: {approval.userInfo.company || '未填写'}</div>
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载可选择的用户列表
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/admin/api/members/selectable');
      const data = await response.json();
      
      if (data.success) {
        setAvailableUsers(data.data || []);
      }
    } catch (error) {
      console.error('加载用户列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换用户选择
  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  // 过滤后的用户列表
  const filteredUsers = availableUsers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.nickname?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm)
    );
  });

  // 发送消息
  const handleSend = async () => {
    if (selectedUsers.length === 0) {
      alert('请至少选择一个用户');
      return;
    }
    
    if (!message.trim()) {
      alert('请输入消息内容');
      return;
    }

    try {
      setIsSending(true);
      const response = await fetch('/admin/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers,
          content: message,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`成功发送消息给 ${selectedUsers.length} 位用户`);
        setMessage('');
        setSelectedUsers([]);
      } else {
        alert(data.message || '发送失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送失败，请稍后重试');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>发送平台消息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 用户选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>选择接收用户</span>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleSelectAll}
            >
              {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                ? '取消全选'
                : '全选'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 搜索框 */}
            <div>
              <Label>搜索用户</Label>
              <input
                type="text"
                placeholder="输入姓名、昵称、邮箱或手机号"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 用户列表 */}
            <div className="border rounded-md max-h-[400px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  没有找到匹配的用户
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleUser(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {user.nickname || user.name || '未命名'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email || user.phone || '无联系方式'}
                        </div>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 已选择数量 */}
            <div className="text-sm text-muted-foreground">
              已选择 {selectedUsers.length} 位用户
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 消息编辑 */}
      <Card>
        <CardHeader>
          <CardTitle>编写消息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">消息内容</Label>
              <Textarea
                id="message"
                placeholder="请输入要发送的消息内容..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="mt-1 resize-none"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {message.length} / 500 字
              </div>
            </div>

            <Button
              onClick={handleSend}
              disabled={isSending || selectedUsers.length === 0 || !message.trim()}
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
                  发送消息 ({selectedUsers.length} 人)
                </>
              )}
            </Button>

            {selectedUsers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    即将发送给 {selectedUsers.length} 位用户
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
