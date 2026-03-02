'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const filters = [
  { id: 'all', label: '全部活动' },
  { id: 'upcoming', label: '待参加' },
  { id: 'ended', label: '已结束' },
  { id: 'pending', label: '待审核' },
];

const mockActivities = [
  {
    id: '1',
    type: 'private',
    title: '转型期私董会：如何找到第二曲线',
    date: '2024-04-10',
    time: '14:00-17:00',
    location: '上海·静安',
    address: '上海市静安区南京西路1788号',
    enrolled: 8,
    max: 12,
    tags: ['私董会', '名额紧张'],
    status: 'ongoing',
    applicationStatus: 'approved', // approved | pending | none
    description: '针对35+职场转型人群，通过私董会形式深度探讨职业转型路径。我们将围绕"如何利用过往经验"、"如何降低试错成本"等话题展开讨论。',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    type: 'salon',
    title: '跨界沙龙：AI时代的商业创新',
    date: '2024-04-15',
    time: '19:00-21:00',
    location: '北京·朝阳',
    address: '北京市朝阳区CBD国贸大厦',
    enrolled: 20,
    max: 30,
    tags: ['跨界', 'AI'],
    status: 'ongoing',
    applicationStatus: 'pending', // 待审核
    description: '邀请不同领域的专家分享AI在各行业的应用实践，促进跨界交流与合作。适合对AI商业化感兴趣的朋友参与。',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    type: 'ai',
    title: 'AI实战赋能营（第一期）',
    date: '2024-04-20',
    time: '09:00-17:00',
    location: '深圳·南山',
    address: '深圳市南山区科技园',
    enrolled: 25,
    max: 30,
    tags: ['AI实战', '工作坊'],
    status: 'ended',
    applicationStatus: 'approved',
    description: '全天候AI工具实战培训，从工具选型到场景落地，帮你快速掌握AI辅助工作的核心技能。',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
  },
  {
    id: '4',
    type: 'private',
    title: '35+职场转型工作坊',
    date: '2024-04-25',
    time: '13:00-17:00',
    location: '广州·天河',
    address: '广州市天河区珠江新城',
    enrolled: 5,
    max: 15,
    tags: ['工作坊', '即将开始'],
    status: 'ongoing',
    applicationStatus: 'none', // 未报名
    description: '为35+职场人提供转型指导，涵盖简历优化、面试技巧、行业分析等内容，帮助你顺利实现职业转型。',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
  },
];

export default function ActivitiesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<typeof mockActivities[0] | null>(null);

  const filteredActivities = (() => {
    switch (selectedFilter) {
      case 'upcoming':
        // 待参加：只显示报名并通过审核的项目（进行中 + 已通过）
        return mockActivities.filter((a) => a.status === 'ongoing' && a.applicationStatus === 'approved');
      case 'ended':
        // 已结束：只显示已结束的活动
        return mockActivities.filter((a) => a.status === 'ended');
      case 'pending':
        // 待审核：只显示待审核的报名
        return mockActivities.filter((a) => a.applicationStatus === 'pending');
      default:
        // 全部活动：显示所有活动
        return mockActivities;
    }
  })();

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">参与活动</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* Slogan */}
          <div className="py-2">
            <p className="text-[13px] font-bold text-blue-400 leading-relaxed">
              让不同的人，碰撞出可能的火花
            </p>
          </div>

          {/* 筛选标签 */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
            {filters.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 text-[13px] font-normal whitespace-nowrap transition-colors ${
                  selectedFilter === tab.id
                    ? 'bg-[rgba(59,130,246,0.4)] text-blue-600'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 活动列表 */}
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="py-5 space-y-4">
                {/* 活动图片 */}
                {activity.image && (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* 活动标题 */}
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                    {activity.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 活动信息 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activity.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activity.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activity.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                      {activity.enrolled}/{activity.max}人
                    </span>
                  </div>
                </div>

                {/* 活动状态 */}
                <div>
                  {activity.status === 'ended' ? (
                    <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.4)] text-[11px] font-normal">
                      已结束
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal">
                      进行中
                    </span>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-2">
                  {activity.status === 'ended' ? (
                    // 已结束：只显示"查看详情"按钮
                    <Button
                      variant="outline"
                      className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      查看详情
                    </Button>
                  ) : activity.applicationStatus === 'none' ? (
                    // 未报名：显示"查看详情"和"立即报名"
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        查看详情
                      </Button>
                      <Button
                        className="flex-1 bg-blue-400 hover:bg-blue-500 h-10 text-[13px] font-normal"
                      >
                        立即报名
                      </Button>
                    </>
                  ) : activity.applicationStatus === 'pending' ? (
                    // 待审核：显示"查看详情"和"待审核"状态
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        查看详情
                      </Button>
                      <div className="flex-1 flex items-center justify-center bg-[rgba(251,191,36,0.15)] text-yellow-600 text-[13px] h-10">
                        待审核
                      </div>
                    </>
                  ) : (
                    // 已通过：显示"查看详情"和"已报名"
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        查看详情
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white h-10 text-[13px] font-normal"
                      >
                        已报名
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
                {selectedFilter === 'pending' ? '暂无待审核的活动' : selectedFilter === 'upcoming' ? '暂无待参加的活动' : '暂无相关活动'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 活动详情悬浮窗口 */}
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className="w-[95%] max-w-[480px] max-h-[85vh] overflow-y-auto p-0">
          {selectedActivity && (
            <>
              {/* 活动图片 */}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={selectedActivity.image}
                  alt={selectedActivity.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 活动内容 */}
              <div className="p-5 space-y-4">
                {/* 标题和标签 */}
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900 mb-2">
                    {selectedActivity.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 活动描述 */}
                <div>
                  <p className="text-[13px] text-[rgba(0,0,0,0.6)] leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>

                {/* 活动信息 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{selectedActivity.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{selectedActivity.time}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{selectedActivity.location}</span>
                      {selectedActivity.address && (
                        <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">{selectedActivity.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                      {selectedActivity.enrolled}/{selectedActivity.max}人
                    </span>
                  </div>
                </div>

                {/* 活动状态 */}
                <div>
                  {selectedActivity.status === 'ended' ? (
                    <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.4)] text-[11px] font-normal">
                      已结束
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal">
                      进行中
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
