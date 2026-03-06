'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Play, PlayCircle, TrendingUp, Heart, Mic, Users, X, PauseCircle } from 'lucide-react';

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
  period: '2026期',
  introduction: '定期举行的深度沙龙，汇集行业精英，共同探讨AI时代的商业机会与挑战，通过小组协作产出高价值的数字资产。',
  duration: '一年',
  schedule: '每周五 19:00',
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

  // 电话号码验证
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      phone: '',
      wechat: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入电话号码';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '请输入正确的11位手机号码';
      isValid = false;
    }

    if (!formData.wechat.trim()) {
      newErrors.wechat = '请输入微信号';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 处理表单输入
  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    // 清除该字段的错误
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  // 处理加入提交
  const handleJoinSubmit = () => {
    if (validateForm()) {
      // 这里可以调用API提交数据
      console.log('提交加入申请:', formData);
      setJoinDialogOpen(false);
      // 重置表单
      setFormData({ name: '', phone: '', wechat: '' });
      setErrors({ name: '', phone: '', wechat: '' });
      // 可以在这里显示成功提示
    }
  };

  return (
    <div className="min-h-screen bg-white pb-14">
      {/* 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        <div className="px-5 pt-[10px] pb-4 space-y-8">
          {/* 顶部标题区 */}
          <div>
            <div className="flex items-center justify-between py-4">
              <h1 className="text-[31px] font-light text-gray-900">点亮事业</h1>
            </div>
            <p className="text-[17px] text-[rgba(0,0,0,0.25)] leading-relaxed">
              {tabDescriptions[activeTab]}
            </p>
          </div>

          {/* 选项卡 */}
          <Tabs defaultValue="training" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="rounded-none grid w-full grid-cols-2 bg-[rgba(0,0,0,0.05)] p-1">
              <TabsTrigger
                value="training"
                className="rounded-none data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600 font-normal"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>探访点亮</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="consultation"
                className="rounded-none data-[state=active]:bg-blue-400 data-[state=active]:text-white text-gray-600 font-normal"
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>AI加油圈</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* 探访点亮内容 */}
            <TabsContent value="training" className="space-y-4 mt-6">
              {isLoadingVisits ? (
                <div className="text-center py-12 text-gray-400">加载中...</div>
              ) : visitsError ? (
                <div className="text-center py-12 text-red-400">{visitsError}</div>
              ) : visits.length === 0 ? (
                <div className="text-center py-12 text-gray-400">暂无探访内容</div>
              ) : (
                <React.Fragment>
                  {visits.slice(0, visitsExpanded ? visits.length : 2).map((visit) => (
                    <div
                      key={visit.id}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = `/visit/${visit.id}`;
                        }
                      }}
                      className="block p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                    >
                    {/* 图片 */}
                    <div className="mb-3 overflow-hidden">
                      <img
                        src={visit.image}
                        alt={visit.title}
                        className="w-full h-44 object-cover"
                      />
                    </div>

                    {/* 行业标签、时长、日期 */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[13px]">
                        {visit.industry}
                      </Badge>
                      <div className="flex items-center space-x-1 text-[13px] text-[rgba(0,0,0,0.25)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{visit.duration}</span>
                        <span>·</span>
                        <span>{visit.date}</span>
                      </div>
                    </div>

                    {/* 探访人头像和标签 */}
                    <div className="flex items-center space-x-4 mb-3">
                      {visit.visitors.slice(0, 3).map((visitor: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                            <img
                              src={visitor.avatar}
                              alt={visitor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[12px] line-clamp-1">
                            {visitor.skill}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* 标题 */}
                    <h3 className="text-[18px] font-semibold text-gray-900 mb-2 leading-tight line-clamp-1">
                      {visit.title}
                    </h3>

                    {/* 走访记录 */}
                    <p className="text-[15px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-3 mb-3">
                      {visit.record}
                    </p>

                    {/* 状态标签 */}
                    <div className="p-2.5 bg-[rgba(0,0,0,0.05)] mb-3">
                      <div className="flex flex-wrap gap-2">
                        {visit.status.map((status: string) => (
                          <Badge
                            key={status}
                            className="rounded-none bg-[rgba(0,0,0,0.08)] text-[rgba(0,0,0,0.6)] font-normal text-[13px] line-clamp-1"
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 走访录音 */}
                    <div className="flex items-center space-x-3 p-3 bg-[rgba(0,0,0,0.03)]">
                      <button className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-gray-900 font-medium">走访反馈录音</p>
                        <p className="text-[12px] text-[rgba(0,0,0,0.25)]">{visit.audioDuration}</p>
                      </div>
                      <Users className="w-4 h-4 text-[rgba(0,0,0,0.25)] flex-shrink-0" />
                    </div>
                  </div>
                  ))}
                  {/* 展开/收起按钮 */}
                  {visits.length > 2 && (
                    <button
                      onClick={() => setVisitsExpanded(!visitsExpanded)}
                      className="w-full py-2.5 text-center text-[15px] text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      {visitsExpanded ? '收起' : '查看更多'}
                    </button>
                  )}
                </React.Fragment>
              )}
            </TabsContent>

            {/* AI加油圈内容 */}
            <TabsContent value="consultation" className="space-y-4 mt-6">
              <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                {/* 顶部信息行 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-[22px] font-light text-gray-900">{salon.period}</h3>
                    <div className="flex items-center space-x-2 text-[12px] text-[rgba(0,0,0,0.4)]">
                      <span>{salon.duration}</span>
                      <span>·</span>
                      <span>{salon.schedule}</span>
                      <span>·</span>
                      <span>{salon.limit}</span>
                    </div>
                  </div>
                  {/* 圆形蓝色按钮 */}
                  <button
                    onClick={() => setJoinDialogOpen(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white text-[16px] font-normal flex items-center justify-center hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:from-blue-500 hover:to-blue-600 active:scale-95 shadow-lg transition-all duration-200"
                  >
                    加入
                  </button>
                </div>

                {/* 介绍 */}
                <p className="text-[17px] text-[rgba(0,0,0,0.25)] leading-relaxed mb-4">
                  {salon.introduction}
                </p>

                {/* 圈子数字资产产出 */}
                <h4 className="text-[26px] font-bold text-blue-400 mb-3">圈子数字资产产出</h4>

                {/* 数字资产列表 */}
                <div className="space-y-3">
                  {salon.digitalAssets.map((asset) => (
                    <Link
                      key={asset.id}
                      href={`/asset/${asset.id}`}
                      className="block p-3 bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.04)] transition-colors cursor-pointer"
                    >
                      {/* 资产图片 */}
                      <div className="mb-2 overflow-hidden">
                        <img
                          src={asset.cover}
                          alt={asset.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>

                      {/* 资产信息 */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="text-[16px] font-semibold text-gray-900 mb-1">{asset.title}</h5>
                          <p className="text-[14px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-2">
                            {asset.description}
                          </p>
                        </div>
                        <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[13px] ml-2 flex-shrink-0">
                          {asset.type}
                        </Badge>
                      </div>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between text-[12px] text-[rgba(0,0,0,0.4)]">
                        <div className="flex items-center space-x-3">
                          <span>{asset.createTime}</span>
                          <span>{asset.size}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{asset.likes}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 互动现场视频 */}
          <div>
            <div className="relative overflow-hidden bg-[rgba(0,0,0,0.02)] rounded-none">
              {/* 视频播放器 */}
              <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                <img
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=340&fit=crop"
                  alt="互动现场"
                  className="w-full h-full object-cover opacity-80"
                />
                {/* 播放按钮 */}
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-400 bg-opacity-90 flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </button>
                {/* 时长标签 */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-[13px] px-2 py-1 rounded-none">
                  0:10
                </div>
              </div>
              {/* 标题 */}
              <div className="p-3">
                <h5 className="text-[18px] font-semibold text-gray-900 mb-1">互动现场精彩瞬间</h5>
                <p className="text-[14px] text-[rgba(0,0,0,0.25)]">AI加油圈2026期小组讨论现场实录</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 加入AI加油圈弹窗 */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="w-[95%] max-w-[480px] max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[23px] font-semibold text-gray-900">
              加入AI加油圈
              <span className="text-[18px] font-normal text-[rgba(0,0,0,0.4)] ml-2">
                {salon.period}
              </span>
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>

          {/* 提示信息 */}
          <p className="text-[17px] text-[rgba(0,0,0,0.4)] mb-4">
            您提交申请后，会接到电话沟通，最终以微信通知你申请结果。
          </p>

          {/* 表单 */}
          <div className="space-y-4">
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
  );
}
