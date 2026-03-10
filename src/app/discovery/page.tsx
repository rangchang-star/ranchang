"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Flame,
  Play,
  User,
  Users,
  Timer,
  Music2,
  X,
  List,
  Folder,
  Share2,
  ArrowLeft,
  ArrowRight,
  Zap,
  RefreshCw,
  Lightbulb,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BottomNav } from "@/components/bottom-nav";

// 活动推荐（已改为从 API 加载）

// 高燃宣告（已改为从 API 加载）

// 硬核图谱 - 技能树（半透明圆形不规则排列）
const skillBubbles = [
  // 三个较大的圆形（前三个技能），大小不同，使用蓝色+黄色配色
  {
    id: 's1',
    name: 'AI技术',
    size: 80,
    color: 'bg-blue-400/50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    x: 25,
    y: 30
  },
  {
    id: 's2',
    name: '定方向',
    size: 75,
    color: 'bg-yellow-400/45',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-800',
    x: 65,
    y: 25
  },
  {
    id: 's3',
    name: '带兵打仗',
    size: 70,
    color: 'bg-blue-300/45',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-700',
    x: 45,
    y: 65
  },
  // 中等大小的圆形 - 黄色系
  {
    id: 's4',
    name: '从0到1',
    size: 55,
    color: 'bg-yellow-300/40',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-700',
    x: 15,
    y: 55
  },
  {
    id: 's5',
    name: '摆平滥摊',
    size: 50,
    color: 'bg-yellow-200/40',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-600',
    x: 80,
    y: 50
  },
  {
    id: 's6',
    name: '搞定人',
    size: 52,
    color: 'bg-blue-200/40',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-600',
    x: 70,
    y: 80
  },
  // 小圆形 - 浅色系
  {
    id: 's7',
    name: '看懂账本',
    size: 45,
    color: 'bg-yellow-100/45',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-600',
    x: 30,
    y: 15
  },
  {
    id: 's8',
    name: '攒局组队',
    size: 42,
    color: 'bg-blue-100/45',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    x: 85,
    y: 20
  },
  {
    id: 's9',
    name: '卖出去',
    size: 40,
    color: 'bg-yellow-100/40',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-500',
    x: 10,
    y: 80
  },
  {
    id: 's10',
    name: '稳军心',
    size: 38,
    color: 'bg-blue-100/40',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-500',
    x: 50,
    y: 90
  },
  {
    id: 's11',
    name: '搞定自己',
    size: 48,
    color: 'bg-yellow-200/40',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-600',
    x: 55,
    y: 10
  },
  {
    id: 's12',
    name: '找人识人',
    size: 44,
    color: 'bg-blue-200/40',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-600',
    x: 20,
    y: 40
  },
  {
    id: 's13',
    name: '会说人话',
    size: 46,
    color: 'bg-yellow-200/40',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-600',
    x: 90,
    y: 70
  }
];

// 技能详细描述映射
const skillDescriptions: Record<string, string> = {
  s1: 'AI技术 | 拥抱AI，掌握前沿技术工具',
  s2: '定方向 | 做战略、选赛道、不踩坑',
  s3: '带兵打仗 | 从管1个人到管100个人的实战能力',
  s4: '从0到1 | 冷启动、开荒、从零搭班子',
  s5: '摆平烂摊 | 接盘烂项目、救火、危机处理',
  s6: '搞定人 | 跨部门推动、向上管理、难缠客户',
  s7: '看懂账本 | 算成本、看财报、懂毛利、控预算',
  s8: '攒局组队 | 拉资源、找搭档、攒项目',
  s9: '卖出去 | 拿单、成交、搞钱',
  s10: '稳军心 | 团队动荡、士气低、人心散',
  s11: '搞定自己 | 情绪管理、抗压、不崩',
  s12: '找人识人 | 招对人、看走眼、搭团队',
  s13: '会说人话 | 汇报、路演、谈判、讲明白事'
};

// 图标映射
const getIcon = (iconType: string) => {
  switch (iconType) {
    case "robot":
      return "🤖";
    case "loop":
      return "🔄";
    case "target":
      return "🎯";
    case "refresh":
      return "♻️";
    case "zap":
      return "⚡";
    case "box":
      return "📦";
    case "book":
      return "📚";
    case "table":
      return "📋";
    case "note":
      return "📝";
    default:
      return "📄";
  }
};

// 倒计时 Hook
const useCountdown = (endTime: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

// 状态图标组件
const ActivityStatusBadge = ({
  status,
  endTime,
}: {
  status: string;
  endTime?: string;
}) => {
  const timeLeft = useCountdown(endTime);

  if (status === "ended") {
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-[rgba(0,0,0,0.08)]">
        <div className="w-1.5 h-1.5 bg-[rgba(0,0,0,0.4)]" />
        <span className="text-[10px] text-[rgba(0,0,0,0.4)]">已结束</span>
      </div>
    );
  }

  if (status === "ongoing" && endTime) {
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50">
        <div className="w-1.5 h-1.5 bg-blue-400 animate-pulse" />
        <span className="text-[10px] text-blue-400 font-medium">
          {timeLeft}
        </span>
      </div>
    );
  }

  return null;
};

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingDeclarationId, setPlayingDeclarationId] = useState<
    string | null
  >(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "abilities" | "activities" | "declarations"
  >("abilities");
  const [trustDialogOpen, setTrustDialogOpen] = useState(false);
  const declarationAudioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [discoveryBg, setDiscoveryBg] = useState<string>("/discovery-bg.jpg");
  const router = useRouter();

  // 页面设置state
  const [pageSettings, setPageSettings] = useState({
    discovery: {
      slogan: "发现光亮，点亮事业",
      logo: "/logo-ranchang.png",
      music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      backgroundImage: "/discovery-bg.jpg",
    },
  });

  // 音频URL state
  const [audioUrl, setAudioUrl] = useState(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  );

  const [showAssetsModal, setShowAssetsModal] = useState(false);
  
  // 技能气泡点击状态
  const [clickedBubbleId, setClickedBubbleId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // 数据加载状态
  const [connectionItems, setConnectionItems] = useState<any[]>([]);
  const [activityItems, setActivityItems] = useState<any[]>([]);
  const [declarationItems, setDeclarationItems] = useState<any[]>([]);
  const [documentItems, setDocumentItems] = useState<any[]>([]);
  const [dailyDeclaration, setDailyDeclaration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从API加载页面设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPageSettings(data.data);
            if (data.data.discovery?.music) {
              setAudioUrl(data.data.discovery.music);
            }
          }
        }
      } catch (error) {
        console.error("加载设置失败:", error);
      }
    };

    loadSettings();
  }, []);

  // 从 API 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        // 并行加载用户、活动、高燃宣告、文档和每日宣告数据
        const [usersRes, activitiesRes, declarationsRes, documentsRes, dailyRes] =
          await Promise.all([
            fetch("/api/users"),
            fetch("/api/activities?status=active"),
            fetch("/api/declarations"),
            fetch("/api/documents"),
            fetch("/api/daily-declarations"),
          ]);

        if (
          !usersRes.ok ||
          !activitiesRes.ok ||
          !declarationsRes.ok ||
          !documentsRes.ok
        ) {
          throw new Error("加载数据失败");
        }

        const usersData = await usersRes.json();
        const activitiesData = await activitiesRes.json();
        const declarationsData = await declarationsRes.json();
        const documentsData = await documentsRes.json();

        if (usersData.success) {
          // 将用户数据转换为前端需要的格式
          const formattedUsers = usersData.data.map((user: any) => ({
            id: user.id.toString(),
            name: user.name || user.nickname,
            age: user.age || 0,
            avatar: user.avatar || "/avatar-default.jpg",
            tags: user.hardcore_tags || user.tags || [], // 优先使用 hardcore_tags
            industry: user.industry || "",
            tagStamp: user.tag_stamp || "pureExchange",
            need: user.need || "",
            isTrusted: user.is_trusted || false,
            isFeatured: user.is_featured || false, // 保留 is_featured 字段用于排序
            position: user.position || "",
            company: user.company || "",
          }));

          // 排序逻辑：指定用户在前，非指定用户随机排列在后
          const featuredUsers = formattedUsers.filter(
            (user: any) => user.isFeatured,
          );
          const regularUsers = formattedUsers.filter(
            (user: any) => !user.isFeatured,
          );

          // 对非指定用户进行随机排列
          const shuffledRegularUsers = regularUsers.sort(
            () => Math.random() - 0.5,
          );

          // 合并：指定用户在前，随机用户在后
          setConnectionItems([...featuredUsers, ...shuffledRegularUsers]);
        }

        if (activitiesData.success) {
          // 将活动数据转换为前端需要的格式
          const formattedActivities = activitiesData.data.map(
            (activity: any) => ({
              id: activity.id.toString(),
              category: activity.category || "",
              title: activity.title || "",
              subtitle: activity.subtitle || "",
              description: activity.description || "",
              image: activity.image || "",
              enrollments:
                activity.participants?.map((p: any) => p.id.toString()) || [],
              enrolledCount: activity.enrolledCount || 0,
              maxEnrollments: activity.capacity || 0,
              address: activity.address || "",
              teaFee: `茶水费${activity.teaFee || 0}元`,
              status:
                activity.status === "active" || activity.status === "upcoming"
                  ? "ongoing"
                  : "ended",
              endTime: activity.endDate || "",
            }),
          );
          setActivityItems(formattedActivities);
        }

        if (declarationsData.success) {
          // 将高燃宣告数据转换为前端需要的格式
          const formattedDeclarations = declarationsData.data.map(
            (declaration: any) => ({
              id: declaration.id.toString(),
              title: declaration.title || "",
              date: declaration.date || "",
              image: declaration.image || "",
              audio: declaration.audio || "",
              summary: declaration.summary || "",
              text: declaration.text || "",
              iconType: declaration.icon_type || "robot",
              rank: declaration.rank || 0,
              profile: declaration.profile || "",
              duration: declaration.duration || "",
              views: declaration.views || 0,
              isFeatured: declaration.is_featured || false,
              user: {
                id: declaration.user_id?.toString() || "",
                name: declaration.user?.name || "",
                avatar: declaration.user?.avatar || "",
              },
            }),
          );
          setDeclarationItems(formattedDeclarations);
        }

        if (documentsData.success) {
          // 将文档数据转换为前端需要的格式
          const formattedDocuments = documentsData.data.map((doc: any) => ({
            id: doc.id.toString(),
            title: doc.title || "",
            description: doc.description || "",
            cover: doc.cover || "",
            date: doc.created_at
              ? new Date(doc.created_at).toLocaleDateString("zh-CN")
              : "",
            views: doc.views || 0,
            type: doc.type || "document",
          }));
          setDocumentItems(formattedDocuments);
        }

        // 处理每日宣告（如果存在）
        if (dailyRes.ok) {
          const dailyData = await dailyRes.json();
          if (dailyData.success && dailyData.data) {
            setDailyDeclaration(dailyData.data);
          }
        }
      } catch (error) {
        console.error("加载数据失败:", error);
        setError("加载数据失败，请稍后重试");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // 播放/暂停背景音乐
  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  // 播放高燃宣告音频
  const playDeclarationAudio = (declarationId: string, audioUrl: string) => {
    // 如果当前正在播放这个宣告，则暂停
    if (playingDeclarationId === declarationId) {
      const currentAudio = declarationAudioRefs.current[declarationId];
      if (currentAudio) {
        currentAudio.pause();
        setPlayingDeclarationId(null);
      }
      return;
    }

    // 暂停之前播放的音频
    if (playingDeclarationId) {
      const prevAudio = declarationAudioRefs.current[playingDeclarationId];
      if (prevAudio) {
        prevAudio.pause();
      }
    }

    // 播放新的音频
    const newAudio = declarationAudioRefs.current[declarationId];
    if (newAudio) {
      newAudio.play();
      setPlayingDeclarationId(declarationId);
    }
  };

  // 打开模态框
  const openModal = (type: "abilities" | "activities" | "declarations") => {
    setModalType(type);
    setShowModal(true);
  };

  // 打开文档详情
  const handleDocClick = (doc: any) => {
    setSelectedDoc(doc);
    setIsDocModalOpen(true);
  };

  // 关闭文档详情
  const handleCloseDocModal = () => {
    setIsDocModalOpen(false);
    setSelectedDoc(null);
  };

  // 文档分享
  const handleDocShare = () => {
    if (navigator.share && selectedDoc) {
      navigator
        .share({
          title: selectedDoc.title,
          text: selectedDoc.description,
          url: window.location.href,
        })
        .catch(console.error);
    }
  };

  // 筛选活动
  const filteredActivities = activityItems.filter(
    (activity: any) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 筛选用户
  const filteredUsers = connectionItems.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.need.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 筛选高燃宣告
  const filteredDeclarations = declarationItems.filter(
    (declaration: any) =>
      declaration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      declaration.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 筛选文档
  const filteredDocuments = documentItems.filter(
    (doc: any) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="w-full max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="text-gray-400">加载中...</div>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="w-full max-w-md mx-auto bg-white min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>重新加载</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* 背景音乐 */}
        <audio ref={audioRef} src={audioUrl} loop />

        {/* 顶部横幅 */}
        <div
          className="relative h-[280px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${discoveryBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-between p-5">
            {/* 顶部工具栏 */}
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMusic}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <Music2 className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 标题 */}
            <div className="text-center text-white">
              <h1 className="text-[22px] font-bold mb-2">
                {pageSettings.discovery?.slogan || "发现光亮，点亮事业"}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-sm opacity-80">
                <Users className="w-4 h-4" />
                <span>{connectionItems.length} 位伙伴</span>
                <span>•</span>
                <Flame className="w-4 h-4" />
                <span>{declarationItems.length} 条高燃宣告</span>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="px-5 -mt-6 relative z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索伙伴、活动、高燃宣告、文档..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 技能树（硬核图谱） */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">硬核图谱</h2>
            <button
              onClick={() => router.push("/abilities")}
              className="text-sm text-blue-500 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 技能气泡可视化 */}
          <div className="relative h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden">
            {skillBubbles.map((bubble) => (
              <div
                key={bubble.id}
                onClick={() => setClickedBubbleId(bubble.id)}
                className={`absolute rounded-full flex flex-col items-center justify-center cursor-pointer transition-all ${
                  clickedBubbleId === bubble.id
                    ? "scale-110 shadow-lg"
                    : "hover:scale-110"
                } ${bubble.color} ${bubble.borderColor} border-2 ${bubble.textColor}`}
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="text-[10px] font-bold whitespace-nowrap">
                  {bubble.name}
                </span>
              </div>
            ))}

            {/* 技能描述弹窗 */}
            {clickedBubbleId && skillDescriptions[clickedBubbleId] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">
                <div className="bg-white rounded-lg p-4 shadow-xl max-w-[80%]">
                  <p className="text-sm text-gray-900 font-medium">
                    {skillDescriptions[clickedBubbleId]}
                  </p>
                  <button
                    onClick={() => setClickedBubbleId(null)}
                    className="mt-3 text-sm text-blue-500 hover:text-blue-600"
                  >
                    关闭
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="mt-6 px-5">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => openModal("abilities")}
              className="flex flex-col items-center space-y-2 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all"
            >
              <User className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-gray-700">伙伴</span>
            </button>
            <button
              onClick={() => openModal("activities")}
              className="flex flex-col items-center space-y-2 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all"
            >
              <Flame className="w-8 h-8 text-green-500" />
              <span className="text-xs text-gray-700">活动</span>
            </button>
            <button
              onClick={() => openModal("declarations")}
              className="flex flex-col items-center space-y-2 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-all"
            >
              <Zap className="w-8 h-8 text-orange-500" />
              <span className="text-xs text-gray-700">高燃</span>
            </button>
            <button
              onClick={() => router.push("/documents")}
              className="flex flex-col items-center space-y-2 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all"
            >
              <Folder className="w-8 h-8 text-purple-500" />
              <span className="text-xs text-gray-700">文档</span>
            </button>
          </div>
        </div>

        {/* 伙伴列表 */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">伙伴</h2>
            <button
              onClick={() => openModal("abilities")}
              className="text-sm text-blue-500 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredUsers.slice(0, 5).map((user: any) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      {user.isTrusted && (
                        <span className="text-xs text-blue-500">已认证</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {user.position} • {user.company}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {user.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 活动列表 */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">活动</h2>
            <button
              onClick={() => openModal("activities")}
              className="text-sm text-blue-500 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredActivities.slice(0, 3).map((activity: any) => (
              <Link
                key={activity.id}
                href={`/activity/${activity.id}`}
                className="block bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors"
              >
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <ActivityStatusBadge
                      status={activity.status}
                      endTime={activity.endTime}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.subtitle}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Timer className="w-3 h-3" />
                      <span>{activity.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3" />
                      <span>{activity.enrolledCount}/{activity.maxEnrollments}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 高燃宣告 */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">高燃宣告</h2>
            <button
              onClick={() => openModal("declarations")}
              className="text-sm text-blue-500 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredDeclarations.slice(0, 3).map((declaration: any) => (
              <div
                key={declaration.id}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage
                      src={declaration.image}
                      alt={declaration.title}
                    />
                    <AvatarFallback>
                      {getIcon(declaration.iconType)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {declaration.title}
                      </h3>
                      <button
                        onClick={() =>
                          playDeclarationAudio(declaration.id, declaration.audio)
                        }
                        className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
                      >
                        {playingDeclarationId === declaration.id ? (
                          <PauseCircle className="w-5 h-5" />
                        ) : (
                          <PlayCircle className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {declaration.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3" />
                        <span>{declaration.views} 次播放</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer className="w-3 h-3" />
                        <span>{declaration.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 音频元素 */}
                {declaration.audio && (
                  <audio
                    ref={(el) => {
                      if (el) {
                        declarationAudioRefs.current[declaration.id] = el;
                      }
                    }}
                    src={declaration.audio}
                    onEnded={() => setPlayingDeclarationId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 文档列表 */}
        <div className="mt-6 px-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">文档</h2>
            <button
              onClick={() => router.push("/documents")}
              className="text-sm text-blue-500 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredDocuments.slice(0, 3).map((doc: any) => (
              <div
                key={doc.id}
                onClick={() => handleDocClick(doc)}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  {doc.cover && (
                    <img
                      src={doc.cover}
                      alt={doc.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {doc.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{doc.date}</span>
                      <span>{doc.views} 浏览</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 模态框 */}
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {modalType === "abilities" && "伙伴列表"}
                  {modalType === "activities" && "活动列表"}
                  {modalType === "declarations" && "高燃宣告列表"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {modalType === "abilities" && (
                  <div className="space-y-3">
                    {filteredUsers.map((user: any) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.id}`}
                        onClick={() => setShowModal(false)}
                        className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.name}
                            />
                            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {user.position} • {user.company}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {user.tags.slice(0, 3).map(
                                (tag: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {modalType === "activities" && (
                  <div className="space-y-3">
                    {filteredActivities.map((activity: any) => (
                      <Link
                        key={activity.id}
                        href={`/activity/${activity.id}`}
                        onClick={() => setShowModal(false)}
                        className="block bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">
                              {activity.title}
                            </h3>
                            <ActivityStatusBadge
                              status={activity.status}
                              endTime={activity.endTime}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {activity.subtitle}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Timer className="w-3 h-3" />
                              <span>{activity.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-3 h-3" />
                              <span>
                                {activity.enrolledCount}/{activity.maxEnrollments}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {modalType === "declarations" && (
                  <div className="space-y-3">
                    {filteredDeclarations.map((declaration: any) => (
                      <div
                        key={declaration.id}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage
                              src={declaration.image}
                              alt={declaration.title}
                            />
                            <AvatarFallback>
                              {getIcon(declaration.iconType)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">
                                {declaration.title}
                              </h3>
                              <button
                                onClick={() =>
                                  playDeclarationAudio(
                                    declaration.id,
                                    declaration.audio,
                                  )
                                }
                                className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
                              >
                                {playingDeclarationId === declaration.id ? (
                                  <PauseCircle className="w-5 h-5" />
                                ) : (
                                  <PlayCircle className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {declaration.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-2">
                                <Play className="w-3 h-3" />
                                <span>{declaration.views} 次播放</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Timer className="w-3 h-3" />
                                <span>{declaration.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* 音频元素 */}
                        {declaration.audio && (
                          <audio
                            ref={(el) => {
                              if (el) {
                                declarationAudioRefs.current[declaration.id] =
                                  el;
                              }
                            }}
                            src={declaration.audio}
                            onEnded={() => setPlayingDeclarationId(null)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* 文档详情模态框 */}
        {isDocModalOpen && selectedDoc && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-3 sm:p-4">
            {/* 内容容器 */}
            <div className="relative w-full max-w-[480px] bg-white max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
              {/* 顶部导航 */}
              <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-[rgba(0,0,0,0.05)]">
                <h3 className="text-sm font-semibold text-gray-900">
                  文档详情
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={handleDocShare}
                    className="w-8 h-8 p-0 flex items-center justify-center text-[rgba(0,0,0,0.25)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-shrink-0"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <button
                    onClick={handleCloseDocModal}
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
                    <h3 className="text-[17px] font-semibold text-gray-900 mb-2">
                      文档简介
                    </h3>
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
      <BottomNav />
    </div>
  );
}
