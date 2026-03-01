'use client';

import { useState } from 'react';
import { Search, Flame, Play, MessageCircle, TrendingUp, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  { id: 'ai', name: 'AI实战案例', hot: true },
  { id: 'digital', name: '数字化转型', hot: false },
];

// 能力连接
const connectionItems = [
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
  {
    id: '3',
    name: '赵芳',
    age: 45,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Jane',
    tags: ['人力资源', '团队管理'],
    need: '需要搭建企业的人才培养体系',
  },
];

// 活动推荐
const activityItems = [
  {
    id: '1',
    category: '私董会',
    title: 'CEO转型期私董会',
    subtitle: '战略定位与组织重构',
    description: '邀请10位CEO共同探讨传统企业在AI时代的转型路径，通过深度对话和案例分析，帮助企业在变革中找到新的增长点。',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=160&h=160&fit=crop',
    enrollments: [
      'https://api.dicebear.com/7.x/micah/svg?seed=p1',
      'https://api.dicebear.com/7.x/micah/svg?seed=p2',
      'https://api.dicebear.com/7.x/micah/svg?seed=p3',
    ],
    enrolledCount: 8,
    maxEnrollments: 12,
  },
  {
    id: '2',
    category: 'AI培训',
    title: 'AI实战赋能营',
    subtitle: '从工具应用到业务落地',
    description: '全天候AI工具实战培训，涵盖Midjourney、ChatGPT等主流工具的深度应用，帮助学员快速掌握AI赋能业务的方法。',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=160&h=160&fit=crop',
    enrollments: [
      'https://api.dicebear.com/7.x/micah/svg?seed=p4',
      'https://api.dicebear.com/7.x/micah/svg?seed=p5',
      'https://api.dicebear.com/7.x/micah/svg?seed=p6',
    ],
    enrolledCount: 15,
    maxEnrollments: 20,
  },
  {
    id: '3',
    category: '沙龙',
    title: '创业者分享沙龙',
    subtitle: '35+职场转型故事',
    description: '邀请3位成功转型的35+创业者分享他们的转型故事和经验，为正在考虑转型的职场人提供参考和启发。',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop',
    enrollments: [
      'https://api.dicebear.com/7.x/micah/svg?seed=p7',
      'https://api.dicebear.com/7.x/micah/svg?seed=p8',
      'https://api.dicebear.com/7.x/micah/svg?seed=p9',
    ],
    enrolledCount: 6,
    maxEnrollments: 15,
  },
];

// 高燃宣告
const declarationItems = [
  {
    id: '1',
    rank: 1,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=zhangming',
    title: '用AI重塑传统制造业',
    name: '张明',
    profile: '制造专家',
  },
  {
    id: '2',
    rank: 2,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=wangjie',
    title: '35+创业者的破局之路',
    name: '王杰',
    profile: '连续创业者',
  },
  {
    id: '3',
    rank: 3,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=lihua',
    title: '从HR到企业合伙人',
    name: '李华',
    profile: '战略顾问',
  },
  {
    id: '4',
    rank: 4,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=chenwei',
    title: 'AI时代的产品思维',
    name: '陈伟',
    profile: '产品总监',
  },
];

// 每日宣告
const dailyDeclaration = {
  image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop',
  date: '2024年3月1日',
  title: '每日宣告：重塑自我，迎接新挑战',
  duration: '3:15',
};

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white pb-40">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="text-2xl font-bold text-gray-900">发现</h1>
          {/* 程序员大叔抽象头像 - 方形 */}
          <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-gray-100 transition-colors"
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
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
            {hotTopics.map((topic) => (
              <button
                key={topic.id}
                className="flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap bg-red-50 text-red-600"
              >
                {topic.hot && <Flame className="w-4 h-4 mr-1.5 fill-red-500" />}
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区 - 增加栏目间距 */}
      <div className="px-5 pt-6 space-y-8">
        {/* 能力连接 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-blue-400">能力连接</h2>
            <button className="text-sm text-gray-400">更多</button>
          </div>
          {/* 灰色横线 */}
          <div className="h-[1px] bg-gray-200 mb-4" />
          <div className="space-y-4">
            {connectionItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start p-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* 方形头像 - 纯方形 */}
                <div className="w-14 h-14 flex-shrink-0 mr-4 overflow-hidden">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 中间文字 */}
                <div className="flex-1 min-w-0">
                  {/* 姓名与标签 */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-base font-semibold text-gray-900">{item.name}</span>
                    <span className="text-sm text-gray-400">{item.age}岁</span>
                  </div>
                  {/* 方形浅灰色标签块 - 纯方形 */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* 个人需求说明 */}
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {item.need}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 活动推荐 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-blue-400">活动推荐</h2>
            <button className="text-sm text-gray-400">更多</button>
          </div>
          {/* 灰色横线 */}
          <div className="h-[1px] bg-gray-200 mb-4" />
          <div className="space-y-4">
            {activityItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start">
                  {/* 左侧图片 - 纯方形 */}
                  <div className="w-[80px] h-[80px] flex-shrink-0 mr-4 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 右侧内容 */}
                  <div className="flex-1 min-w-0">
                    {/* 分类名称（灰色字） */}
                    <div className="text-xs text-gray-400 mb-1">{item.category}</div>
                    {/* 活动主题与副标题（黑色字） */}
                    <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-900 mb-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                    {/* 活动简介 - 纯方形灰色框 */}
                    <div className="p-2.5 bg-gray-50 mb-2">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    {/* 报名人头像与人数 */}
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {item.enrollments.slice(0, 3).map((avatar, idx) => (
                          <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>用</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {item.enrolledCount}人报名
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 高燃宣告 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-blue-400">高燃宣告</h2>
            <button className="text-sm text-gray-400">更多</button>
          </div>
          {/* 灰色横线 */}
          <div className="h-[1px] bg-gray-200 mb-4" />
          <div className="space-y-3">
            {declarationItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* 排序 - 纯方形 */}
                <div
                  className={`w-10 h-10 flex items-center justify-center flex-shrink-0 mr-4 font-bold text-lg ${
                    item.rank <= 3 ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.rank}
                </div>

                {/* 左侧头像 - 纯方形 */}
                <div className="w-14 h-14 flex-shrink-0 mr-4 overflow-hidden">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 中间文字 */}
                <div className="flex-1 min-w-0">
                  {/* 内容片花（黑色字） */}
                  <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  {/* 会员姓名与达人画像（灰色字） */}
                  <p className="text-sm text-gray-400">
                    {item.name} · {item.profile}
                  </p>
                </div>

                {/* 右侧播放按钮 - 纯方形 */}
                <button className="w-10 h-10 bg-blue-400 flex items-center justify-center flex-shrink-0 ml-3">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 每日宣告 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-blue-400">每日宣告</h2>
          </div>
          {/* 灰色横线 */}
          <div className="h-[1px] bg-gray-200 mb-4" />
          <div className="p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start space-x-4">
              {/* 图像 - 纯方形 */}
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                <img
                  src={dailyDeclaration.image}
                  alt="每日宣告"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 右侧内容 */}
              <div className="flex-1 min-w-0">
                {/* 日期加宣告片花（黑色字） */}
                <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">
                  {dailyDeclaration.title}
                </h3>
                {/* 年月日与录音时长（灰色字） */}
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>{dailyDeclaration.date}</span>
                  <span>·</span>
                  <span>{dailyDeclaration.duration}</span>
                </div>
              </div>

              {/* 播放按钮 - 纯方形 */}
              <button className="w-10 h-10 bg-blue-400 flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 底部留白 */}
      <div className="h-4" />
    </div>
  );
}
