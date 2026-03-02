'use client';

import { useState, useEffect } from 'react';
import { Search, Flame, Play, User, Timer } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNav } from '@/components/bottom-nav';

// 能力连接
const connectionItems = [
  {
    id: '1',
    name: '王姐',
    age: 48,
    avatar: '/avatar-1.jpg',
    tags: ['供应链专家', '数字化转型'],
    industry: '制造业',
    tagStamp: 'personLookingForJob', // 人找事
    need: '希望找到传统制造业的数字化项目机会',
  },
  {
    id: '2',
    name: '李明',
    age: 52,
    avatar: '/avatar-2.jpg',
    tags: ['投融资', '战略规划'],
    industry: '金融投资',
    tagStamp: 'jobLookingForPerson', // 事找人
    need: '想寻找优质项目对接投资机构',
  },
  {
    id: '3',
    name: '赵芳',
    age: 45,
    avatar: '/avatar-3.jpg',
    tags: ['人力资源', '团队管理'],
    industry: '企业服务',
    tagStamp: 'personLookingForJob', // 人找事
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
    status: 'ended', // 进行中 / 已结束
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
    status: 'ongoing', // 进行中
    endTime: '2024-03-15T18:00:00', // 结束时间
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
    status: 'ongoing', // 进行中
    endTime: '2024-03-20T14:00:00', // 结束时间
  },
];

// 高燃宣告 - 使用图标类型
const declarationItems = [
  {
    id: '1',
    rank: 1,
    icon: '/icon-confidence.jpg',
    iconType: '信心',
    title: '用AI重塑传统制造业',
    profile: '制造专家',
    duration: '5:23',
  },
  {
    id: '2',
    rank: 2,
    icon: '/icon-mission.jpg',
    iconType: '使命',
    title: '35+创业者的破局之路',
    profile: '连续创业者',
    duration: '8:15',
  },
  {
    id: '3',
    rank: 3,
    icon: '/icon-self.jpg',
    iconType: '自我',
    title: '从HR到企业合伙人',
    profile: '战略顾问',
    duration: '6:42',
  },
  {
    id: '4',
    rank: 4,
    icon: '/icon-opponent.jpg',
    iconType: '对手',
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

// 倒计时 Hook
const useCountdown = (endTime: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

// 状态图标组件
const ActivityStatusBadge = ({ status, endTime }: { status: string; endTime?: string }) => {
  const timeLeft = useCountdown(endTime);

  if (status === 'ended') {
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-[rgba(0,0,0,0.08)]">
        <div className="w-1.5 h-1.5 bg-[rgba(0,0,0,0.4)]" />
        <span className="text-[10px] text-[rgba(0,0,0,0.4)]">已结束</span>
      </div>
    );
  }

  if (status === 'ongoing' && endTime) {
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50">
        <div className="w-1.5 h-1.5 bg-blue-400 animate-pulse" />
        <span className="text-[10px] text-blue-400 font-medium">{timeLeft}</span>
      </div>
    );
  }

  return null;
};

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white pb-14">
      {/* 可滚动内容区 - 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 - 标题上方留出两个字高度 */}
        <div className="sticky top-0 bg-white z-50 pt-[60px]">
          <div className="flex items-center justify-between px-5 pt-4">
            <h1 className="text-2xl font-light text-gray-900">发现光亮</h1>
            {/* Logo - 燃场品牌Logo */}
            <div className="w-[126px] h-[126px] flex items-center justify-center">
              <img src="/logo-ranchang.png" alt="燃场Logo" className="w-[90px] h-[90px] object-contain" />
            </div>
          </div>

          {/* Slogan - 蓝色加大字号，加粗 */}
          <div className="px-5 pb-4">
            <p className="text-[14px] font-bold text-blue-400 leading-relaxed">
              只要抓住使命，当年力量如何，现在力量也必定如何。<br />
              35岁才是新的的开始，向前加油不回头！
            </p>
          </div>

          {/* 搜索框 */}
          <div className="px-5 pb-4 pt-0">
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
        </div>

        {/* 内容区 - 增加栏目间距，增加底部padding避免被固定的每日宣告遮挡 */}
        <div className="px-5 pt-6 space-y-8 pb-64">
          {/* 能力连接 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">能力</span>
                <span className="text-blue-400">连接</span>
              </h2>
            </div>
            <div className="space-y-4">
              {connectionItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex items-start p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                >
                  {/* 标签戳 */}
                  {item.tagStamp && (
                    <div className={`absolute top-0 right-0 px-2 py-0.5 text-[9px] font-medium rounded-bl-md z-10 ${
                      item.tagStamp === 'personLookingForJob'
                        ? 'bg-[rgba(34,197,94,0.15)] text-gray-600 border-l-2 border-t-2 border-gray-400'
                        : 'bg-blue-100 text-gray-600 border-l-2 border-t-2 border-gray-400'
                    }`}>
                      {item.tagStamp === 'personLookingForJob' ? '人找事' : '事找人'}
                    </div>
                  )}

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
                      {/* 绿色行业标签块 */}
                      <span className="inline-block px-2.5 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal line-clamp-1">
                        {item.industry}
                      </span>
                    </div>
                    {/* 个人需求说明 */}
                    <p className="text-[11px] text-gray-900 leading-relaxed line-clamp-3">
                      {item.need}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* 查看更多灰色色块 - 缩小50% */}
            <div className="mt-4 flex justify-center">
              <button className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                查看更多
              </button>
            </div>
          </section>

          {/* 活动推荐 */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">活动</span>
                <span className="text-blue-400">推荐</span>
              </h2>
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
                      {/* 分类名称和状态图标 */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[11px] text-[rgba(0,0,0,0.25)]">{item.category}</div>
                        {/* 状态图标 - 右上角 */}
                        <ActivityStatusBadge status={item.status} endTime={item.endTime} />
                      </div>
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
            {/* 查看更多灰色色块 - 缩小50% */}
            <div className="mt-4 flex justify-center">
              <button className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                查看更多
              </button>
            </div>
          </section>

          {/* 高燃宣告 */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">高燃</span>
                <span className="text-blue-400">宣告</span>
              </h2>
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

                  {/* 左侧图标 - 纯方形 */}
                  <div className="w-14 h-14 flex-shrink-0 mr-4 overflow-hidden bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                    <img
                      src={item.icon}
                      alt={item.iconType}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* 中间文字 */}
                  <div className="flex-1 min-w-0">
                    {/* 内容片花（黑色字） */}
                    <h3 className="text-[13px] font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {/* 达人画像与时长（灰色字） */}
                    <p className="text-[13px] text-[rgba(0,0,0,0.25)] flex items-center">
                      {item.profile} · <Timer className="w-3 h-3 mx-1" />{item.duration}
                    </p>
                  </div>

                  {/* 右侧播放按钮 - 圆形 */}
                  <button className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 ml-3">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
            {/* 查看更多灰色色块 */}
            <div className="mt-4 flex justify-center">
              <button className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                查看更多
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* 每日宣告 - 固定在底部导航栏上方 */}
      <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-4 bg-white z-40">
        <section>
          <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer">
            <div className="flex items-start space-x-4">
              {/* 图像 - 纯方形，放大30% */}
              <div className="w-8 h-8 flex-shrink-0 overflow-hidden">
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
                  <span className="flex items-center">
                    <Timer className="w-3 h-3 mr-1" />
                    {dailyDeclaration.duration}
                  </span>
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

      {/* 底部导航 - 固定在底部 */}
      <BottomNav />
    </div>
  );
}
