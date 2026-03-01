'use client';

import { PageContainer } from '@/components/page-container';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, TrendingUp, Flame, ArrowRight, Play } from 'lucide-react';
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
    title: 'Midjourney 商业摄影',
    description: '10组高质量提示词',
    type: 'prompt',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'AI 视频生成攻略',
    description: '从0到1全面掌握',
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
    title: 'AI实战赋能营',
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
];

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 搜索框 - 现代化设计 */}
        <div className="sticky top-0 bg-[#F1F2F6] z-10 pb-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              placeholder="探索活动、会员、AI资产..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-[52px] rounded-2xl bg-white shadow-soft border-0 text-base placeholder:text-muted-foreground/60 focus:shadow-soft-lg transition-all duration-300 z-10 relative"
            />
          </div>
        </div>

        {/* 分类按钮 + AI推荐 */}
        <div>
          <ScrollArea className="w-full pb-3">
            <div className="flex space-x-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25'
                      : 'bg-white text-muted-foreground hover:text-foreground shadow-soft'
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <div className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-2xl text-sm font-medium whitespace-nowrap shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2 text-white" />
                <span className="text-white">AI数字资产</span>
              </div>
            </div>
          </ScrollArea>

          {/* AI数字资产推荐 */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-foreground">AI数字资产推荐</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                查看全部
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {aiAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={asset.image}
                    alt={asset.title}
                    className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="font-semibold text-white text-sm leading-tight mb-1">
                      {asset.title}
                    </h4>
                    <p className="text-xs text-white/80">{asset.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 能力连接 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/20">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-foreground">能力连接</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              更多 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <ScrollArea className="w-full pb-2">
            <div className="flex space-x-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-[280px] glass rounded-2xl p-5 space-y-4 hover:shadow-soft-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-white">
                        <Flame className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-lg">
                        {member.name} <span className="text-muted-foreground font-normal text-base">{member.age}岁</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm text-foreground text-xs font-medium rounded-full shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-lg shadow-accent/20">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-foreground">活动推荐</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              更多 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={recommendedActivities[0].image}
              alt={recommendedActivities[0].title}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h4 className="font-bold text-white text-xl mb-2">
                {recommendedActivities[0].title}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">{recommendedActivities[0].date}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-full h-2 w-24">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                      style={{ width: `${(recommendedActivities[0].enrolled / recommendedActivities[0].max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-white font-medium">
                    {recommendedActivities[0].enrolled}/{recommendedActivities[0].max}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 活动精选 */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-foreground">活动精选</h3>
          </div>
          <div className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={featuredActivities[0].image}
              alt={featuredActivities[0].title}
              className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h4 className="font-bold text-white text-lg mb-1">
                {featuredActivities[0].title}
              </h4>
              <p className="text-sm text-white/80 mb-2">{featuredActivities[0].description}</p>
              <span className="text-xs text-white/90">{featuredActivities[0].date}</span>
            </div>
          </div>
        </div>

        {/* 高燃宣导 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-foreground">高燃宣导</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              更多 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {declarations.map((declaration) => (
              <div
                key={declaration.id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14 ring-3 ring-white shadow-md">
                        <AvatarImage src={declaration.avatar} alt={declaration.name} />
                        <AvatarFallback>{declaration.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                        <Flame className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-base">{declaration.name}</span>
                        <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full">
                          <Play className="w-3 h-3 text-primary" />
                          <span className="text-xs font-medium text-primary">{declaration.audioDuration}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-base text-orange-900 mb-2 leading-tight">
                        {declaration.theme}
                      </h4>
                      <p className="text-sm text-orange-800/90 mb-3 leading-relaxed">
                        {declaration.content}
                      </p>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-primary-light text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        播放宣言
                      </Button>
                    </div>
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
