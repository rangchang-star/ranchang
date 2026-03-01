'use client';

import { PageContainer } from '@/components/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Radar, Heart, Target, Users, Calendar, MessageSquare, Settings, Edit, Flame, Mic, Play } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '张明',
    age: 42,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=zhangming',
    level: '活跃会员',
  });

  const [declaration, setDeclaration] = useState({
    theme: '',
    content: '',
    hasAudio: false,
    audioUrl: '',
  });

  const [isEditingDeclaration, setIsEditingDeclaration] = useState(false);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 用户信息卡片 */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {user.name}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {user.level}
            </Badge>
          </div>
          <Button variant="ghost" size="icon">
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* 高燃宣导卡片 */}
        <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-foreground">我的高燃宣导</h3>
              </div>
              {!declaration.theme && (
                <Badge variant="outline" className="text-xs">
                  未发布
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {declaration.theme ? (
              <>
                <div className="space-y-2">
                  <div className="font-medium text-orange-900">{declaration.theme}</div>
                  <p className="text-sm text-orange-800/80">{declaration.content}</p>
                </div>
                {declaration.hasAudio && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      播放录音
                    </Button>
                    <span className="text-xs text-muted-foreground">1:00</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingDeclaration(true)}
                  >
                    重新编辑
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  发布您的高燃宣导，让更多人听到您的声音
                </p>
                <Button
                  onClick={() => setIsEditingDeclaration(true)}
                  className="w-full"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  创建高燃宣导
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* 编辑高燃宣导表单 */}
        {isEditingDeclaration && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold">编辑高燃宣导</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">宣导主题（20字以内）</label>
                <Input
                  placeholder="一句话概括您的宣言"
                  value={declaration.theme}
                  onChange={(e) => setDeclaration({ ...declaration, theme: e.target.value })}
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {declaration.theme.length}/20
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">宣导内容</label>
                <Textarea
                  placeholder="详细描述您的宣言..."
                  value={declaration.content}
                  onChange={(e) => setDeclaration({ ...declaration, content: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">录音（1分钟以内）</label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Mic className="w-4 h-4 mr-2" />
                    开始录音
                  </Button>
                  {declaration.hasAudio && (
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      播放
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsEditingDeclaration(false)}>
                  保存
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingDeclaration(false)}
                >
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 内容 */}
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="chart" className="text-xs py-2">
              我的图谱
            </TabsTrigger>
            <TabsTrigger value="psychology" className="text-xs py-2">
              心理报告
            </TabsTrigger>
            <TabsTrigger value="needs" className="text-xs py-2">
              我的连接
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs py-2">
              设置
            </TabsTrigger>
          </TabsList>

          {/* 我的图谱 */}
          <TabsContent value="chart" className="space-y-6 mt-6">
            <div className="aspect-square max-w-sm mx-auto bg-secondary/20 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center px-4">
                能力雷达图<br/>
                （暂未填写量表，请先完成能力评估）
              </p>
            </div>
            <Button className="w-full">完善能力标签</Button>
          </TabsContent>

          {/* 心理报告 */}
          <TabsContent value="psychology" className="space-y-6 mt-6">
            <div className="aspect-square max-w-sm mx-auto bg-secondary/20 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center px-4">
                心理能量雷达图<br/>
                （暂未完成心理评估）
              </p>
            </div>
            <Button className="w-full">开始心理评估</Button>
          </TabsContent>

          {/* 我的连接 */}
          <TabsContent value="needs" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    我的活动
                  </span>
                  <Button variant="ghost" size="sm">
                    查看全部
                  </Button>
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">转型期私董会</p>
                      <p className="text-xs text-muted-foreground">2024-04-10</p>
                    </div>
                    <Badge variant="outline">已报名</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    我的咨询
                  </span>
                  <Button variant="ghost" size="sm">
                    查看全部
                  </Button>
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">职业转型困惑</p>
                      <p className="text-xs text-muted-foreground">2024-03-15</p>
                    </div>
                    <Badge>已回复</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 设置 */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                修改密码
              </Button>
              <Button variant="outline" className="w-full justify-start">
                修改联系方式
              </Button>
              <Button variant="outline" className="w-full justify-start">
                隐私设置
              </Button>
            </div>
            <Button variant="destructive" className="w-full">
              注销账户
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
