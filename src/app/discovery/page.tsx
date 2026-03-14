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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarDisplay } from "@/components/avatar-upload";
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

// 资源现货（已改为从 API 加载）

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
          if (data.success && data.data) {
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

        // 并行加载用户、活动、资源现货、文档和每日宣告数据
        const [usersRes, activitiesRes, declarationsFeaturedRes, documentsRes, dailyRes] =
          await Promise.all([
            fetch("/api/users", { cache: 'no-store' }),
            fetch("/api/activities?status=published", { cache: 'no-store' }),
            fetch("/api/declarations-featured", { cache: 'no-store' }),
            fetch("/api/documents", { cache: 'no-store' }),
            fetch("/api/daily-declarations", { cache: 'no-store' }),
          ]);

        // 详细的错误诊断日志
        if (!usersRes.ok) {
          const errorText = await usersRes.text();
          console.error('❌ 用户数据加载失败:', {
            status: usersRes.status,
            error: errorText
          });
        }
        if (!activitiesRes.ok) {
          const errorText = await activitiesRes.text();
          console.error('❌ 活动数据加载失败:', {
            status: activitiesRes.status,
            error: errorText
          });
        }
        if (!declarationsFeaturedRes.ok) {
          const errorText = await declarationsFeaturedRes.text();
          console.error('❌ 资源现货数据加载失败:', {
            status: declarationsFeaturedRes.status,
            error: errorText
          });
        }
        if (!documentsRes.ok) {
          const errorText = await documentsRes.text();
          console.error('❌ 文档数据加载失败:', {
            status: documentsRes.status,
            error: errorText
          });
        }

        // 检查是否所有请求都失败
        const allFailed =
          !usersRes.ok &&
          !activitiesRes.ok &&
          !declarationsFeaturedRes.ok &&
          !documentsRes.ok;

        if (allFailed) {
          throw new Error("加载数据失败：所有数据源均不可用");
        }

        // 安全解析JSON，避免解析失败导致页面崩溃
        const usersData = usersRes.ok ? await usersRes.json() : { data: [] };
        const activitiesData = activitiesRes.ok ? await activitiesRes.json() : { data: [] };
        const declarationsFeaturedData = declarationsFeaturedRes.ok ? await declarationsFeaturedRes.json() : { data: [] };
        const documentsData = documentsRes.ok ? await documentsRes.json() : { data: [] };

        if (usersData.success) {
          // 将用户数据转换为前端需要的格式
          const formattedUsers = usersData.data.map((user: any) => ({
            id: user.id.toString(),
            name: user.name || user.nickname,
            age: user.age || 0,
            avatar: user.avatar || "/avatar-default.jpg",
            tags: user.hardcoreTags || user.tags || [], // 优先使用 hardcoreTags
            industry: user.industry || "",
            tagStamp: user.tagStamp || "pureExchange",
            need: user.need || "",
            isTrusted: user.isTrusted || false,
            isFeatured: user.isFeatured || false, // 保留 isFeatured 字段用于排序
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
          // 类型映射
          const typeMap: Record<string, string> = {
            private: '私董会',
            salon: '沙龙',
            ai: 'AI实战',
            workshop: '工作坊',
            visit: '探访',
          };

          // 将活动数据转换为前端需要的格式
          const formattedActivities = activitiesData.data.map(
            (activity: any) => ({
              id: activity.id.toString(),
              category: typeMap[activity.type] || activity.type || "沙龙",
              title: activity.title || "",
              subtitle: "",
              description: activity.description || "",
              // 使用新的图片 API 获取封面图
              image: activity.coverImageKey ? `/api/activities/${activity.id}/image` : (activity.coverImage || ""),
              enrollments: [],
              enrolledCount: activity.registeredCount || 0,
              maxEnrollments: activity.capacity || 0,
              address: activity.location || "",
              teaFee: `${activity.teaFee || 0}元`,
              status:
                activity.status === "published"
                  ? "ongoing"
                  : "ended",
              endTime: activity.endDate || "",
            }),
          );
          setActivityItems(formattedActivities);
        }

        if (declarationsFeaturedData.success) {
          // 类型映射到中文
          const typeLabelMap: Record<string, string> = {
            'ability': '能力现货',
            'connection': '人脉现货',
            'resource': '资源现货',
          };

          // 将资源现货数据转换为前端需要的格式
          const formattedDeclarations = declarationsFeaturedData.data.map(
            (declaration: any, index: number) => ({
              id: declaration.id.toString(),
              rank: index + 1, // 排序号：1, 2, 3...
              icon: declaration.user?.avatar || "/avatar-default.jpg",
              iconType: declaration.type || "resource",
              title: declaration.text || declaration.summary?.substring(0, 30) || "",
              profile: typeLabelMap[declaration.type] || "资源现货", // 中文标签
              duration: "0:00", // 暂时显示为0:00，后续如果添加音频时长可以修改
              userId: declaration.userId,
              userName: declaration.user?.name || declaration.user?.nickname || "",
              userAvatar: declaration.user?.avatar || "/avatar-default.jpg",
              views: declaration.views || 0,
              isFeatured: declaration.isFeatured || false,
            }),
          );
          setDeclarationItems(formattedDeclarations);
        }

        if (documentsData.success) {
          // 将文档数据转换为前端需要的格式
          const formattedDocuments = documentsData.data.map((doc: any) => {
            // 根据 fileType 映射图标
            const iconMap: Record<string, string> = {
              pdf: "book",
              docx: "note",
              doc: "note",
              xlsx: "table",
              xls: "table",
              pptx: "note",
              ppt: "note",
            };

            return {
              id: doc.id,
              type: doc.type || "document",
              title: doc.title || "",
              icon: doc.icon || iconMap[doc.fileType] || "note",
              description: doc.description || "",
              content: doc.content || "",
              cover: doc.cover || "",
              date: doc.createdAt ? doc.createdAt.split('T')[0] : "",
              views: doc.downloadCount || 0,
              status: doc.status || "published",
            };
          });
          setDocumentItems(formattedDocuments);
        }

        // 加载每日宣告数据（获取最新的已发布宣告）
        if (dailyRes.ok) {
          const dailyData = await dailyRes.json();
          if (dailyData.success && dailyData.data && dailyData.data.length > 0) {
            // 过滤出 active 的宣告，如果没有 isActive 字段则使用 isFeatured
            const activeDeclarations = dailyData.data.filter((d: any) =>
              d.isActive !== false && d.isActive !== undefined ? d.isActive : d.isFeatured
            );

            if (activeDeclarations.length > 0) {
              // 按创建时间倒序，取最新的
              const sorted = activeDeclarations.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              const latest = sorted[0];
              setDailyDeclaration({
                image: latest.image,
                date: latest.date || latest.createdAt?.split('T')[0] || '',
                title: latest.title || latest.summary || '',
                duration: latest.duration || '',
                audio: latest.audio || latest.audioUrl || '',
                id: latest.id,
              });
            }
          }
        }
      } catch (err) {
        console.error("加载数据失败:", err);
        setError("加载数据失败，请稍后重试");
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

  const handleDocClick = (doc: any) => {
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
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // 从localStorage读取背景图设置
    try {
      const settings = localStorage.getItem("pageSettings");
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        if (parsedSettings.discovery?.bgImage) {
          setDiscoveryBg(parsedSettings.discovery.bgImage);
        }
      }
    } catch (error) {
      console.error("读取背景图设置失败:", error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen pb-14"
      style={{
        backgroundImage: `url(${discoveryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
                  src={pageSettings.discovery?.logo || "/logo-ranchang.png"}
                  alt="燃场Logo"
                  className="w-[90px] h-[90px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/logo-ranchang.png";
                  }}
                />
                {/* 音乐符号在logo内部 */}
                <Music2
                  className={`absolute w-6 h-6 transition-colors ${
                    isPlaying
                      ? "text-[rgba(0,0,0,0.7)]"
                      : "text-[rgba(0,0,0,0.3)]"
                  }`}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </button>
            </div>

            {/* 搜索框 */}
            <div className="px-5 pb-2 pt-0">
              <div className="relative">
                <Lightbulb className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                <input
                  type="text"
                  placeholder="35岁+ ｜ 有硬核  ｜晒战绩  ｜  交盟友..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-1.5 bg-[rgba(0,0,0,0.05)] text-[15px] text-gray-900 placeholder-[rgba(0,0,0,0.25)] focus:outline-none focus:bg-[rgba(0,0,0,0.08)] transition-colors"
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
                  <div className="text-center py-8 text-gray-400">
                    加载中...
                  </div>
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
                            ? "bg-white hover:bg-[rgba(0,0,0,0.02)] cursor-pointer"
                            : "bg-[rgba(0,0,0,0.02)] cursor-not-allowed opacity-75"
                        }`}
                      >
                        {/* 标签戳 */}
                        {item.tagStamp && (
                          <div
                            className={`absolute top-0 right-0 px-2 py-0.5 text-[12px] font-medium rounded-bl-md z-10 ${
                              item.tagStamp === "personLookingForJob"
                                ? "bg-[rgba(34,197,94,0.15)] text-gray-600 border-l-2 border-t-2 border-gray-400"
                                : "bg-blue-100 text-gray-600 border-l-2 border-t-2 border-gray-400"
                            }`}
                          >
                            {item.tagStamp === "personLookingForJob"
                              ? "人找事"
                              : "事找人"}
                          </div>
                        )}

                        {/* 方形头像 - 纯方形，点击跳转到详情页 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/connection/${item.id}`);
                          }}
                          className="w-14 h-14 flex-shrink-0 mr-4"
                        >
                          <AvatarDisplay avatarKey={item.avatar} name={item.name} size="md" />
                        </button>

                        {/* 中间文字 */}
                        <div className="flex-1 min-w-0">
                          {/* 姓名与年龄 */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[17px] font-semibold text-gray-900 line-clamp-1">
                              {item.name}
                            </span>
                            <span className="text-[17px] text-[rgba(0,0,0,0.25)]">
                              {item.age}岁
                            </span>
                            {/* 绿色行业标签块 */}
                            <span className="inline-block px-1.5 py-0.5 bg-[rgba(34,197,94,0.15)] text-green-600 text-[14px] font-normal line-clamp-1">
                              {item.industry}
                            </span>
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
                  className="flex items-center space-x-1 px-1.5 py-0.75 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[18px] font-normal"
                  onClick={() => {
                    setModalType("abilities");
                    setShowModal(true);
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>更多</span>
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
                  <div className="text-center py-8 text-gray-400">
                    加载中...
                  </div>
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
                              <div className="text-[18px] text-[rgba(0,0,0,0.25)]">
                                {item.category}
                              </div>
                              {/* 状态图标 - 右上角 */}
                              <ActivityStatusBadge
                                status={item.status}
                                endTime={item.endTime}
                              />
                            </div>
                            {/* 活动主题与副标题（黑色字） */}
                            <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-[16px] text-gray-900 mb-2 leading-relaxed truncate">
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
                                <span className="line-clamp-1">
                                  {item.address.substring(0, 6)}
                                </span>
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
                  className="flex items-center space-x-1 px-1.5 py-0.75 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[18px] font-normal"
                  onClick={() => {
                    setModalType("activities");
                    setShowModal(true);
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>更多</span>
                </button>
              </div>
            </section>

            {/* 资源现货 */}
            <section>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold">
                  <span className="text-[rgba(96,165,250,0.6)]">资源</span>
                  <span className="text-blue-400">现货</span>
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
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-normal text-[17px] bg-[rgba(0,0,0,0.25)] text-[rgba(0,0,0,0.25)]">
                      {item.rank}
                    </div>

                    {/* 左侧头像 - 使用AvatarDisplay组件 */}
                    <div className="w-14 h-14 flex-shrink-0 mr-4 overflow-hidden bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                      <AvatarDisplay avatarKey={item.icon} name={item.userName} size="md" />
                    </div>

                    {/* 中间文字 */}
                    <div className="flex-1 min-w-0">
                      {/* 内容片花（黑色字） */}
                      <h3 className="text-[17px] font-semibold text-gray-900 mb-1 truncate">
                        {item.title}
                      </h3>
                      {/* 标签（灰色字）+ 蓝色色块 */}
                      <div>
                        <p className="text-[12px] text-[rgba(0,0,0,0.25)]">
                          {item.profile}
                        </p>
                        {/* 蓝色色块 - 与个人中心一致 */}
                        <div className="mt-1 h-1 w-8 bg-blue-400/40 border border-blue-400" />
                      </div>
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
                  className="flex items-center space-x-1 px-1.5 py-0.75 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[18px] font-normal"
                  onClick={() => {
                    setModalType("declarations");
                    setShowModal(true);
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>更多</span>
                </button>
              </div>
            </section>

            {/* 硬核图谱 */}
            <section className="mt-8">
              <div className="border border-yellow-400 p-4 bg-yellow-50/30">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold">
                    <span className="text-yellow-600">硬核</span>
                    <span className="text-yellow-500">图谱</span>
                  </h2>
                  <span className="text-[10px] text-yellow-500/70">技能气泡</span>
                </div>

                {/* 技能气泡图 */}
                <div className="relative w-full h-64 overflow-hidden">
                  {skillBubbles.map((bubble) => (
                    <div
                      key={bubble.id}
                      onClick={() => {
                        // 点击另一个时取消之前的选中状态
                        setClickedBubbleId(clickedBubbleId === bubble.id ? null : bubble.id);
                      }}
                      className={`absolute rounded-full border ${bubble.borderColor} ${bubble.color} flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                        clickedBubbleId === bubble.id
                          ? 'scale-110 shadow-xl ring-4 ring-yellow-300/50'
                          : ''
                      }`}
                      style={{
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className={`text-center px-1 ${bubble.textColor}`}>
                        <div className={`font-semibold ${bubble.size >= 55 ? 'text-[12px]' : bubble.size >= 40 ? 'text-[10px]' : 'text-[8px]'}`}>
                          {bubble.name}
                        </div>
                        {clickedBubbleId === bubble.id && skillDescriptions[bubble.id] && (
                          <div className={`text-[8px] text-gray-500 mt-0.5 leading-tight`}>
                            {skillDescriptions[bubble.id].split('|')[1]?.trim()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 技能说明 */}
                <div className="text-[11px] text-yellow-600/70 text-center pt-2">
                  💡 35岁+找盟友不看履历，聊硬核能力与战绩
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 每日宣告 - 固定在底部导航栏上方 */}
        {dailyDeclaration && (
          <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-4 bg-white z-40">
            <section>
              <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-center space-x-3">
                  {/* 左侧图标 - 正方形 */}
                  <div className="flex-shrink-0">
                    <img
                      src={dailyDeclaration.image || "/daily-declaration-square.webp"}
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
        )}

        {/* 底部导航 - 固定在底部 */}
        <BottomNav />

        {/* 能力连接权限提示对话框 */}
        <Dialog open={trustDialogOpen} onOpenChange={setTrustDialogOpen}>
          <DialogContent className="w-[95%] max-w-[480px] max-h-[85vh] overflow-y-auto p-5 sm:p-6 flex flex-col items-center justify-center">
            <DialogHeader className="text-center">
              <DialogTitle className="text-base sm:text-lg font-semibold">
                提示
              </DialogTitle>
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
                  {modalType === "abilities" && "更多能力连接"}
                  {modalType === "activities" && "更多活动"}
                  {modalType === "declarations" && "更多资源现货"}
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
                {modalType === "abilities" && (
                  <div>
                    {connectionItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowModal(false);
                          router.push(`/connection/${item.id}`);
                        }}
                        className="relative flex items-start space-x-[8px] py-[11px] border-b border-[rgba(0,0,0,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                      >
                        {/* 角色标签 - 右上角 */}
                        {item.tagStamp && (
                          <div
                            className={`absolute top-[11px] right-0 px-2 py-0.5 text-[12px] font-medium rounded-bl-md z-10 ${
                              item.tagStamp === "personLookingForJob"
                                ? "bg-[rgba(34,197,94,0.15)] text-gray-600 border-l-2 border-t-2 border-gray-400"
                                : item.tagStamp === "jobLookingForPerson"
                                  ? "bg-blue-100 text-gray-600 border-l-2 border-t-2 border-gray-400"
                                  : "bg-[rgba(0,0,0,0.05)] text-gray-600 border-l-2 border-t-2 border-gray-400"
                            }`}
                          >
                            {item.tagStamp === "personLookingForJob"
                              ? "人找事"
                              : item.tagStamp === "jobLookingForPerson"
                                ? "事找人"
                                : "纯交流"}
                          </div>
                        )}

                        {/* 头像 */}
                        <div className="flex-shrink-0 w-[60px] h-[60px]">
                          <AvatarDisplay avatarKey={item.avatar} name={item.name} size="lg" />
                        </div>

                        {/* 内容 */}
                        <div className="flex-1 min-w-0 pr-16">
                          {/* 姓名与年龄 */}
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[17px] font-semibold text-gray-900">
                              {item.name}
                            </span>
                            <span className="text-[17px] text-[rgba(0,0,0,0.25)]">
                              {item.age}岁
                            </span>
                            {item.isTrusted && (
                              <span className="text-[14px] text-green-600">
                                ✓
                              </span>
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

                {modalType === "activities" && (
                  <div>
                    {activityItems.map((item) => (
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
                          <h3 className="text-[16px] text-gray-900 leading-relaxed truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[18px] text-[rgba(0,0,0,0.25)]">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {modalType === "declarations" && (
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
                          <h3 className="text-[16px] text-gray-900 leading-relaxed truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[12px] text-[rgba(0,0,0,0.25)]">
                              {item.profile}
                            </span>
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
                <h3 className="text-sm font-semibold text-gray-900">
                  大鱼的认知库
                </h3>
                <button
                  onClick={() => setShowAssetsModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-[rgba(0,0,0,0.25)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 文档列表 */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
                {documentItems.map((doc) => (
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
    </div>
  );
}
