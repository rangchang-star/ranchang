'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Flame, Play, User, Timer, Music2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    isTrusted: true, // 是否被信任
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
    isTrusted: false, // 未信任
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
    isTrusted: true,
  },
  {
    id: '4',
    name: '陈伟',
    age: 50,
    avatar: '/avatar-4.jpg',
    tags: ['市场营销', '品牌建设'],
    industry: '消费零售',
    tagStamp: 'jobLookingForPerson', // 事找人
    need: '寻找优质的营销合作项目',
    isTrusted: false,
  },
  {
    id: '5',
    name: '刘芳',
    age: 47,
    avatar: '/avatar-5.jpg',
    tags: ['财务顾问', '税务筹划'],
    industry: '专业服务',
    tagStamp: 'personLookingForJob', // 人找事
    need: '为企业提供专业的财务咨询服务',
    isTrusted: true,
  },
];

// 音频URL - 奇异恩典纯乐器（使用公共资源）
const AMAZING_GRACE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingDeclarationId, setPlayingDeclarationId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'abilities' | 'activities' | 'declarations'>('abilities');
  const [trustDialogOpen, setTrustDialogOpen] = useState(false);
  const declarationAudioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [discoveryBg, setDiscoveryBg] = useState<string>('/discovery-bg.jpg');
  const router = useRouter();

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleDeclarationAudio = (declarationId: string, audioUrl?: string) => {
    if (playingDeclarationId === declarationId) {
      // 暂停当前播放
      const audio = declarationAudioRefs.current[declarationId];
      if (audio) {
        audio.pause();
        setPlayingDeclarationId(null);
      }
    } else {
      // 暂停之前的
      if (playingDeclarationId) {
        const prevAudio = declarationAudioRefs.current[playingDeclarationId];
        if (prevAudio) prevAudio.pause();
      }
      // 播放新的
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        declarationAudioRefs.current[declarationId] = audio;
        audio.play();
        setPlayingDeclarationId(declarationId);
      }
    }
  };

  const handlePlayDeclaration = (declarationId: string) => {
    // 模拟音频URL
    const audioUrl = `https://example.com/declaration/${declarationId}.mp3`;
    toggleDeclarationAudio(declarationId, audioUrl);
  };

  useEffect(() => {
    const audio = new Audio(AMAZING_GRACE_AUDIO);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // 从localStorage读取背景图设置
    try {
      const settings = localStorage.getItem('pageSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        if (parsedSettings.discovery?.bgImage) {
          setDiscoveryBg(parsedSettings.discovery.bgImage);
        }
      }
    } catch (error) {
      console.error('读取背景图设置失败:', error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen pb-14" style={{ backgroundImage: `url(${discoveryBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* 白色遮罩层，确保文字清晰可读 */}
      <div className="min-h-screen bg-white/95 pb-14">
      {/* 可滚动内容区 - 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 - 标题上方留出两个字高度 */}
        <div className="sticky top-0 bg-white z-50 pt-[60px]">
          <div className="flex items-center justify-between px-5 pt-4">
            <h1 className="text-2xl font-light text-gray-900">发现光亮</h1>
            {/* Logo + 音乐符号 - 点击播放音乐 */}
            <button
              onClick={toggleMusic}
              className="relative w-[126px] h-[126px] flex items-center justify-center hover:bg-[rgba(0,0,0,0.02)] transition-colors"
            >
              <img
                src="/logo-ranchang.png"
                alt="燃场Logo"
                className="w-[90px] h-[90px] object-contain"
              />
              {/* 音乐符号在logo内部 */}
              <Music2
                className={`absolute w-6 h-6 transition-colors ${
                  isPlaying
                    ? 'text-[rgba(0,0,0,0.7)]'
                    : 'text-[rgba(0,0,0,0.3)]'
                }`}
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </button>
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
              {connectionItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.isTrusted) {
                      setTrustDialogOpen(true);
                    }
                  }}
                  className={`relative flex items-start p-3 transition-colors ${
                    item.isTrusted
                      ? 'bg-white hover:bg-[rgba(0,0,0,0.02)] cursor-pointer'
                      : 'bg-[rgba(0,0,0,0.02)] cursor-not-allowed opacity-75'
                  }`}
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
              <button
                className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal"
                onClick={() => {
                  setModalType('abilities');
                  setShowModal(true);
                }}
              >
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
              {activityItems.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/activity/${item.id}`}
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
                </Link>
              ))}
            </div>
            {/* 查看更多灰色色块 - 缩小50% */}
            <div className="mt-4 flex justify-center">
              <button
                className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal"
                onClick={() => {
                  setModalType('activities');
                  setShowModal(true);
                }}
              >
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
              {declarationItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/declaration/${item.id}`)}
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
                  <button
                    className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 ml-3"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      handlePlayDeclaration(item.id);
                    }}
                  >
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
            {/* 查看更多灰色色块 */}
            <div className="mt-4 flex justify-center">
              <button
                className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal"
                onClick={() => {
                  setModalType('declarations');
                  setShowModal(true);
                }}
              >
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

      {/* 能力连接权限提示对话框 */}
      <Dialog open={trustDialogOpen} onOpenChange={setTrustDialogOpen}>
        <DialogContent className="w-[95%] max-w-[480px] max-h-[85vh] overflow-y-auto p-5 sm:p-6 flex flex-col items-center justify-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-base sm:text-lg font-semibold">提示</DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>
          <div className="text-[13px] sm:text-sm text-gray-600 leading-relaxed text-center max-w-lg">
            该用户尚未开启"允许陌生人连接"权限，您可以先了解ta，或让ta主动来找到你。
          </div>
          <div className="flex justify-end mt-5 sm:mt-6 w-full">
            <Button
              variant="ghost"
              className="text-xs sm:text-sm h-8 sm:h-9 px-4 sm:px-6 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] hover:bg-[rgba(0,0,0,0.1)]"
              onClick={() => setTrustDialogOpen(false)}
            >
              我知道了
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 查看更多悬浮页面 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="w-[95%] h-[85vh] max-w-[480px] bg-white rounded-lg shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* 顶部固定区域 - 标题和关闭按钮 */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-[rgba(0,0,0,0.05)]">
              <h3 className="text-sm font-semibold text-gray-900">
                {modalType === 'abilities' && '更多能力连接'}
                {modalType === 'activities' && '更多活动'}
                {modalType === 'declarations' && '更多高燃宣告'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center text-[rgba(0,0,0,0.25)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 滚动内容区域 */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
              {modalType === 'abilities' && (
                <div className="space-y-3">
                  {connectionItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-3 bg-[rgba(0,0,0,0.02)] cursor-pointer"
                      onClick={() => {
                        setShowModal(false);
                        router.push(`/ability/${item.id}`);
                      }}
                    >
                      {/* 头像 */}
                      <div className="w-[60px] h-[60px] flex-shrink-0 mr-3 overflow-hidden">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[13px] font-semibold text-gray-900">{item.name}</span>
                          <span className="text-[13px] text-[rgba(0,0,0,0.25)]">{item.age}岁</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[10px]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-900 line-clamp-2">{item.need}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modalType === 'activities' && (
                <div className="space-y-3">
                  {activityItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[rgba(0,0,0,0.02)] cursor-pointer"
                      onClick={() => {
                        setShowModal(false);
                        router.push(`/activity/${item.id}`);
                      }}
                    >
                      <div className="flex items-start">
                        <div className="w-[60px] h-[60px] flex-shrink-0 mr-3 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-[rgba(0,0,0,0.25)] mb-1">{item.category}</div>
                          <h3 className="text-[13px] font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                          <p className="text-[11px] text-[rgba(0,0,0,0.25)]">{item.address.substring(0, 8)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modalType === 'declarations' && (
                <div className="space-y-3">
                  {declarationItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-3 bg-[rgba(0,0,0,0.02)] cursor-pointer"
                      onClick={() => {
                        setShowModal(false);
                        router.push(`/declaration/${item.id}`);
                      }}
                    >
                      <div className="w-10 h-10 flex-shrink-0 mr-3 overflow-hidden bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                        <img
                          src={item.icon}
                          alt={item.iconType}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                        <p className="text-[11px] text-[rgba(0,0,0,0.25)]">{item.profile}</p>
                      </div>
                      <button
                        className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayDeclaration(item.id);
                        }}
                      >
                        <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
