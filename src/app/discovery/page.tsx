'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Flame, Play, User, Users, Timer, Music2, X, List, Folder, Share2, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
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

// 音频URL - 奇异恩典纯乐器（使用公共资源）
const AMAZING_GRACE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// 活动推荐（已改为从 API 加载）

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

// 大鱼的认知库文档数据
const mockDocuments = [
  {
    id: '1',
    type: 'document',
    title: '【新时代来了】用5条AI指令挽救一位创业者',
    icon: 'robot',
    description: '在AI时代，传统创业者面临巨大挑战。本文将介绍5条实用的AI指令，帮助你重新定义业务模式，提高效率，实现转型升级。',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    date: '2025-01-15',
    views: 1234,
  },
  {
    id: '2',
    type: 'document',
    title: '【闭环思维】摆脱单点能力陷阱',
    icon: 'loop',
    description: '很多创业者陷入单点能力的陷阱，只擅长某一方面而忽视了整体。闭环思维帮助你构建完整的商业闭环，实现可持续发展。',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    date: '2025-02-01',
    views: 856,
  },
  {
    id: '3',
    type: 'document',
    title: '【创业刺客】趋势与红利是两回事',
    icon: 'target',
    description: '不要被表面的趋势迷惑。真正的红利往往隐藏在趋势背后。本文教你如何辨别趋势与真正的商业机会。',
    cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
    date: '2025-02-10',
    views: 2156,
  },
  {
    id: '4',
    type: 'document',
    title: '【"能力"过期了】给自己一次机会，20分钟找回特长',
    icon: 'refresh',
    description: '时代在变，曾经的特长可能不再适用。但每个人都有独特的潜力。本文带你找回你的核心竞争力。',
    cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
    date: '2025-02-20',
    views: 943,
  },
  {
    id: '5',
    type: 'document',
    title: '【干就完了】错位竞争5连招',
    icon: 'zap',
    description: '在红海中如何脱颖而出？错位竞争是关键。本文分享5个实用的错位竞争策略，助你找到蓝海市场。',
    cover: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    date: '2025-03-01',
    views: 1678,
  },
  {
    id: '6',
    type: 'document',
    title: '【商业工具箱】出去干仗必须有合手的兵器',
    icon: 'box',
    description: '工欲善其事，必先利其器。本文整理了创业者必备的实用工具和资源，让你的工作效率倍增。',
    cover: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
    date: '2025-03-10',
    views: 1256,
  },
  {
    id: '7',
    type: 'document',
    title: '【摆摊老张的江湖生存课】短板、闭环、真功夫',
    icon: 'book',
    description: '一个普通摆摊老张的生存智慧，揭示了商业的本质：认识短板、构建闭环、练就真功夫。',
    cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
    date: '2025-03-15',
    views: 2345,
  },
];

// 图标映射
const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'robot':
      return '🤖';
    case 'loop':
      return '🔄';
    case 'target':
      return '🎯';
    case 'refresh':
      return '♻️';
    case 'zap':
      return '⚡';
    case 'box':
      return '📦';
    case 'book':
      return '📚';
    case 'table':
      return '📋';
    case 'note':
      return '📝';
    default:
      return '📄';
  }
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
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[0] | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  
  // 数据加载状态
  const [connectionItems, setConnectionItems] = useState<any[]>([]);
  const [activityItems, setActivityItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从 API 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        // 并行加载用户和活动数据
        const [usersRes, activitiesRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/activities?status=active')
        ]);

        if (!usersRes.ok || !activitiesRes.ok) {
          throw new Error('加载数据失败');
        }

        const usersData = await usersRes.json();
        const activitiesData = await activitiesRes.json();

        if (usersData.success) {
          // 将用户数据转换为前端需要的格式
          const formattedUsers = usersData.data.map((user: any) => ({
            id: user.id.toString(),
            name: user.name || user.nickname,
            age: user.age || 0,
            avatar: user.avatar || '/avatar-default.jpg',
            tags: user.tags || [],
            industry: user.industry || '',
            tagStamp: user.tagStamp || 'pureExchange',
            need: user.need || '',
            isTrusted: user.isTrusted || false,
            position: user.position || '',
            company: user.company || '',
          }));
          setConnectionItems(formattedUsers);
        }

        if (activitiesData.success) {
          // 将活动数据转换为前端需要的格式
          const formattedActivities = activitiesData.data.map((activity: any) => ({
            id: activity.id.toString(),
            category: activity.category || '',
            title: activity.title || '',
            subtitle: activity.subtitle || '',
            description: activity.description || '',
            image: activity.image || '',
            enrollments: [], // TODO: 从报名表获取
            enrolledCount: 0, // TODO: 从报名表统计
            maxEnrollments: activity.capacity || 0,
            address: activity.address || '',
            teaFee: `aa茶水费${activity.teaFee || 0}元`,
            status: (activity.status === 'active' || activity.status === 'upcoming') ? 'ongoing' : 'ended',
            endTime: activity.endDate || '',
          }));
          setActivityItems(formattedActivities);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

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

  const handleDocClick = (doc: typeof mockDocuments[0]) => {
    setSelectedDoc(doc);
    setIsDocModalOpen(true);
  };

  const handleDocShare = () => {
    if (navigator.share && selectedDoc) {
      navigator.share({
        title: selectedDoc.title,
        text: selectedDoc.description?.substring(0, 100),
        url: window.location.href,
      });
    }
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
        {/* 顶部导航 - 标题上方留出适当空间 */}
        <div className="sticky top-0 bg-white z-50 pt-[6px]">
          <div className="flex items-center justify-between px-5 -mb-6">
            <h1 className="text-[31px] font-light text-gray-900">发现光亮</h1>
            {/* Logo + 音乐符号 - 点击播放音乐 */}
            <button
              onClick={toggleMusic}
              className="relative w-[126px] h-[126px] flex items-center justify-center transition-colors"
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
            <p className="text-[16px] font-bold text-blue-400 leading-relaxed">
              "燃场app"的使命：建造35岁+的高能信息环境、孵化可落地的高现金流平台。
            </p>
          </div>

          {/* 搜索框 */}
          <div className="px-5 pb-2 pt-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[rgba(0,0,0,0.25)]" />
              <input
                type="text"
                placeholder="搜索AI资产、活动、会员..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[rgba(0,0,0,0.05)] text-[17px] text-gray-900 placeholder-[rgba(0,0,0,0.25)] focus:outline-none focus:bg-[rgba(0,0,0,0.08)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 内容区 - 增加栏目间距，增加底部padding避免被固定的每日宣告遮挡 */}
        <div className="px-5 pt-3 space-y-8 pb-64">
          {/* 能力连接 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">能力</span>
                <span className="text-blue-400">连接</span>
              </h2>
            </div>
            <div className="space-y-4">
              {isLoading && (
                <div className="text-center py-8 text-gray-400">加载中...</div>
              )}
              
              {error && (
                <div className="text-center py-8 text-red-400">{error}</div>
              )}

              {!isLoading && !error && connectionItems.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无数据</div>
              )}

              {!isLoading && !error && connectionItems.length > 0 && (
                <>
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
                    <div className={`absolute top-0 right-0 px-2 py-0.5 text-[12px] font-medium rounded-bl-md z-10 ${
                      item.tagStamp === 'personLookingForJob'
                        ? 'bg-[rgba(34,197,94,0.15)] text-gray-600 border-l-2 border-t-2 border-gray-400'
                        : 'bg-blue-100 text-gray-600 border-l-2 border-t-2 border-gray-400'
                    }`}>
                      {item.tagStamp === 'personLookingForJob' ? '人找事' : '事找人'}
                    </div>
                  )}

                  {/* 方形头像 - 纯方形，点击跳转到详情页 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/connection/${item.id}`);
                    }}
                    className="w-14 h-14 flex-shrink-0 mr-4 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* 中间文字 */}
                  <div className="flex-1 min-w-0">
                    {/* 姓名与标签 */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[17px] font-semibold text-gray-900 line-clamp-1">{item.name}</span>
                      <span className="text-[17px] text-[rgba(0,0,0,0.25)]">{item.age}岁</span>
                    </div>
                    {/* 方形浅灰色标签块 - 纯方形 */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-block px-1.5 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[14px] font-normal line-clamp-1"
                        >
                          {tag}
                        </span>
                      ))}
                      {/* 绿色行业标签块 */}
                      <span className="inline-block px-1.5 py-0.5 bg-[rgba(34,197,94,0.15)] text-green-600 text-[14px] font-normal line-clamp-1">
                        {item.industry}
                      </span>
                    </div>
                    {/* 个人需求说明 */}
                    <p className="text-[15px] text-gray-900 leading-relaxed line-clamp-3">
                      {item.need}
                    </p>
                  </div>
                </div>
              ))}
                </>
            )}
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[18px] font-normal"
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
              {isLoading && (
                <div className="text-center py-8 text-gray-400">加载中...</div>
              )}
              
              {error && (
                <div className="text-center py-8 text-red-400">{error}</div>
              )}

              {!isLoading && !error && activityItems.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无数据</div>
              )}

              {!isLoading && !error && activityItems.length > 0 && (
                <>
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
                        <div className="text-[18px] text-[rgba(0,0,0,0.25)]">{item.category}</div>
                        {/* 状态图标 - 右上角 */}
                        <ActivityStatusBadge status={item.status} endTime={item.endTime} />
                      </div>
                      {/* 活动主题与副标题（黑色字） */}
                      <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[16px] text-gray-900 mb-2 leading-relaxed line-clamp-2">
                        {item.subtitle}
                      </p>
                      {/* 活动简介 - 纯方形灰色框 */}
                      <div className="p-2.5 bg-[rgba(0,0,0,0.05)] mb-2">
                        <p className="text-[16px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                      {/* 报名人数、地址、茶水费 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-[rgba(0,0,0,0.25)] flex-shrink-0" />
                          <span className="text-[12px] text-[rgba(0,0,0,0.25)]">
                            {item.enrolledCount}人
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[12px] text-[rgba(0,0,0,0.25)]">
                          <span className="line-clamp-1">{item.address.substring(0, 6)}</span>
                          <span>·</span>
                          <span>{item.teaFee.substring(0, 5)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
                </>
            )}
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[18px] font-normal"
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
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-normal text-[17px] bg-[rgba(0,0,0,0.25)] text-[rgba(0,0,0,0.25)]"
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
                    <h3 className="text-[17px] font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {/* 达人画像与时长（灰色字） */}
                    <p className="text-[15px] text-[rgba(0,0,0,0.25)] flex items-center">
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
                className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[18px] font-normal"
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
          <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors">
            <div className="flex items-center space-x-3">
              {/* 左侧图标 - 正方形 */}
              <div className="flex-shrink-0">
                <img
                  src="/daily-declaration-square.webp"
                  alt="每日宣告"
                  className="w-10 h-10 object-cover"
                />
              </div>

              {/* 中间内容 */}
              <div className="flex-1 min-w-0 cursor-pointer">
                {/* 日期加宣告片花（黑色字） */}
                <h3 className="text-[17px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-1">
                  {dailyDeclaration.title}
                </h3>
                {/* 年月日与录音时长（灰色字） */}
                <div className="flex items-center space-x-2 text-[12px] text-[rgba(0,0,0,0.25)]">
                  <span>{dailyDeclaration.date}</span>
                  <span>·</span>
                  <span className="flex items-center">
                    <Timer className="w-3 h-3 mr-1" />
                    {dailyDeclaration.duration}
                  </span>
                </div>
              </div>

              {/* 播放按钮 - 缩小30% */}
              <button className="w-7 h-7 bg-blue-400 flex items-center justify-center flex-shrink-0 rounded">
                <Play className="w-3 h-3 text-white fill-white ml-0.5" />
              </button>

              {/* 查看详情按钮 - 醒目设计 */}
              <button
                onClick={() => setShowAssetsModal(true)}
                className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 flex items-center justify-center flex-shrink-0 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              >
                <Zap className="w-4 h-4 text-white" />
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
          <div className="text-[17px] sm:text-sm text-[rgba(0,0,0,0.3)] leading-relaxed text-center max-w-lg">
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
          {/* 内容容器 */}
          <div className="relative w-full max-w-[480px] bg-white max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
            {/* 顶部导航 */}
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
                <div>
                  {connectionItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowModal(false);
                        router.push(`/ability/${item.id}`);
                      }}
                      className="relative flex items-start space-x-[8px] py-[11px] border-b border-[rgba(0,0,0,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                    >
                      {/* 角色标签 - 右上角 */}
                      {item.tagStamp && (
                        <div className={`absolute top-[11px] right-0 px-2 py-0.5 text-[12px] font-medium rounded-bl-md z-10 ${
                          item.tagStamp === 'personLookingForJob'
                            ? 'bg-[rgba(34,197,94,0.15)] text-gray-600 border-l-2 border-t-2 border-gray-400'
                            : item.tagStamp === 'jobLookingForPerson'
                            ? 'bg-blue-100 text-gray-600 border-l-2 border-t-2 border-gray-400'
                            : 'bg-[rgba(0,0,0,0.05)] text-gray-600 border-l-2 border-t-2 border-gray-400'
                        }`}>
                          {item.tagStamp === 'personLookingForJob' ? '人找事' : item.tagStamp === 'jobLookingForPerson' ? '事找人' : '纯交流'}
                        </div>
                      )}

                      {/* 头像 */}
                      <div className="flex-shrink-0 w-[60px] h-[60px] overflow-hidden">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* 内容 */}
                      <div className="flex-1 min-w-0 pr-16">
                        {/* 姓名与年龄 */}
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[17px] font-semibold text-gray-900">{item.name}</span>
                          <span className="text-[17px] text-[rgba(0,0,0,0.25)]">{item.age}岁</span>
                          {item.isTrusted && (
                            <span className="text-[14px] text-green-600">✓</span>
                          )}
                        </div>
                        
                        {/* 标签和行业 */}
                        <div className="flex flex-wrap gap-2 mb-1">
                          {item.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-block px-1.5 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[14px] font-normal line-clamp-1"
                            >
                              {tag}
                            </span>
                          ))}
                          {/* 绿色行业标签块 */}
                          <span className="inline-block px-1.5 py-0.5 bg-[rgba(34,197,94,0.15)] text-green-600 text-[14px] font-normal line-clamp-1">
                            {item.industry}
                          </span>
                        </div>
                        
                        {/* 个人需求说明 */}
                        <p className="text-[15px] text-gray-900 leading-relaxed line-clamp-2">
                          {item.need}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modalType === 'activities' && (
                <div>
                  {activityItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowModal(false);
                        router.push(`/activity/${item.id}`);
                      }}
                      className="flex items-start space-x-[8px] py-[11px] border-b border-[rgba(0,0,0,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                    >
                      {/* 图片 */}
                      <div className="flex-shrink-0 w-[60px] h-[60px] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[18px] text-gray-900 leading-relaxed line-clamp-2">{item.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[18px] text-[rgba(0,0,0,0.25)]">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modalType === 'declarations' && (
                <div>
                  {declarationItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowModal(false);
                        router.push(`/declaration/${item.id}`);
                      }}
                      className="flex items-start space-x-[8px] py-[11px] border-b border-[rgba(0,0,0,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                    >
                      {/* 图标 */}
                      <div className="flex-shrink-0 w-[28px] h-[28px] flex items-center justify-center bg-[rgba(0,0,0,0.05]">
                        <img
                          src={item.icon}
                          alt={item.iconType}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[18px] text-gray-900 leading-relaxed line-clamp-2">{item.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[18px] text-[rgba(0,0,0,0.25)]">{item.profile}</span>
                        </div>
                      </div>
                      
                      {/* 播放按钮 */}
                      <button
                        className="flex-shrink-0 text-blue-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayDeclaration(item.id);
                        }}
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 大鱼的认知库模态框 */}
      {showAssetsModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-3 sm:p-4">
          {/* 内容容器 */}
          <div className="relative w-full max-w-[480px] bg-white max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
            {/* 顶部导航 */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-[rgba(0,0,0,0.05)]">
              <h3 className="text-sm font-semibold text-gray-900">大鱼的认知库</h3>
              <button
                onClick={() => setShowAssetsModal(false)}
                className="w-8 h-8 flex items-center justify-center text-[rgba(0,0,0,0.25)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 文档列表 */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocClick(doc)}
                  className="flex items-start space-x-[8px] py-[11px] border-b border-[rgba(0,0,0,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                >
                  {/* 图标 */}
                  <div className="flex-shrink-0 w-[28px] h-[28px] flex items-center justify-center bg-[rgba(0,0,0,0.05)] rounded-none">
                    <span className="text-[18px]">{getIcon(doc.icon)}</span>
                  </div>

                  {/* 文档标题 */}
                  <div className="flex-1">
                    <h3 className="text-[18px] text-gray-900 leading-relaxed">
                      {doc.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 文档详情模态框 */}
      {isDocModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-3 sm:p-4">
          {/* 内容容器 */}
          <div className="relative w-full max-w-[480px] bg-white max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
            {/* 顶部导航 */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-[rgba(0,0,0,0.05)]">
              <h3 className="text-sm font-semibold text-gray-900">文档详情</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={handleDocShare} className="w-8 h-8 p-0 flex items-center justify-center text-[rgba(0,0,0,0.25)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-shrink-0">
                  <Share2 className="w-5 h-5" />
                </Button>
                <button
                  onClick={() => setIsDocModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[rgba(0,0,0,0.25)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* 封面图 */}
              {selectedDoc.cover && (
                <div className="w-full h-56 overflow-hidden">
                  <img
                    src={selectedDoc.cover}
                    alt={selectedDoc.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="px-5 py-4 space-y-4">
                {/* 标题 */}
                <div>
                  <h2 className="text-[15px] font-bold text-gray-900 mb-2">
                    {selectedDoc.title}
                  </h2>
                  <div className="flex items-center space-x-3 text-[18px] text-[rgba(0,0,0,0.4)]">
                    <span>{selectedDoc.date}</span>
                    <span>•</span>
                    <span>{selectedDoc.views} 浏览</span>
                  </div>
                </div>

                {/* 描述 */}
                <div className="py-4">
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-2">文档简介</h3>
                  <p className="text-[12px] text-[rgba(0,0,0,0.6)] leading-relaxed">
                    {selectedDoc.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
