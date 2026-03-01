'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, PlayCircle, TrendingUp, Heart, ArrowRight, Sparkles } from 'lucide-react';

// AI培训内容
const trainings = [
  {
    id: '1',
    title: 'AI时代领导者思维升级',
    description: '帮助企业主和高管适应AI时代的领导力挑战',
    tags: ['战略思维', 'AI应用', '领导力'],
    duration: '2.5小时',
    price: 299,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop',
    rating: 4.9,
    students: 1280,
    level: '中级',
  },
  {
    id: '2',
    title: '私董会组织实战指南',
    description: '从0到1打造高效的私董会组织',
    tags: ['私董会', '组织管理', '方法论'],
    duration: '3小时',
    price: 199,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
    rating: 4.8,
    students: 856,
    level: '入门',
  },
  {
    id: '3',
    title: 'AI工具应用速成班',
    description: '掌握最实用的AI工具，提升工作效率',
    tags: ['AI工具', '效率提升', '实操'],
    duration: '1.5小时',
    price: 99,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
    rating: 4.7,
    students: 2156,
    level: '入门',
  },
];

// 咨询内容
const consultations = [
  {
    id: '1',
    title: '企业转型战略咨询',
    description: '针对传统企业的数字化转型策略制定',
    tags: ['企业转型', '数字化', '战略规划'],
    duration: '1小时',
    price: 599,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=200&fit=crop',
    rating: 5.0,
    reviews: 234,
    category: '战略咨询',
  },
  {
    id: '2',
    title: '创业项目评估',
    description: '专业的项目可行性分析与建议',
    tags: ['创业', '项目评估', '投资'],
    duration: '45分钟',
    price: 399,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=200&fit=crop',
    rating: 4.9,
    reviews: 189,
    category: '项目咨询',
  },
  {
    id: '3',
    title: '个人成长教练',
    description: '一对一职业发展规划与能力提升',
    tags: ['个人成长', '职业规划', '能力提升'],
    duration: '1小时',
    price: 299,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=200&fit=crop',
    rating: 4.8,
    reviews: 312,
    category: '成长教练',
  },
];

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState('training');

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 顶部欢迎区 */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gradient">订阅内容</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            探索AI赋能的培训课程与专业咨询服务，开启转型之旅
          </p>
        </div>

        {/* 选项卡 */}
        <Tabs defaultValue="training" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-soft p-1.5 rounded-2xl">
            <TabsTrigger
              value="training"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>AI培训</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="consultation"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>咨询</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* AI培训内容 */}
          <TabsContent value="training" className="space-y-5 mt-6">
            {trainings.map((training) => (
              <div
                key={training.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-5">
                  {/* 图片 */}
                  <div className="relative mb-4 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={training.image}
                      alt={training.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 backdrop-blur-sm text-foreground font-medium shadow-md">
                        {training.level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <PlayCircle className="w-4 h-4 text-white" />
                        <span className="text-xs text-white font-medium">{training.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-white font-semibold">{training.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* 内容 */}
                  <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">
                    {training.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {training.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {training.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-secondary/50 text-foreground font-normal text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/60">
                    <div className="flex items-center space-x-3">
                      <div>
                        <span className="text-2xl font-bold text-gradient">¥{training.price}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ¥{training.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <span>{training.students}</span>
                        <span>人已学</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-primary-light text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                    >
                      立即订阅
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* 查看更多 */}
            <div className="flex justify-center pt-2">
              <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-primary">
                查看更多培训
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* 咨询内容 */}
          <TabsContent value="consultation" className="space-y-5 mt-6">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-5">
                  {/* 图片 */}
                  <div className="relative mb-4 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={consultation.image}
                      alt={consultation.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 backdrop-blur-sm text-foreground font-medium shadow-md">
                        {consultation.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-xs text-white font-medium">{consultation.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                        <span className="text-xs text-white font-semibold">{consultation.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* 内容 */}
                  <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">
                    {consultation.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {consultation.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {consultation.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-secondary/50 text-foreground font-normal text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/60">
                    <div className="flex items-center space-x-3">
                      <div>
                        <span className="text-2xl font-bold text-gradient">¥{consultation.price}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <span>{consultation.reviews}</span>
                        <span>条评价</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-primary-light text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                    >
                      预约咨询
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* 查看更多 */}
            <div className="flex justify-center pt-2">
              <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-primary">
                查看更多咨询
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* 底部留白 */}
        <div className="h-8" />
      </div>
    </PageContainer>
  );
}
