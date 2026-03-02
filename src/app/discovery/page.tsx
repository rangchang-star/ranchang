'use client';

import { useState } from 'react';
import { Search, Flame, Play, User } from 'lucide-react';
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
    address: '北京市朝阳区CBD国贸大厦',
    teaFee: 'aa茶水费35元',
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
    address: '上海市浦东新区张江高科',
    teaFee: 'aa茶水费50元',
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
    address: '深圳市南山区科技园',
    teaFee: 'aa茶水费40元',
  },
];

// 高燃宣告
const declarationItems = [
  {
    id: '1',
    rank: 1,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=zhangming',
    title: '用AI重塑传统制造业',
    profile: '制造专家',
    duration: '5:23',
  },
  {
    id: '2',
    rank: 2,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=wangjie',
    title: '35+创业者的破局之路',
    profile: '连续创业者',
    duration: '8:15',
  },
  {
    id: '3',
    rank: 3,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=lihua',
    title: '从HR到企业合伙人',
    profile: '战略顾问',
    duration: '6:42',
  },
  {
    id: '4',
    rank: 4,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=chenwei',
    title: 'AI时代的产品思维',
    profile: '产品总监',
    duration: '7:30',
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
    <div className="min-h-screen bg-white pb-14">
      {/* 可滚动内容区 - 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 - 标题上方留出两个字高度 */}
        <div className="sticky top-0 bg-white z-50 pt-[60px]">
          <div className="flex items-center justify-between px-5 py-4">
            <h1 className="text-lg font-bold text-gray-900">发现</h1>
            {/* 程序员大叔抽象头像 - 方形 */}
            <div className="w-10 h-10 bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
              <User className="w-5 h-5 text-[rgba(0,0,0,0.25)]" />
            </div>
          </div>

          {/* 搜索框 */}
          <div className="px-5 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[rgba(0,0,0,0.25)]" />
              <input
                type="text"
                placeholder="搜索AI资产、活动、会员..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[rgba(0,0,0,0.05)] text-[13px] text-gray-900 placeholder-[rgba(0,0,0,0.25)] focus:outline-none focus:bg-[rgba(0,0,0,0.08)] transition-colors"
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
                  className={`px-4 py-2 text-[13px] font-normal whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-400 text-white'
                      : 'bg-[rgba(0,0,0,0.05)] text-gray-700 hover:bg-[rgba(0,0,0,0.08)]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 内容区 - 增加栏目间距 */}
        <div className="px-5 pt-6 space-y-8 pb-4">
          {/* 能力连接 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-blue-400">能力连接</h2>
            </div>
            <div className="space-y-4">
              {connectionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
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
                      <span className="text-[13px] font-semibold text-gray-900 line-clamp-1">{item.name}</span>
                      <span className="text-[13px] text-[rgba(0,0,0,0.25)]">{item.age}岁</span>
                    </div>
                    {/* 方形浅灰色标签块 - 纯方形 */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* 个人需求说明 */}
                    <p className="text-[11px] text-gray-900 leading-relaxed line-clamp-3">
                      {item.need}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* 换一换灰色色块 - 缩小50% */}
            <div className="mt-4 flex justify-center">
              <button className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                换一换
              </button>
            </div>
          </section>

          {/* 活动推荐 */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-blue-400">活动推荐</h2>
            </div>
            {/* 灰色横线 */}
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-4">
              {activityItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
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
                      <div className="text-[11px] text-[rgba(0,0,0,0.25)] mb-1">{item.category}</div>
                      {/* 活动主题与副标题（黑色字） */}
                      <h3 className="text-[13px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-gray-900 mb-2 leading-relaxed line-clamp-2">
                        {item.subtitle}
                      </p>
                      {/* 活动简介 - 纯方形灰色框 */}
                      <div className="p-2.5 bg-[rgba(0,0,0,0.05)] mb-2">
                        <p className="text-[11px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                      {/* 报名人头像、人数、地址、茶水费 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {item.enrollments.slice(0, 3).map((avatar, idx) => (
                              <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                                <AvatarImage src={avatar} />
                                <AvatarFallback>用</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-[9px] text-[rgba(0,0,0,0.25)]">
                            {item.enrolledCount}人
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[9px] text-[rgba(0,0,0,0.25)]">
                          <span className="line-clamp-1">{item.address.substring(0, 6)}</span>
                          <span>·</span>
                          <span>{item.teaFee.substring(0, 5)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 换一换灰色色块 - 缩小50% */}
            <div className="mt-4 flex justify-center">
              <button className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                换一换
              </button>
            </div>
          </section>

          {/* 高燃宣告 */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-blue-400">高燃宣告</h2>
            </div>
            {/* 灰色横线 */}
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-3">
              {declarationItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                >
                  {/* 排序 - 圆形，缩小70%，灰色 */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-normal text-[13px] bg-[rgba(0,0,0,0.25)] text-[rgba(0,0,0,0.25)]"
                  >
                    {item.rank}
                  </div>

                  {/* 左侧头像 - 纯方形 */}
                  <div className="w-14 h-14 flex-shrink-0 mr-4 overflow-hidden">
                    <img
                      src={item.avatar}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 中间文字 */}
                  <div className="flex-1 min-w-0">
                    {/* 内容片花（黑色字） */}
                    <h3 className="text-[13px] font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {/* 达人画像与时长（灰色字） */}
                    <p className="text-[13px] text-[rgba(0,0,0,0.25)]">
                      {item.profile} · {item.duration}
                    </p>
                  </div>

                  {/* 右侧播放按钮 - 圆形 */}
                  <button className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 ml-3">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
            {/* 查看完整榜单 */}
            <div className="mt-4 flex flex-col items-center space-y-2">
              {/* 三道线段：一条蓝色、两条灰色 - 左右滑动条 */}
              <div className="flex space-x-2">
                <div className="w-1 h-3 bg-blue-400"></div>
                <div className="w-1 h-3 bg-[rgba(0,0,0,0.15)]"></div>
                <div className="w-1 h-3 bg-[rgba(0,0,0,0.15)]"></div>
              </div>
              <button className="w-48 px-4 py-2.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[13px] font-normal">
                查看完整榜单
              </button>
            </div>
          </section>

          {/* 每日宣告 */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-blue-400">每日宣告</h2>
            </div>
            {/* 灰色横线 */}
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer">
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
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-1">
                    {dailyDeclaration.title}
                  </h3>
                  {/* 年月日与录音时长（灰色字） */}
                  <div className="flex items-center space-x-2 text-[11px] text-[rgba(0,0,0,0.25)]">
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
      </div>

      {/* 底部导航 - 固定在底部 */}
      <BottomNav />
    </div>
  );
}
