'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const mockConsultations = [
  {
    id: '1',
    title: '45岁转型困惑',
    type: '心理',
    userName: '张明',
    contact: '138****8888',
    submitDate: '2024-03-15',
    situation: '在大厂工作了20年，突然不知道自己还能做什么，每天都在焦虑中度过...',
    help: '希望找到职业方向，缓解焦虑',
    status: 'pending',
    wantCase: '需要考虑',
  },
  {
    id: '2',
    title: '传统制造业转型',
    type: '商业',
    userName: '李华',
    contact: '139****6666',
    submitDate: '2024-03-14',
    situation: '做了15年制造，现在想做数字化转型，但不知道从哪里开始...',
    help: '希望获得转型指导',
    status: 'replied',
    reply:
      '建议先做小范围试点，验证商业模式，再逐步扩大规模。可以参加4月10日的转型期私董会，与其他转型者交流经验。',
    replyDate: '2024-03-15',
  },
  {
    id: '3',
    title: '股权分家问题',
    type: '商业',
    userName: '王总',
    contact: '137****5555',
    submitDate: '2024-03-13',
    situation: '创业3年，合伙人对方向产生分歧，想要分家但不清楚股权如何处理...',
    help: '希望获得专业法律建议',
    status: 'pending',
    wantCase: '愿意',
  },
  {
    id: '4',
    title: '创业失败后如何重启',
    type: '心理',
    userName: '陈姐',
    contact: '136****4444',
    submitDate: '2024-03-12',
    situation: '第一次创业失败，投入的积蓄打了水漂，家人也不支持我继续...',
    help: '希望获得心理支持和创业指导',
    status: 'replied',
    reply:
      '接受失败是成长的一部分，建议先调整心态，寻找同行者支持。推荐联系李明（投融资专家）探讨新方向。',
    replyDate: '2024-03-14',
  },
];

export default function AdminConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredConsultations = mockConsultations.filter((consult) =>
    consult.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReply = (id: string) => {
    alert(`回复已提交给 ${id}`);
    setReplyText('');
    setSelectedId(null);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          待处理
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        已回复
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">咨询管理</h2>
            <p className="text-muted-foreground">处理用户咨询留言</p>
          </div>
          <Button variant="outline">导出数据</Button>
        </div>

        {/* 搜索栏 */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索咨询..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 咨询列表 */}
        <div className="space-y-4">
          {filteredConsultations.map((consult) => (
            <Card key={consult.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{consult.title}</h3>
                      {getStatusBadge(consult.status)}
                      <Badge variant="outline">{consult.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{consult.userName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{consult.submitDate}</span>
                      </div>
                      <span>{consult.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">情况说明：</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {consult.situation}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">希望获得：</h4>
                    <p className="text-sm text-muted-foreground">{consult.help}</p>
                  </div>

                  {consult.wantCase && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">是否愿意成为案主：</span>
                      <span className="ml-2">{consult.wantCase}</span>
                    </div>
                  )}

                  {consult.status === 'replied' && consult.reply && (
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2">回复内容：</h4>
                      <p className="text-sm leading-relaxed">{consult.reply}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        回复时间：{consult.replyDate}
                      </p>
                    </div>
                  )}

                  {consult.status === 'pending' && selectedId === consult.id && (
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2">填写回复：</h4>
                      <Textarea
                        placeholder="请输入回复内容..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        className="mb-3"
                      />
                      <div className="flex items-center space-x-2">
                        <Button onClick={() => handleReply(consult.id)}>
                          <Send className="w-4 h-4 mr-2" />
                          提交回复
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedId(null)}
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  )}

                  {consult.status === 'pending' && selectedId !== consult.id && (
                    <Button onClick={() => setSelectedId(consult.id)}>
                      <Send className="w-4 h-4 mr-2" />
                      回复
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
