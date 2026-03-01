'use client';

import { PageContainer } from '@/components/page-container';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, TrendingUp, Flame, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

// 分类按钮
const categories = [
  { id: 'all', name: '全部' },
  { id: 'private', name: '私董会' },
  { id: 'salon', name: '沙龙' },
  { id: 'training', name: '培训' },
  { id: 'consultation', name: '咨询' },
];

// AI数字资产推荐
const aiAssets = [
  {
    id: '1',
    title: 'Midjourney 商业摄影提示词组合',
    description: '10组高质量商业摄影风格提示词',
    type: 'prompt',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'AI 视频生成完整攻略',
    description: '从0到1掌握 AI 视频制作',
    type: 'guide',
    image: 'https://images.unsplash.com/photo-1676299081847-c3c6b35c7f88?w=400&h=300&fit=crop',
  },
];

// 能力连接
const members = [
  {
    id: '1',
    name: '王姐',
    age: 48,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Felix',
    tags: ['供应链专家', '数字化转型'],
    need: '希望找到传统制造业的数字化项目机会',
  },
  {
    id: '2',
    name: '李明',
    age: 52,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=John',
    tags: ['投融资', '战略规划'],
    need: '想寻找优质项目对接投资机构',
  },
];

// 活动推荐
const recommendedActivities = [
  {
    id: '1',
    title: '转型期私董会',
    date: '4月10日',
    enrolled: 8,
    max: 12,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
  },
];

// 活动精选
const featuredActivities = [
  {
    id: '2',
    title: 'AI实战赋能营（第一期）',
    description: '全天候AI工具实战培训',
    date: '4月20日',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop',
  },
];

// 高燃宣导
const declarations = [
  {
    id: '1',
    name: '张明',
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=zhangming',
    theme: '用AI重塑传统制造业',
    content: '20年制造经验，现在要让AI赋能每一条生产线',
    audioDuration: '1:00',
  },
  {
    id: '2',
    name: '陈华',
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=chenhua',
    theme: '从大厂到创业',
    content: '45岁出发，打造AI驱动的创新服务平台',
    audioDuration: '1:00',
  },
];

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 搜索框 */}
        <div className="sticky top-0 bg-background z-10 pb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜索活动、会员、内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-secondary/50 border-0"
            />
          </div>
        </div>

        {/* 分类按钮 + AI推荐 */}
        <div>
          <ScrollArea className="w-full pb-2">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-foreground text-background font-medium'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm whitespace-nowrap">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                <span className="font-medium text-purple-900">AI数字资产</span>
              </div>
            </div>
          </ScrollArea>

          {/* AI数字资产推荐 */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-foreground">AI数字资产推荐</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {aiAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl overflow-hidden bg-secondary/30"
                >
                  <img
                    src={asset.image}
                    alt={asset.title}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-sm leading-tight mb-1">
                      {asset.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {asset.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 能力连接 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">能力连接</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              更多
            </Button>
          </div>
          <ScrollArea className="w-full pb-2">
            <div className="flex space-x-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-72 bg-secondary/20 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">
                        {member.name} <span className="text-muted-foreground font-normal text-sm">{member.age}岁</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 bg-background text-muted-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-foreground">
                    {member.need}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 活动推荐 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">活动推荐</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              更多
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden bg-secondary/20">
            <img
              src={recommendedActivities[0].image}
              alt={recommendedActivities[0].title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-2">
                {recommendedActivities[0].title}
              </h4>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{recommendedActivities[0].date}</span>
                <span>
                  {recommendedActivities[0].enrolled}/{recommendedActivities[0].max}人
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 活动精选 */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-foreground">活动精选</h3>
          </div>
          <div className="rounded-2xl overflow-hidden bg-secondary/20">
            <img
              src={featuredActivities[0].image}
              alt={featuredActivities[0].title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-1">
                {featuredActivities[0].title}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {featuredActivities[0].description}
              </p>
              <div className="text-sm text-muted-foreground">
                {featuredActivities[0].date}
              </div>
            </div>
          </div>
        </div>

        {/* 高燃宣导 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-foreground">高燃宣导</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              更多
            </Button>
          </div>
          <div className="space-y-3">
            {declarations.map((declaration) => (
              <div
                key={declaration.id}
                className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={declaration.avatar} alt={declaration.name} />
                    <AvatarFallback>{declaration.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">{declaration.name}</span>
                      <span className="text-xs text-muted-foreground">{declaration.audioDuration}</span>
                    </div>
                    <h4 className="font-medium text-sm text-orange-900 mb-1">
                      {declaration.theme}
                    </h4>
                    <p className="text-xs text-orange-800/80 mb-2">
                      {declaration.content}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => setIsPlaying(declaration.id === isPlaying ? null : declaration.id)}
                    >
                      {isPlaying === declaration.id ? '暂停' : '播放'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部留白 */}
        <div className="h-8" />
      </div>
    </PageContainer>
  );
}
