'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, PlayCircle, TrendingUp, Heart, Mic, Users } from 'lucide-react';

// 商业咨询行业标签
const industryTypes = [
  '企业转型',
  '战略规划',
  '组织优化',
  '市场拓展',
  '产品创新',
  '资本运作',
];

// 探访点亮内容
const visits = [
  {
    id: '1',
    title: '上海某制造业企业数字化转型探访',
    industry: '企业转型',
    duration: '4小时',
    date: '2024年3月15日',
    visitors: [
      { name: '李明', avatar: '/avatar-2.jpg', skill: '战略' },
      { name: '王芳', avatar: '/avatar-3.jpg', skill: '营销' },
      { name: '张伟', avatar: '/avatar-4.jpg', skill: '产品' },
    ],
    record: '企业面临数字化转型的关键阶段，传统生产模式效率低下，需要从设备智能化、流程数字化、管理信息化三个维度进行全面改造。本次走访重点了解企业当前痛点，制定分阶段转型方案。',
    status: ['组织优化', '战略规划', '产品创新'],
    audioDuration: '5:23',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: '杭州科技创业公司战略规划探访',
    industry: '战略规划',
    duration: '3.5小时',
    date: '2024年3月12日',
    visitors: [
      { name: '赵芳', avatar: '/avatar-3.jpg', skill: '运营' },
      { name: '李明', avatar: '/avatar-2.jpg', skill: '战略' },
    ],
    record: '创业公司快速发展期面临战略选择，需要在A轮融资、市场扩张、产品迭代之间找到平衡点。通过深度访谈，明确未来6个月的优先级，建立关键指标体系。',
    status: ['市场拓展', '资本运作'],
    audioDuration: '4:15',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    title: '广州连锁企业组织优化探访',
    industry: '组织优化',
    duration: '5小时',
    date: '2024年3月10日',
    visitors: [
      { name: '张伟', avatar: '/avatar-4.jpg', skill: '管理' },
      { name: '王芳', avatar: '/avatar-3.jpg', skill: '渠道' },
      { name: '李明', avatar: '/avatar-2.jpg', skill: '战略' },
    ],
    record: '连锁门店快速扩张后，组织架构和管理体系跟不上发展节奏，跨区域协同困难。重点考察门店运营流程，设计标准化管理体系和人才培训机制。',
    status: ['组织优化', '市场拓展', '产品创新'],
    audioDuration: '6:30',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
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
        <div className="px-5 pt-[60px] pb-4 space-y-8">
          {/* 顶部标题区 */}
          <div>
            <div className="flex items-center justify-between py-4">
              <h1 className="text-2xl font-light text-gray-900">订阅内容</h1>
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
                  <span>探访点亮</span>
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

            {/* 探访点亮内容 */}
            <TabsContent value="training" className="space-y-4 mt-6">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  {/* 图片 */}
                  <div className="mb-3 overflow-hidden">
                    <img
                      src={visit.image}
                      alt={visit.title}
                      className="w-full h-44 object-cover"
                    />
                  </div>

                  {/* 行业标签、时长、日期 */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[11px]">
                      {visit.industry}
                    </Badge>
                    <div className="flex items-center space-x-1 text-[11px] text-[rgba(0,0,0,0.25)]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{visit.duration}</span>
                      <span>·</span>
                      <span>{visit.date}</span>
                    </div>
                  </div>

                  {/* 探访人头像和标签 */}
                  <div className="flex items-center space-x-4 mb-3">
                    {visit.visitors.slice(0, 3).map((visitor, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                          <img
                            src={visitor.avatar}
                            alt={visitor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[9px] line-clamp-1">
                          {visitor.skill}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* 标题 */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight line-clamp-1">
                    {visit.title}
                  </h3>

                  {/* 走访记录 */}
                  <p className="text-[13px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-3 mb-3">
                    {visit.record}
                  </p>

                  {/* 状态标签 */}
                  <div className="p-2.5 bg-[rgba(0,0,0,0.05)] mb-3">
                    <div className="flex flex-wrap gap-2">
                      {visit.status.map((status) => (
                        <Badge
                          key={status}
                          className="rounded-none bg-[rgba(0,0,0,0.08)] text-[rgba(0,0,0,0.6)] font-normal text-[10px] line-clamp-1"
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 走访录音 */}
                  <div className="flex items-center space-x-3 p-3 bg-[rgba(0,0,0,0.03)]">
                    <button className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="w-4 h-4 text-white fill-white ml-0.5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-900 font-medium">走访反馈录音</p>
                      <p className="text-[9px] text-[rgba(0,0,0,0.25)]">{visit.audioDuration}</p>
                    </div>
                    <Users className="w-4 h-4 text-[rgba(0,0,0,0.25)] flex-shrink-0" />
                  </div>
                </div>
              ))}
            </TabsContent>
            {/* 换一换灰色色块 */}
            <div className="mt-4 flex justify-center">
              <button className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                换一换
              </button>
            </div>

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
