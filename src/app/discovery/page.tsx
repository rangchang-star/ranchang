'use client';

import { useState } from 'react';
import { Search, Sparkles, TrendingUp, Flame, Play, MessageCircle, Award, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNav } from '@/components/bottom-nav';

// 分类标签
const categories = [
  { id: 'all', name: '全部', hot: false },
  { id: 'private', name: '私董会', hot: false },
  { id: 'salon', name: '沙龙', hot: false },
  { id: 'training', name: '培训', hot: false },
  { id: 'consultation', name: '咨询', hot: false },
];

// 特色话题
const hotTopics = [
  { id: 'iran', name: 'AI实战案例', hot: true },
  { id: 'cyber', name: '数字化转型', hot: false },
];

// 为你推荐
const recommendedItems = [
  {
    id: '1',
    title: '从0到1掌握AI商业应用',
    podcast: 'AI实战赋能营',
    comments: 128,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop',
    color: '#FFA502',
  },
  {
    id: '2',
    title: '传统企业如何利用AI降本增效',
    podcast: '私董会精选',
    comments: 89,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
    color: '#4ECDC4',
  },
  {
    id: '3',
    title: '35+职场转型的机遇与挑战',
    podcast: '燃场对话',
    comments: 256,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&h=200&fit=crop',
    color: '#FF6B81',
  },
];

// 编辑精选
const editorialItems = [
  {
    id: '1',
    title: '制造业数字化转型的实践路径',
    podcast: '知行小酒馆',
    comments: 342,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    color: '#8B4513',
    review: '这个案例太有启发了，我们公司正在做类似的事情！',
  },
  {
    id: '2',
    title: 'AI时代下的人才培养策略',
    podcast: '赛博对话',
    comments: 189,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&h=200&fit=crop',
    color: '#FFC048',
    review: 'HR必听！对我们团队建设帮助很大。',
  },
];

// 最热榜
const hotItems = [
  {
    id: '1',
    rank: 1,
    title: 'CEO如何组建AI转型团队',
    podcast: '燃场对话',
    plays: '12.5万',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    rank: 2,
    title: '私董会：CEO的成长必修课',
    podcast: '私董会精选',
    plays: '9.8万',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    rank: 3,
    title: '35+创业者的生存法则',
    podcast: '燃场对话',
    plays: '8.2万',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    rank: 4,
    title: 'AI工具在企业中的落地实践',
    podcast: 'AI实战赋能营',
    plays: '7.1万',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
  },
];

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white pb-40">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="text-2xl font-bold text-gray-900">发现</h1>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* 搜索框 */}
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索AI资产、活动、会员..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-gray-100 transition-colors"
            />
          </div>
        </div>

        {/* 标签栏 */}
        <div className="px-5 pb-4 overflow-x-auto">
          <div className="flex space-x-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
            {hotTopics.map((topic) => (
              <button
                key={topic.id}
                className="flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-red-50 text-red-600"
              >
                {topic.hot && <Flame className="w-4 h-4 mr-1.5 fill-red-500" />}
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-5 pt-4 space-y-6">
        {/* 为你推荐 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-blue-500">为你推荐</h2>
            <button className="text-sm text-gray-400">更多</button>
          </div>
          <div className="space-y-4">
            {recommendedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* 左侧图片 */}
                <div
                  className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center mr-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>

                {/* 中间文字 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      {item.podcast}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{item.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>热门</span>
                    </div>
                  </div>
                </div>

                {/* 右侧播放按钮 */}
                <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 ml-3 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 编辑精选 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-blue-500">编辑精选</h2>
            <button className="text-sm text-gray-400">更多</button>
          </div>
          <div className="space-y-4">
            {editorialItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* 主内容 */}
                <div className="flex items-center">
                  {/* 左侧图片 */}
                  <div
                    className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>

                  {/* 中间文字 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        {item.podcast}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{item.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>精选</span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧播放按钮 */}
                  <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 ml-3 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </button>
                </div>

                {/* 用户评论 */}
                <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${item.id}`} />
                      <AvatarFallback>用</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-gray-600 leading-relaxed flex-1">
                      {item.review}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 最热榜 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-blue-500">最热榜</h2>
            <button className="text-sm text-gray-400">更多</button>
          </div>
          <div className="space-y-3">
            {hotItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* 排名 */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 font-bold text-lg ${
                    item.rank <= 3 ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.rank}
                </div>

                {/* 左侧图片 */}
                <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center mr-4 bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                </div>

                {/* 中间文字 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                      {item.podcast}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{item.plays}播放</span>
                    </div>
                  </div>
                </div>

                {/* 右侧播放按钮 */}
                <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 ml-3 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 底部留白 */}
      <div className="h-4" />
      <BottomNav />
    </div>
  );
}
