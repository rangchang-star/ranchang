'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, Upload, Music, Image as ImageIcon, 
  Layout, Save, Play, Palette, Eye, TrendingUp,
  BarChart, PieChart, Radar, LineChart, X, 
  AlertTriangle, Navigation, Type, Flame, User
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// 量表演现形式类型
type AssessmentDisplayStyle = 'bar' | 'radar' | 'progress' | 'cards' | 'line';

interface AssessmentDisplayConfig {
  type: 'bar' | 'radar' | 'progress' | 'cards' | 'line';
  label: string;
  icon: any;
  description: string;
}

// 量表演现形式配置
const assessmentDisplayOptions: AssessmentDisplayConfig[] = [
  {
    type: 'bar',
    label: '柱状图',
    icon: BarChart,
    description: '使用柱状图展示各维度得分，直观对比',
  },
  {
    type: 'radar',
    label: '雷达图',
    icon: Radar,
    description: '使用雷达图展示综合能力模型',
  },
  {
    type: 'progress',
    label: '进度条',
    icon: TrendingUp,
    description: '使用进度条展示各维度完成度',
  },
  {
    type: 'cards',
    label: '卡片式',
    icon: Layout,
    description: '使用卡片布局展示详细数据',
  },
  {
    type: 'line',
    label: '折线图',
    icon: LineChart,
    description: '使用折线图展示历史变化趋势',
  },
];

// 默认设置数据
const defaultSettings = {
  // 底部导航键配置
  navigation: {
    discovery: {
      label: '发现光亮',
      icon: 'flame', // flame图标
    },
    ignition: {
      label: '点亮事业',
      icon: 'trending-up', // trending-up图标
    },
    profile: {
      label: '个人中心',
      icon: 'user', // user图标
    },
  },
  // 页面标题配置
  pageTitles: {
    discovery: '发现光亮',
    activities: '活动列表',
    visit: '探访点亮',
    assets: '能力资产',
    declarations: '资源现货',
    connection: '能力连接',
    consultation: '专家咨询',
    training: '培训赋能',
    subscription: 'AI加油圈',
    notifications: '消息通知',
    settings: '系统设置',
  },
  // 发现键设置
  discovery: {
    slogan: '发现光亮，点亮事业',
    logo: '/logo-ranchang.png',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundImage: '/discovery-bg.jpg',
  },
  // 点亮键设置
  ignition: {
    visitSlogan: '每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....',
    visitMedia: {
      type: 'image' as 'image' | 'video' | null,
      url: '',
    },
    aiCircleSlogan: 'AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产',
    aiCircleMedia: {
      type: 'image' as 'image' | 'video' | null,
      url: '',
    },
  },
  // 个人键量表设置
  profile: {
    businessCognition: {
      displayStyle: 'radar' as AssessmentDisplayStyle,
    },
    aiCognition: {
      displayStyle: 'radar' as AssessmentDisplayStyle,
    },
    careerMission: {
      displayStyle: 'cards' as AssessmentDisplayStyle,
    },
    entrepreneurialPsychology: {
      displayStyle: 'progress' as AssessmentDisplayStyle,
    },
  },
  // 联系信息配置
  contactInfo: {
    message: '此功能暂时关闭，需要对接人与资源联系"燃场app"工作人员。',
    contact: 'v:13023699913',
  },
};

// 获取页面标题的中文标签
const getPageTitleLabel = (key: string): string => {
  const labels: Record<string, string> = {
    discovery: '发现键页面',
    activities: '活动列表页',
    visit: '探访点亮页',
    assets: '能力资产页',
    declarations: '资源现货页',
    connection: '能力连接页',
    consultation: '专家咨询页',
    training: '培训赋能页',
    subscription: 'AI加油圈页',
    notifications: '消息通知页',
    settings: '系统设置页',
  };
  return labels[key] || key;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('discovery');
  const [saving, setSaving] = useState(false);
  const [previewMusic, setPreviewMusic] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBackground, setPreviewBackground] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [previewVisitMedia, setPreviewVisitMedia] = useState<string | null>(null);
  const [previewAiCircleMedia, setPreviewAiCircleMedia] = useState<string | null>(null);
  const [playingVisitVideo, setPlayingVisitVideo] = useState(false);
  const [playingAiCircleVideo, setPlayingAiCircleVideo] = useState(false);
  const visitVideoRef = useRef<HTMLVideoElement>(null);
  const aiCircleVideoRef = useRef<HTMLVideoElement>(null);

  // 加载设置
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings');

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          setSettings(data.data);
          // 设置预览
          if (data.data.discovery?.logo) {
            setPreviewLogo(data.data.discovery.logo);
          }
          if (data.data.discovery?.backgroundImage) {
            setPreviewBackground(data.data.discovery.backgroundImage);
          }
          if (data.data.ignition?.visitMedia?.url) {
            setPreviewVisitMedia(data.data.ignition.visitMedia.url);
          }
          if (data.data.ignition?.aiCircleMedia?.url) {
            setPreviewAiCircleMedia(data.data.ignition.aiCircleMedia.url);
          }
        }
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    }

    loadSettings();
  }, []);

  // 保存设置 - 第一次确认
  const handleSave = () => {
    if (!hasChanged) {
      alert('没有修改需要保存');
      return;
    }
    setShowConfirmDialog(true);
  };

  // 二次确认保存
  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    setSaving(true);

    try {
      // 调用API保存设置
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: settings }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存设置失败');
      }

      const data = await response.json();

      // 保存成功提示
      alert('设置保存成功！');
      setSaving(false);
      setHasChanged(false);
    } catch (error: any) {
      console.error('保存设置失败:', error);
      alert(`保存失败：${error.message}`);
      setSaving(false);
    }
  };

  // Logo上传处理
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 模拟上传，实际项目中需要上传到服务器
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewLogo(result);
        setSettings(prev => ({
          ...prev,
          discovery: {
            ...prev.discovery,
            logo: result,
          },
        }));
        setHasChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 音乐上传处理
  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 模拟上传，实际项目中需要上传到服务器
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSettings(prev => ({
          ...prev,
          discovery: {
            ...prev.discovery,
            music: result,
          },
        }));
        setHasChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 背景图上传处理
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 模拟上传，实际项目中需要上传到服务器
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewBackground(result);
        setSettings(prev => ({
          ...prev,
          discovery: {
            ...prev.discovery,
            backgroundImage: result,
          },
        }));
        setHasChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 音乐预览
  const toggleMusicPreview = () => {
    setPreviewMusic(!previewMusic);
  };

  // 探访点亮媒体上传
  const handleVisitMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 视频大小限制 150MB
    if (file.type.startsWith('video/') && file.size > 150 * 1024 * 1024) {
      alert('视频大小不能超过 150MB');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewVisitMedia(result);
      setSettings(prev => ({
        ...prev,
        ignition: {
          ...prev.ignition,
          visitMedia: {
            type: isVideo ? 'video' : 'image',
            url: result,
          },
        },
      }));
      setHasChanged(true);
    };
    reader.readAsDataURL(file);
  };

  // AI加油圈媒体上传
  const handleAiCircleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 视频大小限制 150MB
    if (file.type.startsWith('video/') && file.size > 150 * 1024 * 1024) {
      alert('视频大小不能超过 150MB');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewAiCircleMedia(result);
      setSettings(prev => ({
        ...prev,
        ignition: {
          ...prev.ignition,
          aiCircleMedia: {
            type: isVideo ? 'video' : 'image',
            url: result,
          },
        },
      }));
      setHasChanged(true);
    };
    reader.readAsDataURL(file);
  };

  // 切换探访点亮视频播放
  const toggleVisitVideo = () => {
    if (playingVisitVideo) {
      visitVideoRef.current?.pause();
      setPlayingVisitVideo(false);
    } else {
      visitVideoRef.current?.play();
      setPlayingVisitVideo(true);
    }
  };

  // 切换AI加油圈视频播放
  const toggleAiCircleVideo = () => {
    if (playingAiCircleVideo) {
      aiCircleVideoRef.current?.pause();
      setPlayingAiCircleVideo(false);
    } else {
      aiCircleVideoRef.current?.play();
      setPlayingAiCircleVideo(true);
    }
  };

  // 量表演现形式更改
  const handleAssessmentDisplayChange = (
    assessmentKey: keyof typeof settings.profile,
    displayStyle: AssessmentDisplayStyle
  ) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [assessmentKey]: {
          ...prev.profile[assessmentKey],
          displayStyle,
        },
      },
    }));
    setHasChanged(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 mb-1">页面设置</h1>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">配置各功能页面的展示内容和样式</p>
          </div>
          <Button
            className="bg-blue-400 hover:bg-blue-500 text-white text-[13px]"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium text-[rgba(0,0,0,0.5)] mb-2 uppercase tracking-wider">全局配置</p>
              <TabsList className="bg-[rgba(0,0,0,0.05)] p-1 w-full">
                <TabsTrigger value="navigation" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 flex-1">
                  <Navigation className="w-3 h-3 mr-1" />
                  导航键
                </TabsTrigger>
                <TabsTrigger value="pageTitles" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 flex-1">
                  <Type className="w-3 h-3 mr-1" />
                  页面标题
                </TabsTrigger>
              </TabsList>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[rgba(0,0,0,0.5)] mb-2 uppercase tracking-wider">功能模块</p>
              <TabsList className="bg-[rgba(0,0,0,0.05)] p-1 w-full">
                <TabsTrigger value="discovery" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 flex-1">
                  <Flame className="w-3 h-3 mr-1" />
                  发现键
                </TabsTrigger>
                <TabsTrigger value="ignition" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 flex-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  点亮键
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 flex-1">
                  <User className="w-3 h-3 mr-1" />
                  个人键
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* 导航键设置 */}
          <TabsContent value="navigation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">底部导航键配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置首页底部三个导航键的显示内容
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 发现光亮键 */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    <span className="flex items-center space-x-2">
                      <Flame className="w-4 h-4" />
                      <span>发现光亮键</span>
                    </span>
                  </label>
                  <Input
                    value={settings.navigation.discovery.label}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        navigation: {
                          ...prev.navigation,
                          discovery: {
                            ...prev.navigation.discovery,
                            label: e.target.value,
                          },
                        },
                      }));
                      setHasChanged(true);
                    }}
                    placeholder="请输入导航键名称"
                    className="text-[13px]"
                    maxLength={10}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      第一个导航键，显示火焰图标
                    </span>
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      {settings.navigation.discovery.label.length}/10
                    </span>
                  </div>
                </div>

                {/* 点亮事业键 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    <span className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>点亮事业键</span>
                    </span>
                  </label>
                  <Input
                    value={settings.navigation.ignition.label}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        navigation: {
                          ...prev.navigation,
                          ignition: {
                            ...prev.navigation.ignition,
                            label: e.target.value,
                          },
                        },
                      }));
                      setHasChanged(true);
                    }}
                    placeholder="请输入导航键名称"
                    className="text-[13px]"
                    maxLength={10}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      第二个导航键，显示趋势图标
                    </span>
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      {settings.navigation.ignition.label.length}/10
                    </span>
                  </div>
                </div>

                {/* 个人中心键 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    <span className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>个人中心键</span>
                    </span>
                  </label>
                  <Input
                    value={settings.navigation.profile.label}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        navigation: {
                          ...prev.navigation,
                          profile: {
                            ...prev.navigation.profile,
                            label: e.target.value,
                          },
                        },
                      }));
                      setHasChanged(true);
                    }}
                    placeholder="请输入导航键名称"
                    className="text-[13px]"
                    maxLength={10}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      第三个导航键，显示用户图标
                    </span>
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      {settings.navigation.profile.label.length}/10
                    </span>
                  </div>
                </div>

                {/* 预览区域 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <p className="text-[12px] font-medium text-gray-900 mb-3">效果预览</p>
                  <div className="flex items-center justify-center space-x-6 p-4 bg-[rgba(0,0,0,0.02)] rounded-lg">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 bg-[rgba(59,130,246,0.1)] rounded-full flex items-center justify-center">
                        <Flame className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-gray-600">{settings.navigation.discovery.label}</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 bg-[rgba(59,130,246,0.1)] rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-gray-600">{settings.navigation.ignition.label}</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 bg-[rgba(59,130,246,0.1)] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-gray-600">{settings.navigation.profile.label}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">联系信息配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置会员发起连接时的联系提示信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    提示信息
                  </label>
                  <Textarea
                    value={settings.contactInfo.message}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          message: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入提示信息"
                    className="min-h-[100px] text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户点击"发起连接"时显示的提示文本
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    联系方式
                  </label>
                  <Input
                    value={settings.contactInfo.contact}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          contact: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入联系方式"
                    className="text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户需要联系时的具体联系方式
                  </p>
                </div>

                {/* 预览 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-[12px] font-medium text-gray-900">效果预览</p>
                  </div>
                  <div className="p-4 bg-[rgba(0,0,0,0.02)] rounded-lg">
                    <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-2">
                      {settings.contactInfo.message || '暂未设置'}
                    </p>
                    <p className="text-[13px] text-blue-600">
                      {settings.contactInfo.contact || '暂未设置'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 页面标题设置 */}
          <TabsContent value="pageTitles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">页面标题配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置各主页面左上角的大号文字
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.pageTitles).map(([key, title]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-[13px] font-medium text-gray-900">
                      {getPageTitleLabel(key)}
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          pageTitles: {
                            ...prev.pageTitles,
                            [key]: e.target.value,
                          },
                        }));
                        setHasChanged(true);
                      }}
                      placeholder="请输入页面标题"
                      className="text-[13px]"
                      maxLength={20}
                    />
                    <div className="flex justify-between">
                      <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                        路径: /{key}
                      </span>
                      <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                        {title.length}/20
                      </span>
                    </div>
                  </div>
                ))}

                {/* 预览区域 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <p className="text-[12px] font-medium text-gray-900 mb-3">效果预览</p>
                  <div className="space-y-3 p-4 bg-[rgba(0,0,0,0.02)] rounded-lg">
                    {Object.entries(settings.pageTitles).slice(0, 5).map(([key, title]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <Type className="w-4 h-4 text-[rgba(0,0,0,0.4)]" />
                        <span className="text-[15px] font-semibold text-gray-900">{title}</span>
                      </div>
                    ))}
                    {Object.keys(settings.pageTitles).length > 5 && (
                      <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                        ... 还有 {Object.keys(settings.pageTitles).length - 5} 个页面
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">联系信息配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置会员发起连接时的联系提示信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    提示信息
                  </label>
                  <Textarea
                    value={settings.contactInfo.message}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          message: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入提示信息"
                    className="min-h-[100px] text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户点击"发起连接"时显示的提示文本
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    联系方式
                  </label>
                  <Input
                    value={settings.contactInfo.contact}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          contact: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入联系方式"
                    className="text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户需要联系时的具体联系方式
                  </p>
                </div>

                {/* 预览 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-[12px] font-medium text-gray-900">效果预览</p>
                  </div>
                  <div className="p-4 bg-[rgba(0,0,0,0.02)] rounded-lg">
                    <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-2">
                      {settings.contactInfo.message || '暂未设置'}
                    </p>
                    <p className="text-[13px] text-blue-600">
                      {settings.contactInfo.contact || '暂未设置'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 发现键设置 */}
          <TabsContent value="discovery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">发现键内页配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置发现键页面的展示内容和样式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 页面基础信息 */}
                <div>
                  <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[rgba(0,0,0,0.08)]">
                    <Type className="w-4 h-4 text-blue-600" />
                    <h3 className="text-[13px] font-semibold text-gray-900">页面基础信息</h3>
                  </div>
                  <div className="space-y-4">
                    {/* Slogan编辑 */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        页面 Slogan
                      </label>
                      <Input
                        value={settings.discovery.slogan}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            discovery: {
                              ...prev.discovery,
                              slogan: e.target.value,
                            },
                          }));
                          setHasChanged(true);
                        }}
                        placeholder="请输入页面 Slogan"
                        className="text-[13px]"
                        maxLength={50}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          显示在发现键页面顶部的标语
                        </span>
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          {settings.discovery.slogan.length}/50
                        </span>
                      </div>
                    </div>

                    {/* Logo上传 */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        右侧 Logo
                      </label>
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-[rgba(0,0,0,0.02)] border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center overflow-hidden">
                          {previewLogo || settings.discovery.logo ? (
                            <img
                              src={previewLogo || settings.discovery.logo}
                              alt="Logo预览"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-[rgba(0,0,0,0.3)]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label htmlFor="logo-upload">
                            <Button
                              variant="outline"
                              className="text-[12px]"
                              asChild
                            >
                              <span>
                                <Upload className="w-3 h-3 mr-1" />
                                上传Logo
                              </span>
                            </Button>
                          </label>
                          <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">
                            支持 PNG、JPG、GIF 格式，建议尺寸 200x200px
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 视觉元素 */}
                <div>
                  <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[rgba(0,0,0,0.08)]">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <h3 className="text-[13px] font-semibold text-gray-900">视觉元素</h3>
                  </div>
                  <div className="space-y-4">
                    {/* 背景图上传 */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        背景图片
                      </label>
                      <div className="space-y-3">
                        <div className="w-full h-48 bg-[rgba(0,0,0,0.02)] border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden relative">
                          {previewBackground || settings.discovery.backgroundImage ? (
                            <img
                              src={previewBackground || settings.discovery.backgroundImage}
                              alt="背景图预览"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-[rgba(0,0,0,0.3)]" />
                              <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">未上传背景图</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[11px] text-[rgba(0,0,0,0.6)]">
                              建议尺寸：1920x1080px，支持 JPG、PNG 格式
                            </p>
                            <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                              背景图将显示在发现页的背景区域
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {(previewBackground || settings.discovery.backgroundImage) && (
                              <a
                                href="/discovery"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-blue-600 hover:text-blue-700 font-medium"
                              >
                                预览效果
                              </a>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBackgroundUpload}
                              className="hidden"
                              id="background-upload"
                            />
                            <label htmlFor="background-upload">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[12px]"
                                asChild
                              >
                                <span>
                                  <Upload className="w-3 h-3 mr-1" />
                                  更换背景
                                </span>
                              </Button>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 交互元素 */}
                <div>
                  <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[rgba(0,0,0,0.08)]">
                    <Music className="w-4 h-4 text-blue-600" />
                    <h3 className="text-[13px] font-semibold text-gray-900">交互元素</h3>
                  </div>
                  <div className="space-y-4">
                    {/* 音乐上传 */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        背景音乐
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Music className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-gray-900 truncate">
                                {settings.discovery.music ? '背景音乐' : '未上传音乐'}
                              </p>
                              <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                                {settings.discovery.music ? '已上传' : '支持 MP3 格式'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {settings.discovery.music && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMusicPreview}
                                className="text-[12px]"
                              >
                                {previewMusic ? (
                                  <>
                                    <X className="w-3 h-3 mr-1" />
                                    停止
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 mr-1" />
                                    预览
                                  </>
                                )}
                              </Button>
                            )}
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={handleMusicUpload}
                              className="hidden"
                              id="music-upload"
                            />
                            <label htmlFor="music-upload">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[12px]"
                                asChild
                              >
                                <span>
                                  <Upload className="w-3 h-3 mr-1" />
                                  更换
                                </span>
                              </Button>
                            </label>
                          </div>
                        </div>
                        {/* 音乐预览播放器 */}
                        {previewMusic && settings.discovery.music && (
                          <audio
                            src={settings.discovery.music}
                            autoPlay
                            onEnded={() => setPreviewMusic(false)}
                            className="w-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">联系信息配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置会员发起连接时的联系提示信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    提示信息
                  </label>
                  <Textarea
                    value={settings.contactInfo.message}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          message: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入提示信息"
                    className="min-h-[100px] text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户点击"发起连接"时显示的提示文本
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    联系方式
                  </label>
                  <Input
                    value={settings.contactInfo.contact}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          contact: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入联系方式"
                    className="text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户需要联系时的具体联系方式
                  </p>
                </div>

                {/* 预览 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-[12px] font-medium text-gray-900">效果预览</p>
                  </div>
                  <div className="p-4 bg-[rgba(0,0,0,0.02)] rounded-lg">
                    <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-2">
                      {settings.contactInfo.message || '暂未设置'}
                    </p>
                    <p className="text-[13px] text-blue-600">
                      {settings.contactInfo.contact || '暂未设置'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 点亮键设置 */}
          <TabsContent value="ignition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">点亮键内页配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置点亮键页面的展示内容
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 探访点亮配置 */}
                <div>
                  <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[rgba(0,0,0,0.08)]">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h3 className="text-[13px] font-semibold text-gray-900">探访点亮</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* 探访点亮Slogan */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        Slogan（灰色文字）
                      </label>
                      <Textarea
                        value={settings.ignition.visitSlogan}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            ignition: {
                              ...prev.ignition,
                              visitSlogan: e.target.value,
                            },
                          }));
                          setHasChanged(true);
                        }}
                        placeholder="请输入探访点亮页面的标语"
                        className="text-[13px] min-h-[80px]"
                        maxLength={100}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          显示在探访点亮页面，使用灰色文字
                        </span>
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          {settings.ignition.visitSlogan.length}/100
                        </span>
                      </div>
                    </div>

                    {/* 探访点亮媒体上传 */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        配图/视频
                      </label>
                      <div className="space-y-3">
                        <div className="w-full h-48 bg-[rgba(0,0,0,0.02)] border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden relative">
                          {previewVisitMedia || settings.ignition.visitMedia.url ? (
                            <>
                              {settings.ignition.visitMedia.type === 'video' ? (
                                <div className="w-full h-full relative">
                                  <video
                                    ref={visitVideoRef}
                                    src={previewVisitMedia || settings.ignition.visitMedia.url}
                                    className="w-full h-full object-cover"
                                    onClick={toggleVisitVideo}
                                  />
                                  <button
                                    onClick={toggleVisitVideo}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                                      {playingVisitVideo ? (
                                        <X className="w-6 h-6 text-white" />
                                      ) : (
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                      )}
                                    </div>
                                  </button>
                                </div>
                              ) : (
                                <img
                                  src={previewVisitMedia || settings.ignition.visitMedia.url}
                                  alt="探访点亮配图"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-[rgba(0,0,0,0.3)]" />
                              <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">未上传图片或视频</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[11px] text-[rgba(0,0,0,0.6)]">
                              支持 JPG、PNG、MP4 格式，视频最大 150MB
                            </p>
                            <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                              图片和视频只能上传一个，以最新上传的为准
                            </p>
                          </div>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleVisitMediaUpload}
                            className="hidden"
                            id="visit-media-upload"
                          />
                          <label htmlFor="visit-media-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[12px]"
                              asChild
                            >
                              <span>
                                <Upload className="w-3 h-3 mr-1" />
                                上传
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI加油圈配置 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[rgba(0,0,0,0.08)]">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h3 className="text-[13px] font-semibold text-gray-900">AI加油圈</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* AI加油圈Slogan */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        Slogan（灰色文字）
                      </label>
                      <Textarea
                        value={settings.ignition.aiCircleSlogan}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            ignition: {
                              ...prev.ignition,
                              aiCircleSlogan: e.target.value,
                            },
                          }));
                          setHasChanged(true);
                        }}
                        placeholder="请输入AI加油圈页面的标语"
                        className="text-[13px] min-h-[80px]"
                        maxLength={100}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          显示在AI加油圈页面，使用灰色文字
                        </span>
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          {settings.ignition.aiCircleSlogan.length}/100
                        </span>
                      </div>
                    </div>

                    {/* AI加油圈媒体上传 */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-900 mb-2">
                        配图/视频
                      </label>
                      <div className="space-y-3">
                        <div className="w-full h-48 bg-[rgba(0,0,0,0.02)] border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden relative">
                          {previewAiCircleMedia || settings.ignition.aiCircleMedia.url ? (
                            <>
                              {settings.ignition.aiCircleMedia.type === 'video' ? (
                                <div className="w-full h-full relative">
                                  <video
                                    ref={aiCircleVideoRef}
                                    src={previewAiCircleMedia || settings.ignition.aiCircleMedia.url}
                                    className="w-full h-full object-cover"
                                    onClick={toggleAiCircleVideo}
                                  />
                                  <button
                                    onClick={toggleAiCircleVideo}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                                      {playingAiCircleVideo ? (
                                        <X className="w-6 h-6 text-white" />
                                      ) : (
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                      )}
                                    </div>
                                  </button>
                                </div>
                              ) : (
                                <img
                                  src={previewAiCircleMedia || settings.ignition.aiCircleMedia.url}
                                  alt="AI加油圈配图"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-[rgba(0,0,0,0.3)]" />
                              <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">未上传图片或视频</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[11px] text-[rgba(0,0,0,0.6)]">
                              支持 JPG、PNG、MP4 格式，视频最大 150MB
                            </p>
                            <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                              图片和视频只能上传一个，以最新上传的为准
                            </p>
                          </div>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleAiCircleMediaUpload}
                            className="hidden"
                            id="aicircle-media-upload"
                          />
                          <label htmlFor="aicircle-media-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[12px]"
                              asChild
                            >
                              <span>
                                <Upload className="w-3 h-3 mr-1" />
                                上传
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 预览区域 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-[12px] font-medium text-gray-900">效果预览</p>
                  </div>
                  <div className="p-4 bg-[rgba(0,0,0,0.02)] rounded-lg space-y-3">
                    <div>
                      <p className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1">探访点亮 Slogan：</p>
                      <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
                        {settings.ignition.visitSlogan || '暂未设置'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1">AI加油圈 Slogan：</p>
                      <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
                        {settings.ignition.aiCircleSlogan || '暂未设置'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">联系信息配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置会员发起连接时的联系提示信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    提示信息
                  </label>
                  <Textarea
                    value={settings.contactInfo.message}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          message: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入提示信息"
                    className="min-h-[100px] text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户点击"发起连接"时显示的提示文本
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    联系方式
                  </label>
                  <Input
                    value={settings.contactInfo.contact}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          contact: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入联系方式"
                    className="text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户需要联系时的具体联系方式
                  </p>
                </div>

                {/* 预览 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-[12px] font-medium text-gray-900">效果预览</p>
                  </div>
                  <div className="p-4 bg-[rgba(0,0,0,0.02)] rounded-lg">
                    <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-2">
                      {settings.contactInfo.message || '暂未设置'}
                    </p>
                    <p className="text-[13px] text-blue-600">
                      {settings.contactInfo.contact || '暂未设置'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 个人键设置 */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">个人键量表展现形式</CardTitle>
                <CardDescription className="text-[12px]">
                  配置各量表的视觉展示形式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 商业认知量表 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[13px] font-medium text-gray-900">
                      商业认知量表
                    </label>
                    <Badge className="bg-blue-50 text-blue-600 text-[11px]">
                      {assessmentDisplayOptions.find(opt => opt.type === settings.profile.businessCognition.displayStyle)?.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {assessmentDisplayOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = settings.profile.businessCognition.displayStyle === option.type;
                      return (
                        <button
                          key={option.type}
                          onClick={() => handleAssessmentDisplayChange('businessCognition', option.type)}
                          className={`p-3 border rounded-lg transition-all ${
                            isActive
                              ? 'border-blue-400 bg-blue-50 text-blue-600'
                              : 'border-[rgba(0,0,0,0.1)] hover:border-blue-400 text-[rgba(0,0,0,0.6)]'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <p className="text-[11px] text-center">{option.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">
                    {assessmentDisplayOptions.find(opt => opt.type === settings.profile.businessCognition.displayStyle)?.description}
                  </p>
                </div>

                {/* AI认知量表 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[13px] font-medium text-gray-900">
                      AI认知量表
                    </label>
                    <Badge className="bg-blue-50 text-blue-600 text-[11px]">
                      {assessmentDisplayOptions.find(opt => opt.type === settings.profile.aiCognition.displayStyle)?.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {assessmentDisplayOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = settings.profile.aiCognition.displayStyle === option.type;
                      return (
                        <button
                          key={option.type}
                          onClick={() => handleAssessmentDisplayChange('aiCognition', option.type)}
                          className={`p-3 border rounded-lg transition-all ${
                            isActive
                              ? 'border-blue-400 bg-blue-50 text-blue-600'
                              : 'border-[rgba(0,0,0,0.1)] hover:border-blue-400 text-[rgba(0,0,0,0.6)]'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <p className="text-[11px] text-center">{option.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">
                    {assessmentDisplayOptions.find(opt => opt.type === settings.profile.aiCognition.displayStyle)?.description}
                  </p>
                </div>

                {/* 职业使命量表 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[13px] font-medium text-gray-900">
                      职业使命量表
                    </label>
                    <Badge className="bg-blue-50 text-blue-600 text-[11px]">
                      {assessmentDisplayOptions.find(opt => opt.type === settings.profile.careerMission.displayStyle)?.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {assessmentDisplayOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = settings.profile.careerMission.displayStyle === option.type;
                      return (
                        <button
                          key={option.type}
                          onClick={() => handleAssessmentDisplayChange('careerMission', option.type)}
                          className={`p-3 border rounded-lg transition-all ${
                            isActive
                              ? 'border-blue-400 bg-blue-50 text-blue-600'
                              : 'border-[rgba(0,0,0,0.1)] hover:border-blue-400 text-[rgba(0,0,0,0.6)]'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <p className="text-[11px] text-center">{option.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">
                    {assessmentDisplayOptions.find(opt => opt.type === settings.profile.careerMission.displayStyle)?.description}
                  </p>
                </div>

                {/* 创业心理量表 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[13px] font-medium text-gray-900">
                      创业心理量表
                    </label>
                    <Badge className="bg-blue-50 text-blue-600 text-[11px]">
                      {assessmentDisplayOptions.find(opt => opt.type === settings.profile.entrepreneurialPsychology.displayStyle)?.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {assessmentDisplayOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = settings.profile.entrepreneurialPsychology.displayStyle === option.type;
                      return (
                        <button
                          key={option.type}
                          onClick={() => handleAssessmentDisplayChange('entrepreneurialPsychology', option.type)}
                          className={`p-3 border rounded-lg transition-all ${
                            isActive
                              ? 'border-blue-400 bg-blue-50 text-blue-600'
                              : 'border-[rgba(0,0,0,0.1)] hover:border-blue-400 text-[rgba(0,0,0,0.6)]'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <p className="text-[11px] text-center">{option.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">
                    {assessmentDisplayOptions.find(opt => opt.type === settings.profile.entrepreneurialPsychology.displayStyle)?.description}
                  </p>
                </div>

                {/* 预览说明 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[12px] font-medium text-blue-900 mb-1">展现形式说明</p>
                      <ul className="text-[11px] text-blue-800 space-y-1">
                        <li>• 柱状图：适合对比各维度得分，清晰直观</li>
                        <li>• 雷达图：适合展示综合能力模型，视觉效果好</li>
                        <li>• 进度条：适合展示各维度完成度，简洁明了</li>
                        <li>• 卡片式：适合展示详细数据，信息丰富</li>
                        <li>• 折线图：适合展示历史变化趋势，追踪发展</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">联系信息配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置会员发起连接时的联系提示信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    提示信息
                  </label>
                  <Textarea
                    value={settings.contactInfo.message}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          message: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入提示信息"
                    className="min-h-[100px] text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户点击"发起连接"时显示的提示文本
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    联系方式
                  </label>
                  <Input
                    value={settings.contactInfo.contact}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        contactInfo: {
                          ...settings.contactInfo,
                          contact: e.target.value
                        }
                      });
                      setHasChanged(true);
                    }}
                    placeholder="请输入联系方式"
                    className="text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    用户需要联系时的具体联系方式
                  </p>
                </div>

                {/* 预览 */}
                <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-[12px] font-medium text-gray-900">效果预览</p>
                  </div>
                  <div className="p-4 bg-[rgba(0,0,0,0.02)] rounded-lg">
                    <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-2">
                      {settings.contactInfo.message || '暂未设置'}
                    </p>
                    <p className="text-[13px] text-blue-600">
                      {settings.contactInfo.contact || '暂未设置'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 二次确认对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-[95%] max-w-[400px]">
          <VisuallyHidden>
            <DialogTitle>确认保存</DialogTitle>
          </VisuallyHidden>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 pb-4 border-b border-[rgba(0,0,0,0.1)]">
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900">确认修改</h3>
                <p className="text-[12px] text-[rgba(0,0,0,0.3)]">
                  此操作将修改页面配置
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[13px] text-[rgba(0,0,0,0.3)] text-center">
                您确定要保存这些修改吗？
              </p>
              <p className="text-[11px] text-[rgba(0,0,0,0.3)] text-center">
                修改将立即生效，影响页面显示
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(0,0,0,0.1)]">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="border-[rgba(0,0,0,0.1)] text-[13px]"
              >
                取消
              </Button>
              <Button
                className="bg-blue-400 hover:bg-blue-500 text-white text-[13px]"
                onClick={handleConfirmSave}
              >
                确认保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
