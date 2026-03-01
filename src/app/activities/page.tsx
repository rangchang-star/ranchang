'use client';

import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const filters = [
  { id: 'all', label: '全部活动' },
  { id: 'private', label: '线下私董会' },
  { id: 'salon', label: '跨界沙龙' },
  { id: 'ai', label: 'AI实战营' },
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
    description: '针对35+职场转型人群，通过私董会形式深度探讨职业转型路径。我们将围绕"如何利用过往经验"、"如何降低试错成本"等话题展开讨论。',
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
    description: '邀请不同领域的专家分享AI在各行业的应用实践，促进跨界交流与合作。适合对AI商业化感兴趣的朋友参与。',
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
    description: '全天候AI工具实战培训，从工具选型到场景落地，帮你快速掌握AI辅助工作的核心技能。',
  },
];

export default function ActivitiesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const filteredActivities =
    selectedFilter === 'all'
      ? mockActivities
      : mockActivities.filter((a) => a.type === selectedFilter);

  return (
    <PageContainer title="让不同的人，碰撞出可能的火花">
      <div className="space-y-8">
        {/* 筛选栏 */}
        <ScrollableTabs
          tabs={filters}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />

        {/* 活动列表 */}
        <div className="space-y-6">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {activity.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {activity.enrolled}/{activity.max}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {activity.description}
              </p>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  查看详情
                </Button>
                <Button className="flex-1">立即报名</Button>
                {activity.type === 'private' && (
                  <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="flex-1">
                        申请成为案主
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>申请成为案主</DialogTitle>
                      </DialogHeader>
                      <CaseApplyForm onClose={() => setIsApplyOpen(false)} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="border-t border-border" />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

function ScrollableTabs({
  tabs,
  selected,
  onSelect,
}: {
  tabs: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            selected === tab.id
              ? 'bg-primary text-primary-foreground font-medium'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function CaseApplyForm({ onClose }: { onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 提交表单
    alert('申请已提交，我们将在3个工作日内回复您');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">问题标题</Label>
        <Input
          id="title"
          placeholder="一句话概括您的问题"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="situation">情况说明</Label>
        <Textarea
          id="situation"
          placeholder="详细描述您的背景和困境"
          className="mt-1"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="help">希望获得什么帮助</Label>
        <Textarea
          id="help"
          placeholder="期待被如何支持"
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="contact">联系方式</Label>
        <Input
          id="contact"
          placeholder="手机/微信"
          className="mt-1"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          取消
        </Button>
        <Button type="submit" className="flex-1">
          提交申请
        </Button>
      </div>
    </form>
  );
}
