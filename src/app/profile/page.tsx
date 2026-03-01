'use client';

import { PageContainer } from '@/components/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <div className="space-y-8">
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
            <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
              {user.level}
            </span>
          </div>
          <Button variant="ghost" size="icon">
            <Edit className="w-5 h-5" />
          </Button>
        </div>

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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">战略与商业</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                  3项
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">专业职能</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                  5项
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">软性领导力</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                  2项
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">技术数字化</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                  1项
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">行业经验</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                  2项
                </span>
              </div>
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground font-medium">评估类型</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                  暂未评估
                </span>
              </div>
            </div>

            <Button className="w-full">开始心理评估</Button>
          </TabsContent>

          {/* 我的连接 */}
          <TabsContent value="needs" className="space-y-8 mt-6">
            {/* 谁看过我 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  最近访客
                </h3>
                <Button variant="ghost" size="sm">
                  查看更多
                </Button>
              </div>

              <div className="space-y-4">
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
            </div>

            <div className="border-t border-border" />

            {/* 可能感兴趣的人 */}
            <div>
              <h3 className="font-semibold flex items-center mb-4">
                <Target className="w-5 h-5 mr-2" />
                可能感兴趣的人
              </h3>

              <div className="space-y-4">
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
                      <p className="text-xs text-primary mt-1">{person.reason}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* 我的活动 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  我的活动
                </h3>
                <Button variant="ghost" size="sm">
                  查看全部
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">转型期私董会</p>
                    <p className="text-xs text-muted-foreground">2024-04-10</p>
                  </div>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                    已报名
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* 我的咨询 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  我的咨询
                </h3>
                <Button variant="ghost" size="sm">
                  查看全部
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">职业转型困惑</p>
                    <p className="text-xs text-muted-foreground">2024-03-15</p>
                  </div>
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                    已回复
                  </span>
                </div>
              </div>
            </div>
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

            <div className="border-t border-border" />

            <Button variant="destructive" className="w-full">
              注销账户
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
