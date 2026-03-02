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

// 沙龙内容
const salon = {
  id: '1',
  period: '2026期',
  introduction: '定期举行的深度沙龙，汇集行业精英，共同探讨AI时代的商业机会与挑战，通过小组协作产出高价值的数字资产。',
  duration: '一年',
  schedule: '每周五 19:00',
  limit: '限15人',
  digitalAssets: [
    {
      id: '1',
      title: 'AI营销策略白皮书',
      description: '基于小组讨论产出，涵盖5个行业的AI营销实战案例',
      type: '文档',
      size: '2.3MB',
      createTime: '2024年3月1日',
      likes: 45,
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=120&fit=crop',
    },
    {
      id: '2',
      title: '数字化转型项目清单',
      description: '15个中小企业数字化转型实用工具和模板',
      type: '表格',
      size: '1.8MB',
      createTime: '2024年3月8日',
      likes: 67,
      cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&h=120&fit=crop',
    },
    {
      id: '3',
      title: 'AI工具使用手册',
      description: 'ChatGPT、Midjourney等主流AI工具的使用技巧',
      type: '文档',
      size: '3.5MB',
      createTime: '2024年3月15日',
      likes: 89,
      cover: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&h=120&fit=crop',
    },
  ],
};

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
                  <span>AI加油圈</span>
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
            {/* 查看更多灰色色块 */}
            <div className="mt-4 flex justify-center">
              <button className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                查看更多
              </button>
            </div>

            {/* AI加油圈内容 */}
            <TabsContent value="consultation" className="space-y-4 mt-6">
              <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                {/* 顶部信息行 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-light text-gray-900">{salon.period}</h3>
                    <div className="flex items-center space-x-2 text-[11px] text-[rgba(0,0,0,0.4)]">
                      <span>{salon.duration}</span>
                      <span>·</span>
                      <span>{salon.schedule}</span>
                      <span>·</span>
                      <span>{salon.limit}</span>
                    </div>
                  </div>
                  {/* 圆形蓝色按钮 */}
                  <button className="w-12 h-12 rounded-full bg-blue-400 text-white text-xs font-normal flex items-center justify-center hover:bg-blue-500 transition-colors">
                    加入
                  </button>
                </div>

                {/* 介绍 */}
                <p className="text-[13px] text-[rgba(0,0,0,0.25)] leading-relaxed mb-4">
                  {salon.introduction}
                </p>

                {/* 圈子数字资产产出 */}
                <h4 className="text-xl font-bold text-blue-400 mb-3">圈子数字资产产出</h4>

                {/* 数字资产列表 */}
                <div className="space-y-3">
                  {salon.digitalAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-3 bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                    >
                      {/* 资产图片 */}
                      <div className="mb-2 overflow-hidden">
                        <img
                          src={asset.cover}
                          alt={asset.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>

                      {/* 资产信息 */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="text-xs font-semibold text-gray-900 mb-1">{asset.title}</h5>
                          <p className="text-[11px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-2">
                            {asset.description}
                          </p>
                        </div>
                        <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px] ml-2 flex-shrink-0">
                          {asset.type}
                        </Badge>
                      </div>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between text-[9px] text-[rgba(0,0,0,0.4)]">
                        <div className="flex items-center space-x-3">
                          <span>{asset.createTime}</span>
                          <span>{asset.size}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{asset.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 互动现场视频 */}
                <div className="mt-6">
                  <div className="relative overflow-hidden bg-[rgba(0,0,0,0.02)] rounded-none">
                    {/* 视频播放器 */}
                    <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                      <img
                        src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=340&fit=crop"
                        alt="互动现场"
                        className="w-full h-full object-cover opacity-80"
                      />
                      {/* 播放按钮 */}
                      <button className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-blue-400 bg-opacity-90 flex items-center justify-center hover:bg-blue-500 transition-colors">
                          <PlayCircle className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </button>
                      {/* 时长标签 */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-[10px] px-2 py-1 rounded-none">
                        0:10
                      </div>
                    </div>
                    {/* 标题 */}
                    <div className="p-3">
                      <h5 className="text-sm font-semibold text-gray-900 mb-1">互动现场精彩瞬间</h5>
                      <p className="text-[11px] text-[rgba(0,0,0,0.25)]">AI加油圈2026期小组讨论现场实录</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
