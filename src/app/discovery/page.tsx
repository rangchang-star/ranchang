'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Flame, Play, User, Timer, Music2, X, List } from 'lucide-react';
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
    name: '李哥',
    age: 52,
    avatar: '/avatar-2.jpg',
    tags: ['销售管理', '渠道拓展'],
    industry: '零售业',
    tagStamp: 'jobLookingForPerson', // 事找人
    need: '急需销售负责人，负责全国渠道搭建',
    isTrusted: true,
  },
  {
    id: '3',
    name: '张姐',
    age: 45,
    avatar: '/avatar-3.jpg',
    tags: ['人力资源', '组织发展'],
    industry: '服务业',
    tagStamp: 'jobLookingForPerson', // 事找人
    need: '企业快速扩张，寻求HR负责人支持',
    isTrusted: true,
  },
];

// 活动推荐
const activityItems = [
  {
    id: '1',
    title: '35+企业家私董会',
    image: '/activity-1.jpg',
    category: '线下聚会',
    date: '2024年3月15日',
    address: '上海市浦东新区',
    enrollments: [
      '/avatar-1.jpg',
      '/avatar-2.jpg',
      '/avatar-3.jpg',
    ],
  },
  {
    id: '2',
    title: '数字化转型实战工作坊',
    image: '/activity-2.jpg',
    category: '培训课程',
    date: '2024年3月20日',
    address: '北京市朝阳区',
    enrollments: [
      '/avatar-2.jpg',
      '/avatar-4.jpg',
    ],
  },
  {
    id: '3',
    title: '创业者资源对接会',
    image: '/activity-3.jpg',
    category: '商务对接',
    date: '2024年3月25日',
    address: '深圳市南山区',
    enrollments: [
      '/avatar-3.jpg',
      '/avatar-1.jpg',
      '/avatar-5.jpg',
    ],
  },
];

// 高燃宣告
const declarationItems = [
  {
    id: '1',
    icon: '/declaration-icon-1.jpg',
    iconType: '火焰',
    title: '第101次重启：从零开始',
    profile: '创业者 | 前互联网公司高管',
    audioUrl: 'https://example.com/declaration1.mp3',
  },
  {
    id: '2',
    icon: '/declaration-icon-2.jpg',
    iconType: '闪电',
    title: '转型路上的顿悟时刻',
    profile: '企业培训师 | 20年经验',
    audioUrl: 'https://example.com/declaration2.mp3',
  },
  {
    id: '3',
    icon: '/declaration-icon-3.jpg',
    iconType: '星星',
    title: '放下过去的成就',
    profile: '连续创业者 | 咨询顾问',
    audioUrl: 'https://example.com/declaration3.mp3',
  },
];

// 每日宣告
const dailyDeclaration = {
  title: '每日宣告：重塑自我，迎接新挑战',
  date: '2024年3月3日',
  duration: '3分钟',
  image: '/daily-declaration.jpg',
};

// 背景音乐
const AMAZING_GRACE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingDeclarationId, setPlayingDeclarationId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'abilities' | 'activities' | 'declarations'>('abilities');
  const [trustDialogOpen, setTrustDialogOpen] = useState(false);
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
    const item = declarationItems.find(d => d.id === declarationId);
    if (item) {
      toggleDeclarationAudio(declarationId, item.audioUrl);
    }
  };

  const declarationAudioRefs = useRef<Record<string, HTMLAudioElement>>({});

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
        if (parsedSettings.discovery?.backgroundImage) {
          setDiscoveryBg(parsedSettings.discovery.backgroundImage);
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
                  className={`absolute w-4 h-4 ${isPlaying ? 'text-blue-400' : 'text-gray-400'}`}
                  style={{ top: '20px', right: '30px' }}
                />
              </button>
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

                    {/* 用户信息 */}
                    <div className="flex-1 min-w-0">
                      {/* 名字和年龄 */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                        <span className="text-xs text-[rgba(0,0,0,0.25)]">{item.age}岁</span>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  <span className="text-[rgba(96,165,250,0.6)]">活动</span>
                  <span className="text-blue-400">推荐</span>
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {activityItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/activity/${item.id}`)}
                    className="cursor-pointer group"
                  >
                    {/* 方形图片 - 不带圆角 */}
                    <div className="relative aspect-square overflow-hidden bg-[rgba(0,0,0,0.02)] mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* 已报名人数 */}
                      <div className="absolute top-1 right-1 flex -space-x-1">
                        {item.enrollments.slice(0, 3).map((avatar, idx) => (
                          <Avatar key={idx} className="w-5 h-5 border border-white">
                            <AvatarImage src={avatar} alt={`User ${idx}`} />
                            <AvatarFallback className="text-[8px] bg-gray-200">
                              {idx + 1}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    {/* 标题 - 两行省略 */}
                    <h3 className="text-[11px] font-medium text-gray-900 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>

                    {/* 日期和地点 - 灰色小字 */}
                    <p className="text-[10px] text-[rgba(0,0,0,0.25)] mt-1 line-clamp-1">
                      {item.date}
                    </p>
                  </div>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  <span className="text-[rgba(96,165,250,0.6)]">高燃</span>
                  <span className="text-blue-400">宣告</span>
                </h2>
              </div>

              <div className="space-y-3">
                {declarationItems.map((item) => (
                  <div
                    key={item.id}
                    className={`relative flex items-start p-3 transition-colors ${
                      playingDeclarationId === item.id
                        ? 'bg-blue-50'
                        : 'bg-white hover:bg-[rgba(0,0,0,0.02)]'
                    }`}
                  >
                    {/* 方形图标 - 不带圆角 */}
                    <div className="w-12 h-12 flex-shrink-0 mr-3 overflow-hidden bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                      <img
                        src={item.icon}
                        alt={item.iconType}
                        className="w-8 h-8 object-contain"
                      />
                    </div>

                    {/* 右侧内容 */}
                    <div className="flex-1 min-w-0">
                      {/* 标题 - 两行省略 */}
                      <h3 className="text-[13px] font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h3>

                      {/* 达人画像与时长（灰色字） */}
                      <p className="text-[13px] text-[rgba(0,0,0,0.25)] flex items-center">
                        {item.profile} · <Timer className="w-3 h-3 mx-1" />3分钟
                      </p>
                    </div>

                    {/* 右侧播放按钮 - 圆形 */}
                    <button
                      className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 ml-3"
                      onClick={(e) => {
                        e.stopPropagation();
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
              <div className="flex items-center space-x-3">
                {/* 左侧图标 */}
                <div className="flex-shrink-0">
                  <img
                    src="/daily-declaration-icon.webp"
                    alt="每日宣告"
                    className="w-10 h-10 object-cover"
                  />
                </div>

                {/* 中间内容 */}
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

                {/* 播放按钮 - 缩小30% */}
                <button className="w-7 h-7 bg-blue-400 flex items-center justify-center flex-shrink-0 rounded">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </button>

                {/* 目录图标 */}
                <button className="w-7 h-7 bg-[rgba(0,0,0,0.05)] flex items-center justify-center flex-shrink-0 rounded">
                  <List className="w-3.5 h-3.5 text-gray-600" />
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
