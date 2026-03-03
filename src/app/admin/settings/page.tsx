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
  BarChart, PieChart, Radar, LineChart, X
} from 'lucide-react';
import { useState } from 'react';

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
  // 发现键设置
  discovery: {
    slogan: '发现光亮，点亮事业',
    logo: '/logo-ranchang.png',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  // 点亮键设置
  ignition: {
    visitSlogan: '探访点亮，看见榜样',
    aiCircleSlogan: 'AI加油圈，互助成长',
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
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('discovery');
  const [saving, setSaving] = useState(false);
  const [previewMusic, setPreviewMusic] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  // 保存设置
  const handleSave = () => {
    setSaving(true);
    
    // 模拟保存到localStorage
    try {
      localStorage.setItem('pageSettings', JSON.stringify(settings));
      
      // 保存成功提示
      setTimeout(() => {
        alert('设置保存成功！');
        setSaving(false);
      }, 500);
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存失败，请重试');
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
      };
      reader.readAsDataURL(file);
    }
  };

  // 音乐预览
  const toggleMusicPreview = () => {
    setPreviewMusic(!previewMusic);
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
          <TabsList className="bg-[rgba(0,0,0,0.05)] p-1">
            <TabsTrigger value="discovery" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              发现键设置
            </TabsTrigger>
            <TabsTrigger value="ignition" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              点亮键设置
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              个人键设置
            </TabsTrigger>
          </TabsList>

          {/* 发现键设置 */}
          <TabsContent value="discovery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">发现键内页配置</CardTitle>
                <CardDescription className="text-[12px]">
                  配置发现键页面的展示内容
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Slogan编辑 */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    页面 Slogan
                  </label>
                  <Input
                    value={settings.discovery.slogan}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      discovery: {
                        ...prev.discovery,
                        slogan: e.target.value,
                      },
                    }))}
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
              <CardContent className="space-y-6">
                {/* 探访点亮Slogan */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    探访点亮 Slogan（灰色文字）
                  </label>
                  <Textarea
                    value={settings.ignition.visitSlogan}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ignition: {
                        ...prev.ignition,
                        visitSlogan: e.target.value,
                      },
                    }))}
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

                {/* AI加油圈Slogan */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    AI加油圈 Slogan（灰色文字）
                  </label>
                  <Textarea
                    value={settings.ignition.aiCircleSlogan}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ignition: {
                        ...prev.ignition,
                        aiCircleSlogan: e.target.value,
                      },
                    }))}
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

                {/* 预览区域 */}
                <div className="space-y-3 pt-4 border-t border-[rgba(0,0,0,0.1)]">
                  <p className="text-[12px] font-medium text-gray-900">效果预览</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
