'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const filters = [
  { id: 'all', label: '全部活动' },
  { id: 'ongoing', label: '进行中' },
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
    enrolled: 8,
    max: 12,
    tags: ['私董会', '名额紧张'],
    status: 'ongoing',
    applicationStatus: 'approved', // approved | pending | none
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    type: 'salon',
    title: '跨界沙龙：AI时代的商业创新',
    date: '2024-04-15',
    time: '19:00-21:00',
    location: '北京·朝阳',
    enrolled: 20,
    max: 30,
    tags: ['跨界', 'AI'],
    status: 'ongoing',
    applicationStatus: 'pending', // 待审核
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    type: 'ai',
    title: 'AI实战赋能营（第一期）',
    date: '2024-04-20',
    time: '09:00-17:00',
    location: '深圳·南山',
    enrolled: 25,
    max: 30,
    tags: ['AI实战', '工作坊'],
    status: 'ended',
    applicationStatus: 'approved',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
  },
  {
    id: '4',
    type: 'private',
    title: '35+职场转型工作坊',
    date: '2024-04-25',
    time: '13:00-17:00',
    location: '广州·天河',
    enrolled: 5,
    max: 15,
    tags: ['工作坊', '即将开始'],
    status: 'ongoing',
    applicationStatus: 'none', // 未报名
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
  },
];

export default function ActivitiesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const filteredActivities = (() => {
    switch (selectedFilter) {
      case 'ongoing':
        return mockActivities.filter((a) => a.status === 'ongoing');
      case 'ended':
        return mockActivities.filter((a) => a.status === 'ended');
      case 'pending':
        return mockActivities.filter((a) => a.applicationStatus === 'pending');
      default:
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
                    <Button
                      variant="outline"
                      className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                    >
                      查看详情
                    </Button>
                  ) : activity.applicationStatus === 'none' ? (
                    // 未报名：显示"查看详情"和"立即报名"
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
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
                    // 待审核：显示"待审核"状态
                    <div className="flex-1 flex items-center justify-center bg-[rgba(251,191,36,0.15)] text-yellow-600 text-[13px] h-10">
                      待审核
                    </div>
                  ) : (
                    // 已通过：显示"查看详情"和"已报名"
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
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
                {selectedFilter === 'pending' ? '暂无待审核的活动' : '暂无相关活动'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseApplyForm({ onClose }: { onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('申请已提交，我们将在3个工作日内回复您');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-[13px] text-[rgba(0,0,0,0.8)]">问题标题</Label>
        <Input
          id="title"
          placeholder="一句话概括您的问题"
          className="mt-1 text-[13px] placeholder:text-[rgba(0,0,0,0.3)]"
        />
      </div>
      <div>
        <Label htmlFor="situation" className="text-[13px] text-[rgba(0,0,0,0.8)]">情况说明</Label>
        <Textarea
          id="situation"
          placeholder="详细描述您的背景和困境"
          className="mt-1 text-[13px] placeholder:text-[rgba(0,0,0,0.3)]"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="help" className="text-[13px] text-[rgba(0,0,0,0.8)]">希望获得什么帮助</Label>
        <Textarea
          id="help"
          placeholder="期待被如何支持"
          className="mt-1 text-[13px] placeholder:text-[rgba(0,0,0,0.3)]"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="contact" className="text-[13px] text-[rgba(0,0,0,0.8)]">联系方式</Label>
        <Input
          id="contact"
          placeholder="手机/微信"
          className="mt-1 text-[13px] placeholder:text-[rgba(0,0,0,0.3)]"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
          onClick={onClose}
        >
          取消
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-400 hover:bg-blue-500 h-10 text-[13px] font-normal"
        >
          提交申请
        </Button>
      </div>
    </form>
  );
}
