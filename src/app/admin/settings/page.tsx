'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Save, Play, Eye, X, AlertTriangle, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Image as ImageIcon } from 'lucide-react';
import { useFileUpload, useImageUrl } from '@/hooks/use-image';

// 默认设置数据
const defaultSettings = {
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
  discovery: {
    slogan: '发现光亮，点亮事业',
    logo: null as string | null,
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundImage: '/discovery-bg.jpg',
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [previewVisitMedia, setPreviewVisitMedia] = useState<string | null>(null);
  const [previewAiCircleMedia, setPreviewAiCircleMedia] = useState<string | null>(null);
  const [playingVisitVideo, setPlayingVisitVideo] = useState(false);
  const [playingAiCircleVideo, setPlayingAiCircleVideo] = useState(false);
  const visitVideoRef = useRef<HTMLVideoElement>(null);
  const aiCircleVideoRef = useRef<HTMLVideoElement>(null);

  // Logo相关
  const { url: logoUrl } = useImageUrl(settings.discovery?.logo);
  const { upload: uploadLogo, uploading: uploadingLogo } = useFileUpload();

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
          if (data.data.logo) {
            // Logo会通过useImageUrl自动加载
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

  // Logo上传
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型（只允许最兼容的格式）
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('为了保证最佳兼容性，只支持 JPEG、PNG 格式的图片');
      return;
    }

    // 验证文件大小（2MB）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('图片大小不能超过 2MB');
      return;
    }

    try {
      const result = await uploadLogo(file);
      if (result.fileKey) {
        setSettings(prev => ({
          ...prev,
          discovery: {
            ...prev.discovery,
            logo: result.fileKey,
          },
        }));
        setHasChanged(true);
        // 清除file input，允许重复选择同一文件
        if (event.target) {
          event.target.value = '';
        }
      }
    } catch (error: any) {
      alert(`上传失败：${error.message}`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 mb-1">页面设置</h1>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">配置前台页面的展示内容</p>
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

        {/* Logo设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold">发现页 Logo 设置</CardTitle>
            <CardDescription className="text-[12px]">
              上传网站 Logo，显示在发现页右上角
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full h-32 bg-[rgba(0,0,0,0.02)] border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden relative">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-[rgba(0,0,0,0.3)]" />
                    <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-2">未上传Logo</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[rgba(0,0,0,0.6)]">
                  支持 JPEG、PNG 格式，最大 2MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploadingLogo}
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px]"
                    asChild
                    disabled={uploadingLogo}
                  >
                    <span>
                      {uploadingLogo ? '上传中...' : '上传Logo'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold">点亮键页面配置</CardTitle>
            <CardDescription className="text-[12px]">
              配置点亮键页面（前台"点亮"Tab）的展示内容
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
                修改将立即生效，影响前台页面显示
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
