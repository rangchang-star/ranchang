'use client';

import { PageContainer } from '@/components/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageSquare, Play, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

// AI培训内容
const aiTraining = [
  {
    id: '1',
    title: 'AI实战赋能营（第一期）',
    subtitle: '用AI，给自己的经验插上翅膀',
    description: '从工具选型到场景落地，全面掌握AI实战技能',
    target: '职场人/创业者',
    modules: 5,
    duration: '2天',
    enrolled: 128,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop',
    tags: ['AI实战', '工作坊'],
  },
  {
    id: '2',
    title: 'AI+商业创新工作坊',
    subtitle: '让AI成为你的创新加速器',
    description: 'AI驱动的商业模式设计与创新',
    target: '创业者/企业高管',
    modules: 4,
    duration: '1天',
    enrolled: 86,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
    tags: ['商业创新', 'AI'],
  },
  {
    id: '3',
    title: '提示词工程实战课程',
    subtitle: '掌握AI对话的核心技巧',
    description: '从入门到精通，系统学习提示词设计',
    target: '所有人',
    modules: 8,
    duration: '4周',
    enrolled: 256,
    image: 'https://images.unsplash.com/photo-1676299081847-c3c6b35c7f88?w=400&h=200&fit=crop',
    tags: ['提示词', '实战'],
  },
];

// 咨询内容
const consultationContent = [
  {
    id: '1',
    title: '创业心理能量评估',
    description: '通过科学量表评估您的创业心理能量',
    type: 'assessment',
    duration: '10分钟',
    price: '免费',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: '职业转型深度咨询',
    description: '一对一专家咨询，规划职业转型路径',
    type: 'consultation',
    duration: '60分钟',
    price: '¥299',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    title: '商业难题求解',
    description: '针对具体商业问题的深度分析与建议',
    type: 'problem-solving',
    duration: '90分钟',
    price: '¥499',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop',
  },
];

export default function SubscriptionPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            订阅
          </h2>
          <p className="text-muted-foreground">
            AI培训课程 · 专业咨询服务
          </p>
        </div>

        {/* Tab 切换 */}
        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>AI培训</span>
            </TabsTrigger>
            <TabsTrigger value="consultation" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>咨询</span>
            </TabsTrigger>
          </TabsList>

          {/* AI培训 */}
          <TabsContent value="training" className="space-y-4 mt-6">
            {aiTraining.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 flex-shrink-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-32 sm:h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{course.target}</span>
                        <span>•</span>
                        <span>{course.modules}个模块</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{course.enrolled}人已学习</span>
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto mt-4">
                      立即学习
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* 咨询 */}
          <TabsContent value="consultation" className="space-y-4 mt-6">
            {consultationContent.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 sm:h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Badge variant={item.price === '免费' ? 'default' : 'outline'}>
                        {item.price}
                      </Badge>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto mt-4">
                      开始咨询
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
