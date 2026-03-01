'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Flame,
  Play,
  Edit3,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  TrendingUp,
  Brain,
  Users,
  Award,
  Upload,
  Mic,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('graph');
  const [declaration, setDeclaration] = useState({
    theme: '用AI重塑传统制造业',
    content: '20年制造经验，现在要让AI赋能每一条生产线',
    audioUrl: null,
  });

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-br from-white to-secondary/30 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                <AvatarImage src="https://api.dicebear.com/7.x/micah/svg?seed=user123" />
                <AvatarFallback>张</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                <Flame className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-gradient">张明</h2>
                <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  高燃会员
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                制造业转型专家 | AI赋能者
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>128 连接</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>56 成就</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>15 次高燃</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 高燃宣导卡片 */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 p-6 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">我的高燃宣导</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
              <p className="text-sm font-medium text-white/90 mb-2">{declaration.theme}</p>
              <p className="text-sm text-white/80 leading-relaxed">{declaration.content}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all duration-300"
              >
                <Play className="w-4 h-4 mr-2" />
                播放录音
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all duration-300"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    编辑宣导
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gradient">编辑高燃宣导</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 pt-2">
                    <div>
                      <Label htmlFor="theme" className="text-sm font-medium">
                        主题（20字以内）
                      </Label>
                      <Input
                        id="theme"
                        placeholder="用一句话描述你的核心目标"
                        maxLength={20}
                        defaultValue={declaration.theme}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        当前字数：{declaration.theme.length}/20
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="content" className="text-sm font-medium">
                        宣导内容
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="详细描述你的理念和行动"
                        defaultValue={declaration.content}
                        className="mt-2 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">录音（1分钟以内）</Label>
                      <div className="mt-2 p-4 border-2 border-dashed border-border rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mic className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-foreground">点击录音</p>
                          <p className="text-xs text-muted-foreground">支持 MP3、WAV 格式，最大 5MB</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {}}
                      >
                        取消
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                        保存
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* 选项卡 */}
        <Tabs defaultValue="graph" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-soft p-1.5 rounded-2xl">
            <TabsTrigger
              value="graph"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <TrendingUp className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="report"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <Brain className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* 我的图谱 */}
          <TabsContent value="graph" className="space-y-4 mt-6">
            <div className="bg-white rounded-2xl p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">能力图谱</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="w-4 h-4 mr-1" />
                  编辑
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['AI应用', '数字化转型', '供应链管理', '战略规划', '团队管理', '市场营销'].map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-3 bg-secondary/30 rounded-xl"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                    <span className="text-sm font-medium text-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">学习轨迹</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  查看全部
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'AI时代领导者思维升级', progress: 85, total: '2.5小时' },
                  { title: '私董会组织实战指南', progress: 60, total: '3小时' },
                  { title: 'AI工具应用速成班', progress: 100, total: '1.5小时' },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="text-muted-foreground">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 心理报告 */}
          <TabsContent value="report" className="space-y-4 mt-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-5 shadow-soft border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">最新心理测评</h3>
                  <p className="text-xs text-muted-foreground">更新于 2024-01-15</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                  <span className="text-sm font-medium text-foreground">领导力指数</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-secondary/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm font-bold text-purple-600">85</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                  <span className="text-sm font-medium text-foreground">创新能力</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-secondary/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                    <span className="text-sm font-bold text-purple-600">78</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                  <span className="text-sm font-medium text-foreground">抗压能力</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-secondary/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                    <span className="text-sm font-bold text-purple-600">92</span>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30">
              开始新的测评
            </Button>
          </TabsContent>

          {/* 我的连接 */}
          <TabsContent value="connections" className="space-y-4 mt-6">
            <div className="bg-white rounded-2xl p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">最近连接</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  查看全部
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { name: '王姐', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Felix', tags: ['供应链专家'], time: '2天前' },
                  { name: '李明', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=John', tags: ['投融资'], time: '5天前' },
                  { name: '赵芳', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Jane', tags: ['人力资源'], time: '1周前' },
                ].map((connection, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{connection.name}</div>
                      <div className="flex items-center space-x-2">
                        {connection.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{connection.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 设置 */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-medium text-foreground">消息通知</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="border-t border-border/60" />
              <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="font-medium text-foreground">隐私设置</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="border-t border-border/60" />
              <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="font-medium text-foreground">帮助与反馈</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <button className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">退出登录</span>
            </button>
          </TabsContent>
        </Tabs>

        {/* 底部留白 */}
        <div className="h-8" />
      </div>
    </PageContainer>
  );
}
