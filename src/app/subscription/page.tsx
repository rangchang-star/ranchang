'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, PlayCircle, TrendingUp, Heart } from 'lucide-react';

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
    <div className="min-h-screen bg-white pb-14">
      {/* 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        <div className="px-5 pt-6 space-y-8 pb-4">
          {/* 顶部欢迎区 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-light text-gray-900">订阅内容</h2>
            </div>
            <p className="text-[13px] text-[rgba(0,0,0,0.25)] leading-relaxed">
              探索AI赋能的培训课程与专业咨询服务，开启转型之旅
            </p>
          </div>

          {/* 选项卡 */}
          <Tabs defaultValue="training" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="rounded-none grid w-full grid-cols-2 bg-[rgba(0,0,0,0.05)] p-1">
              <TabsTrigger
                value="training"
                className="rounded-none data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600 font-normal"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>AI培训</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="consultation"
                className="rounded-none data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600 font-normal"
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>咨询</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* AI培训内容 */}
            <TabsContent value="training" className="space-y-4 mt-6">
              {trainings.map((training) => (
                <div
                  key={training.id}
                  className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  {/* 图片 */}
                  <div className="mb-3 overflow-hidden">
                    <img
                      src={training.image}
                      alt={training.title}
                      className="w-full h-44 object-cover"
                    />
                  </div>

                  {/* 内容 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[11px]">
                        {training.level}
                      </Badge>
                      <div className="flex items-center space-x-1 text-[11px] text-[rgba(0,0,0,0.25)]">
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>{training.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] text-[rgba(0,0,0,0.25)]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{training.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">
                      {training.title}
                    </h3>
                    <p className="text-[13px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-2">
                      {training.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {training.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[11px] line-clamp-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* 底部信息 */}
                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(0,0,0,0.05)]">
                      <div className="flex items-center space-x-3">
                        <div>
                          <span className="text-sm font-semibold text-gray-900">¥{training.price}</span>
                          <span className="text-[11px] text-[rgba(0,0,0,0.25)] line-through ml-2">
                            ¥{training.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-[9px] text-[rgba(0,0,0,0.25)]">
                          <span>{training.students}</span>
                        </div>
                      </div>
                      {/* 纯方形按钮 */}
                      <Button
                        size="sm"
                        className="rounded-none bg-blue-400 text-white hover:bg-blue-500 font-normal text-[11px]"
                      >
                        立即订阅
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* 咨询内容 */}
            <TabsContent value="consultation" className="space-y-4 mt-6">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  {/* 图片 */}
                  <div className="mb-3 overflow-hidden">
                    <img
                      src={consultation.image}
                      alt={consultation.title}
                      className="w-full h-44 object-cover"
                    />
                  </div>

                  {/* 内容 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[11px]">
                        {consultation.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-[11px] text-[rgba(0,0,0,0.25)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{consultation.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] text-[rgba(0,0,0,0.25)]">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{consultation.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">
                      {consultation.title}
                    </h3>
                    <p className="text-[13px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-2">
                      {consultation.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {consultation.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[11px] line-clamp-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* 底部信息 */}
                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(0,0,0,0.05)]">
                      <div className="flex items-center space-x-3">
                        <div>
                          <span className="text-sm font-semibold text-gray-900">¥{consultation.price}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[9px] text-[rgba(0,0,0,0.25)]">
                          <span>{consultation.reviews}</span>
                        </div>
                      </div>
                      {/* 纯方形按钮 */}
                      <Button
                        size="sm"
                        className="rounded-none bg-blue-400 text-white hover:bg-blue-500 font-normal text-[11px]"
                      >
                        预约咨询
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
