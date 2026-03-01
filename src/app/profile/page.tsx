'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
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
    <div className="min-h-screen bg-white pb-40">
      <div className="px-5 pt-6 space-y-8">
        {/* 用户信息卡片 */}
        <div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://api.dicebear.com/7.x/micah/svg?seed=user123" />
                <AvatarFallback>张</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center border-2 border-white">
                <Flame className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">张明</h2>
                <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  高燃会员
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                制造业转型专家 | AI赋能者
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>128 连接</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span>15 次高燃</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 高燃宣导卡片 */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-blue-400">我的高燃宣导</h3>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-red-50">
            <div className="p-3 bg-white/50 mb-3">
              <p className="text-sm font-medium text-gray-900 mb-2">{declaration.theme}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{declaration.content}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/60 text-gray-700"
              >
                <Play className="w-4 h-4 mr-2" />
                播放录音
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/60 text-gray-700"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    编辑宣导
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-gray-900">编辑高燃宣导</DialogTitle>
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
                      <p className="text-xs text-gray-400 mt-1">
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
                      <div className="mt-2 p-4 border-2 border-dashed border-gray-200">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                            <Play className="w-6 h-6 text-blue-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">点击录音</p>
                          <p className="text-xs text-gray-400">支持 MP3、WAV 格式，最大 5MB</p>
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
                      <Button className="flex-1 bg-blue-400 text-white hover:bg-blue-500">
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
          <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1">
            <TabsTrigger
              value="graph"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600"
            >
              <TrendingUp className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="report"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600"
            >
              <Brain className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600"
            >
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600"
            >
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* 我的图谱 */}
          <TabsContent value="graph" className="space-y-4 mt-6">
            <div className="p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-gray-900">能力图谱</h3>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                  <Edit3 className="w-4 h-4 mr-1" />
                  编辑
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['AI应用', '数字化转型', '供应链管理', '战略规划', '团队管理', '市场营销'].map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-3 bg-gray-50"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400" />
                    <span className="text-sm font-medium text-gray-900">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-gray-900">学习轨迹</h3>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
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
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <span className="text-gray-400">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100">
                      <div
                        className="h-full bg-blue-400"
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
            <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">最新心理测评</h3>
                  <p className="text-xs text-gray-400">更新于 2024-01-15</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/60">
                  <span className="text-sm font-medium text-gray-900">领导力指数</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-100">
                      <div className="h-full bg-purple-500" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm font-bold text-purple-600">85</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60">
                  <span className="text-sm font-medium text-gray-900">创新能力</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-100">
                      <div className="h-full bg-purple-500" style={{ width: '78%' }} />
                    </div>
                    <span className="text-sm font-bold text-purple-600">78</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60">
                  <span className="text-sm font-medium text-gray-900">抗压能力</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-100">
                      <div className="h-full bg-purple-500" style={{ width: '92%' }} />
                    </div>
                    <span className="text-sm font-bold text-purple-600">92</span>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              开始新的测评
            </Button>
          </TabsContent>

          {/* 我的连接 */}
          <TabsContent value="connections" className="space-y-4 mt-6">
            <div className="p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-gray-900">最近连接</h3>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
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
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{connection.name}</div>
                      <div className="flex items-center space-x-2">
                        {connection.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{connection.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 设置 */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-medium text-gray-900">消息通知</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <div className="border-t border-gray-200" />
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="font-medium text-gray-900">隐私设置</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <div className="border-t border-gray-200" />
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="font-medium text-gray-900">帮助与反馈</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <button className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">退出登录</span>
            </button>
          </TabsContent>
        </Tabs>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
