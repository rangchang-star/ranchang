"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Play,
  PlayCircle,
  TrendingUp,
  Heart,
  Mic,
  Users,
  X,
  PauseCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// 商业咨询行业标签
const industryTypes = [
  '企业转型',
  '战略规划',
  '组织优化',
  '市场拓展',
  '产品创新',
  '资本运作',
];

// 默认媒体配置（实际应从后台API获取）
const defaultMediaConfig = {
  visit: {
    type: 'image' as 'image' | 'video' | null,
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=340&fit=crop',
  },
  aiCircle: {
    type: 'image' as 'image' | 'video' | null,
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=340&fit=crop',
  },
};

// 沙龙内容
const salon = {
  id: '1',
  period: '2026年度AI 圈',
  introduction: '定期相聚深度沟通，各行伙伴共同探讨AI时代的商业机会与最新热点方向，组织小组协作，人人产出高价值的数字资产。',
  duration: '一年',
  limit: '限15人',
  digitalAssets: [
    {
      id: '1',
      title: 'AI营销策略白皮书',
      description: '基于小组讨论产出，涵盖5个行业的AI营销实战案例',
      type: '文档',
      size: '2.3MB',
      createTime: '2024年3月1日',
      likes: 45,
      cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop',
    },
    {
      id: '2',
      title: '数字化转型项目清单',
      description: '15个中小企业数字化转型实用工具和模板',
      type: '表格',
      size: '1.8MB',
      createTime: '2024年3月8日',
      likes: 67,
      cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&h=120&fit=crop',
    },
    {
      id: '3',
      title: 'AI工具使用手册',
      description: 'ChatGPT、Midjourney等主流AI工具的使用技巧',
      type: '文档',
      size: '3.5MB',
      createTime: '2024年3月15日',
      likes: 89,
      cover: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&h=120&fit=crop',
    },
  ],
};

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState<'training' | 'consultation'>('training');

  // Tab描述文字（从后台API加载）
  const [tabDescriptions, setTabDescriptions] = useState({
    training: '每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....',
    consultation: 'AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产',
  });

  // 媒体配置（从后台API加载）
  const [mediaConfig, setMediaConfig] = useState({
    visit: defaultMediaConfig.visit,
    aiCircle: defaultMediaConfig.aiCircle,
  });

  // 从API加载页面设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.ignition) {
            setTabDescriptions({
              training: data.data.ignition.visitSlogan,
              consultation: data.data.ignition.aiCircleSlogan,
            });
            setMediaConfig({
              visit: data.data.ignition.visitMedia || defaultMediaConfig.visit,
              aiCircle: data.data.ignition.aiCircleMedia || defaultMediaConfig.aiCircle,
            });
          }
        }
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    };

    loadSettings();
  }, []);

  // 视频播放控制状态
  const [playingVisitVideo, setPlayingVisitVideo] = useState(false);
  const [playingAiCircleVideo, setPlayingAiCircleVideo] = useState(false);

  // 视频refs
  const visitVideoRef = useRef<HTMLVideoElement>(null);
  const aiCircleVideoRef = useRef<HTMLVideoElement>(null);

  // 探访数据加载
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [visitsError, setVisitsError] = useState<string | null>(null);
  const [visitsExpanded, setVisitsExpanded] = useState(false);

  // 从 API 加载探访数据
  useEffect(() => {
    async function loadVisits() {
      try {
        setIsLoadingVisits(true);
        setVisitsError(null);

        const response = await fetch('/api/visits');

        if (!response.ok) {
          throw new Error('加载探访信息失败');
        }

        const data = await response.json();

        if (data.success) {
          // 将 API 数据转换为前端需要的格式
          const formattedVisits = data.data.map((visit: any) => ({
            id: visit.id.toString(),
            title: visit.title || '',
            industry: visit.industry || '',
            duration: visit.duration || '',
            date: visit.date || '',
            visitors: visit.visitors || [],
            record: visit.record || '',
            status: visit.status || [],
            tags: visit.tags || [],
            audioDuration: visit.audioDuration || '',
            image: visit.image || '',
          }));
          setVisits(formattedVisits);
        } else {
          throw new Error(data.error || '加载探访信息失败');
        }
      } catch (err: any) {
        console.error('加载探访信息失败:', err);
        setVisitsError(err.message || '加载探访信息失败');
      } finally {
        setIsLoadingVisits(false);
      }
    }

    loadVisits();
  }, []);

  // 加入表单状态
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wechat: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    wechat: '',
  });

  // 切换探访点亮视频播放
  const toggleVisitVideo = () => {
    if (visitVideoRef.current) {
      if (playingVisitVideo) {
        visitVideoRef.current.pause();
      } else {
        visitVideoRef.current.play();
      }
      setPlayingVisitVideo(!playingVisitVideo);
    }
  };

  // 切换AI加油圈视频播放
  const toggleAiCircleVideo = () => {
    if (aiCircleVideoRef.current) {
      if (playingAiCircleVideo) {
        aiCircleVideoRef.current.pause();
      } else {
        aiCircleVideoRef.current.play();
      }
      setPlayingAiCircleVideo(!playingAiCircleVideo);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'training' || value === 'consultation') {
      setActiveTab(value);
    }
  };

  const handleInputChange = (field: 'name' | 'phone' | 'wechat') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // 清除错误提示
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleJoinSubmit = () => {
    // 简单的表单验证
    const newErrors = {
      name: formData.name.trim() ? '' : '请输入姓名',
      phone: formData.phone.trim() ? (formData.phone.length === 11 ? '' : '请输入有效的11位手机号码') : '请输入电话号码',
      wechat: formData.wechat.trim() ? '' : '请输入微信号',
    };

    setErrors(newErrors);

    // 如果没有错误，提交表单
    if (!newErrors.name && !newErrors.phone && !newErrors.wechat) {
      // TODO: 调用提交 API
      console.log('提交表单:', formData);
      alert('提交成功！');
      setJoinDialogOpen(false);
      setFormData({ name: '', phone: '', wechat: '' });
      setErrors({ name: '', phone: '', wechat: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* 顶部导航栏 */}
        <div className="sticky top-0 bg-white z-50 border-b border-gray-100">
          <div className="px-5 py-4">
            <h1 className="text-[18px] font-bold text-gray-900">订阅服务</h1>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="sticky top-[65px] bg-white z-40 border-b border-gray-100">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-transparent">
              <TabsTrigger
                value="training"
                className="data-[state=active]:bg-blue-400 data-[state=active]:text-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-400 text-[17px]"
              >
                探访点亮
              </TabsTrigger>
              <TabsTrigger
                value="consultation"
                className="data-[state=active]:bg-blue-400 data-[state=active]:text-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-400 text-[17px]"
              >
                AI 加油圈
              </TabsTrigger>
            </TabsList>

            <TabsContent value="training" className="mt-0">
              {/* Tab 描述 */}
              <div className="px-5 py-4 bg-blue-50">
                <p className="text-[17px] text-gray-700 leading-relaxed">
                  {tabDescriptions.training}
                </p>
              </div>

              {/* 媒体内容区域 */}
              <div className="relative h-[340px] bg-gray-100">
                {mediaConfig.visit.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={visitVideoRef}
                      src={mediaConfig.visit.url}
                      className="w-full h-full object-cover"
                      onEnded={() => setPlayingVisitVideo(false)}
                    />
                    <button
                      onClick={toggleVisitVideo}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all hover:bg-black/30"
                    >
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        {playingVisitVideo ? (
                          <PauseCircle className="w-12 h-12 text-blue-500" />
                        ) : (
                          <PlayCircle className="w-12 h-12 text-blue-500" />
                        )}
                      </div>
                    </button>
                  </div>
                ) : mediaConfig.visit.type === 'image' ? (
                  <img
                    src={mediaConfig.visit.url}
                    alt="探访点亮"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {/* 加入按钮 */}
              <div className="px-5 py-6">
                <Button
                  onClick={() => setJoinDialogOpen(true)}
                  className="w-full bg-blue-400 text-white h-12 rounded-none hover:bg-blue-500 transition-colors text-[17px]"
                >
                  立即加入
                </Button>
              </div>

              {/* 探访记录 */}
              <div className="border-t border-gray-100">
                <div className="px-5 py-4 flex items-center justify-between cursor-pointer" onClick={() => setVisitsExpanded(!visitsExpanded)}>
                  <h2 className="text-[17px] font-bold text-gray-900">探访记录</h2>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${visitsExpanded ? 'rotate-180' : ''}`} />
                </div>

                {visitsExpanded && (
                  <div className="px-5 pb-4 space-y-4">
                    {isLoadingVisits ? (
                      <div className="text-center py-8 text-gray-400">加载中...</div>
                    ) : visitsError ? (
                      <div className="text-center py-8 text-red-500">{visitsError}</div>
                    ) : visits.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">暂无探访记录</div>
                    ) : (
                      visits.map((visit) => (
                        <div key={visit.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-[17px] font-medium text-gray-900">{visit.title}</h3>
                            {visit.audioDuration && (
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Mic className="w-4 h-4" />
                                <span>{visit.audioDuration}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{visit.record}</p>
                          {visit.image && (
                            <img
                              src={visit.image}
                              alt={visit.title}
                              className="w-full h-40 object-cover rounded"
                            />
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-500">{visit.date}</div>
                            {visit.tags && visit.tags.length > 0 && (
                              <div className="flex space-x-2">
                                {visit.tags.slice(0, 2).map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="consultation" className="mt-0">
              {/* Tab 描述 */}
              <div className="px-5 py-4 bg-blue-50">
                <p className="text-[17px] text-gray-700 leading-relaxed">
                  {tabDescriptions.consultation}
                </p>
              </div>

              {/* 媒体内容区域 */}
              <div className="relative h-[340px] bg-gray-100">
                {mediaConfig.aiCircle.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={aiCircleVideoRef}
                      src={mediaConfig.aiCircle.url}
                      className="w-full h-full object-cover"
                      onEnded={() => setPlayingAiCircleVideo(false)}
                    />
                    <button
                      onClick={toggleAiCircleVideo}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all hover:bg-black/30"
                    >
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        {playingAiCircleVideo ? (
                          <PauseCircle className="w-12 h-12 text-blue-500" />
                        ) : (
                          <PlayCircle className="w-12 h-12 text-blue-500" />
                        )}
                      </div>
                    </button>
                  </div>
                ) : mediaConfig.aiCircle.type === 'image' ? (
                  <img
                    src={mediaConfig.aiCircle.url}
                    alt="AI 加油圈"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {/* 加入按钮 */}
              <div className="px-5 py-6">
                <Button
                  onClick={() => setJoinDialogOpen(true)}
                  className="w-full bg-blue-400 text-white h-12 rounded-none hover:bg-blue-500 transition-colors text-[17px]"
                >
                  加入 AI 加油圈
                </Button>
              </div>

              {/* 沙龙介绍 */}
              <div className="border-t border-gray-100 px-5 py-6">
                <div className="mb-6">
                  <h2 className="text-[19px] font-bold text-gray-900 mb-3">{salon.period}</h2>
                  <p className="text-[17px] text-gray-600 leading-relaxed mb-4">{salon.introduction}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{salon.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{salon.limit}</span>
                    </div>
                  </div>
                </div>

                {/* 数字资产 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[17px] font-bold text-gray-900">数字资产</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>{salon.digitalAssets.length} 个产出</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {salon.digitalAssets.map((asset) => (
                      <div key={asset.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          {asset.cover && (
                            <img
                              src={asset.cover}
                              alt={asset.title}
                              className="w-20 h-20 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-[17px] font-medium text-gray-900 mb-1">{asset.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{asset.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{asset.type} • {asset.size}</span>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{asset.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 加入表单对话框 */}
        <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[19px] font-bold">加入 {activeTab === 'training' ? '探访点亮' : 'AI 加油圈'}</DialogTitle>
              <DialogDescription className="text-[17px]">
                请填写以下信息，我们会尽快与您联系
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* 姓名 */}
              <div className="space-y-2">
                <label className="text-[17px] font-medium text-gray-700">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="请输入您的姓名"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className={`rounded-none ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-[14px] text-red-500">{errors.name}</p>
                )}
              </div>

              {/* 电话号码 */}
              <div className="space-y-2">
                <label className="text-[17px] font-medium text-gray-700">
                  电话号码 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="请输入11位手机号码"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  maxLength={11}
                  className={`rounded-none ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-[14px] text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* 微信号 */}
              <div className="space-y-2">
                <label className="text-[17px] font-medium text-gray-700">
                  微信号 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="请输入您的微信号"
                  value={formData.wechat}
                  onChange={handleInputChange('wechat')}
                  className={`rounded-none ${errors.wechat ? 'border-red-500' : ''}`}
                />
                {errors.wechat && (
                  <p className="text-[14px] text-red-500">{errors.wechat}</p>
                )}
              </div>
            </div>

            {/* 按钮 */}
            <div className="flex justify-end mt-6 space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setJoinDialogOpen(false);
                  setFormData({ name: '', phone: '', wechat: '' });
                  setErrors({ name: '', phone: '', wechat: '' });
                }}
                className="rounded-none text-[17px] h-9 px-6"
              >
                取消
              </Button>
              <Button
                onClick={handleJoinSubmit}
                disabled={!formData.name || !formData.phone || !formData.wechat}
                className="rounded-none bg-blue-400 text-white text-[17px] h-9 px-6 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确定
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 底部导航 */}
        <BottomNav />
      </div>
    </div>
  );
}
