'use client';

import { PageContainer } from '@/components/page-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Radar, Heart, Target, Users, Calendar, MessageSquare, Settings, Edit, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const user = {
    name: '张明',
    age: 42,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=zhangming',
    level: '活跃会员',
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-serif text-foreground mb-1">
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
          </CardContent>
        </Card>

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
          <TabsContent value="chart" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Radar className="w-5 h-5 mr-2" />
                  能力标签图谱
                </h3>
              </CardHeader>
              <CardContent>
                <div className="aspect-square max-w-sm mx-auto bg-secondary/20 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center px-4">
                    能力雷达图<br/>
                    （暂未填写量表，请先完成能力评估）
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">战略与商业</span>
                    <Badge variant="outline">3项</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">专业职能</span>
                    <Badge variant="outline">5项</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">软性领导力</span>
                    <Badge variant="outline">2项</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">技术数字化</span>
                    <Badge variant="outline">1项</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">行业经验</span>
                    <Badge variant="outline">2项</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4">完善能力标签</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 心理报告 */}
          <TabsContent value="psychology" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  创业心理能量报告
                </h3>
              </CardHeader>
              <CardContent>
                <div className="aspect-square max-w-sm mx-auto bg-secondary/20 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center px-4">
                    心理能量雷达图<br/>
                    （暂未完成心理评估）
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">评估类型</h4>
                  <Badge variant="secondary">暂未评估</Badge>
                </div>
                <Button className="w-full mt-4">开始心理评估</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 我的连接 */}
          <TabsContent value="needs" className="space-y-4 mt-4">
            {/* 谁看过我 */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    最近访客
                  </span>
                  <Button variant="ghost" size="sm">
                    查看更多
                  </Button>
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: '王姐', tag: '供应链专家' },
                    { name: '李明', tag: '投融资' },
                  ].map((visitor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{visitor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{visitor.name}</p>
                        <p className="text-xs text-muted-foreground">{visitor.tag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 可能感兴趣的人 */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  可能感兴趣的人
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: '张总', tag: '智能制造', reason: '与您的行业相关' },
                    { name: '陈老师', tag: '组织发展', reason: '可以互补资源' },
                    { name: '刘总', tag: 'AI应用', reason: '热门领域专家' },
                  ].map((person, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.tag}</p>
                        <p className="text-xs text-primary">{person.reason}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 我的活动 */}
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">转型期私董会</p>
                      <p className="text-xs text-muted-foreground">2024-04-10</p>
                    </div>
                    <Badge variant="outline">已报名</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 我的咨询 */}
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
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
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  账户设置
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  修改密码
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  修改联系方式
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  隐私设置
                </Button>
                <Separator />
                <Button variant="destructive" className="w-full">
                  注销账户
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
