'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Calendar, MapPin, Users, Clock, Star, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLoginModal } from '@/contexts/login-modal-context-v2';

export default function VisitDetailPage() {
  const params = useParams();
  const { user, isLoggedIn } = useAuth();
  const { showLoginModal } = useLoginModal();
  const [visit, setVisit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 申请对话框状态
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

  // 收藏状态
  const [isFavorite, setIsFavorite] = useState(false);

  // 从 API 加载探访数据
  useEffect(() => {
    async function loadVisit() {
      try {
        setIsLoading(true);
        setError(null);

        const id = params.id as string;
        const response = await fetch(`/api/visits/${id}`);

        if (!response.ok) {
          throw new Error('加载探访信息失败');
        }

        const data = await response.json();

        if (data.success) {
          setVisit(data.data);

          // 检查用户是否已收藏该项目
          if (user?.id) {
            checkFavoriteStatus(data.data.id);
          }
        } else {
          throw new Error(data.error || '加载探访信息失败');
        }
      } catch (err: any) {
        console.error('加载探访信息失败:', err);
        setError(err.message || '加载探访信息失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadVisit();
  }, [params.id]);

  // 音频播放控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: visit.title,
        text: `${visit.title} - ${visit.record}`,
        url: window.location.href,
      });
    } else {
      // 降级方案：复制链接
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('链接已复制到剪贴板！');
      }).catch(() => {
        alert('复制失败，请手动复制浏览器地址栏的链接');
      });
    }
  };

  const handleOpenDialog = () => {
    // 登录验证
    if (!isLoggedIn || !user) {
      showLoginModal();
      return;
    }

    // 自动填充用户信息
    setFormData({
      name: user.name || user.nickname || '',
      phone: user.phone || '',
      wechat: '',
    });

    setJoinDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setJoinDialogOpen(false);
    setFormData({ name: '', phone: '', wechat: '' });
    setErrors({ name: '', phone: '', wechat: '' });
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 检查收藏状态
  const checkFavoriteStatus = async (visitId: string) => {
    try {
      if (!user?.id) return;

      const response = await fetch(`/api/users/${user.id}/favorites/visits`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const favoriteVisitIds = data.data.map((fav: any) => fav.visitId);
          setIsFavorite(favoriteVisitIds.includes(visitId));
        }
      }
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  // 切换收藏状态
  const toggleFavorite = async () => {
    // 登录验证
    if (!isLoggedIn || !user) {
      showLoginModal();
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}/favorites/visits`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId: visit.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsFavorite(!isFavorite);
        // 触发storage事件，让个人页知道收藏状态已变化
        window.dispatchEvent(new Event('storage'));
      } else {
        alert(data.error || '操作失败，请稍后重试');
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      alert('操作失败，请稍后重试');
    }
  };

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

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);

        // 调用API提交申请
        const response = await fetch('/api/visits/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitId: visit.id,
            userId: user?.id,
            userName: formData.name,
            userPhone: formData.phone,
            userWechat: formData.wechat,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log('提交申请:', formData);
          alert('申请提交成功！我们将尽快与您联系');
          setJoinDialogOpen(false);
          setFormData({ name: '', phone: '', wechat: '' });
          setErrors({ name: '', phone: '', wechat: '' });
        } else {
          throw new Error(data.error || '提交申请失败');
        }
      } catch (err: any) {
        console.error('提交申请失败:', err);
        alert(err.message || '提交申请失败，请稍后重试');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-14 flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen bg-white pb-14 flex items-center justify-center">
        <div className="text-red-400">{error || '探访信息不存在'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-[rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <Link href="/subscription">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">探访点亮</h1>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" onClick={toggleFavorite} className="p-2">
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[rgba(0,0,0,0.6)]'}`}
                />
              </Button>
              <Button variant="ghost" onClick={handleShare} className="p-2">
                <Share2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 封面主图 */}
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={visit.image}
              alt={visit.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
              {/* 显示 tags 标签，过滤掉系统标签 */}
              {visit.tags?.filter((tag: string) => !['已审核', '已发布'].includes(tag)).length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-2">
                  {visit.tags.filter((tag: string) => !['已审核', '已发布'].includes(tag)).map((tag: string) => (
                    <Badge
                      key={tag}
                      className="rounded-none bg-blue-400 text-white font-normal text-[12px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Badge className="rounded-none bg-blue-400 text-white font-normal text-[12px] mb-2">
                  {visit.industry}
                </Badge>
              )}
            </div>
          </div>

          <div className="px-5 space-y-6">
            {/* 标题和基本信息 */}
            <div>
              <h2 className="text-[22px] font-semibold text-gray-900 mb-3 leading-tight">
                {visit.title}
              </h2>
              <div className="flex flex-wrap gap-2 text-[13px] text-[rgba(0,0,0,0.6)]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{visit.duration}</span>
                </div>
                <span>·</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{visit.date}</span>
                </div>
                <span>·</span>
                <span>{visit.views || 0} 浏览</span>
              </div>
            </div>

            {/* 被访者信息 */}
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">被访者</h3>
              {visit.target ? (
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={visit.target.avatar || ''} alt={visit.target.name || ''} />
                    <AvatarFallback>{visit.target.name ? visit.target.name[0] : '被'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                      {visit.target.name || '暂无姓名'}
                    </div>
                    <div className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1">
                      {visit.target.title || ''} {visit.target.title && visit.target.company ? '·' : ''} {visit.target.company || ''}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {visit.target.tags && visit.target.tags.length > 0 ? (
                        visit.target.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[9px]"
                          >
                            {tag}
                          </span>
                        ))
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[13px] text-[rgba(0,0,0,0.4)]">暂无被访者信息</div>
              )}
            </div>

            {/* 拜访信息 */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                    {visit.date} {visit.time}
                  </div>
                  <div className="text-[9px] text-[rgba(0,0,0,0.4)]">拜访时间</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">{visit.location}</div>
                  <div className="text-[9px] text-[rgba(0,0,0,0.4)]">拜访地点</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                    {visit.participants} 人参与
                  </div>
                  <div className="text-[9px] text-[rgba(0,0,0,0.4)]">参与人数</div>
                </div>
              </div>
            </div>

            {/* 探访人 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">探访人</h3>
              <div className="flex items-start space-x-3">
                {visit.visitors && visit.visitors.length > 0 ? (
                  visit.visitors.map((visitor: any, i: number) => (
                    visitor && (
                      <div key={i} className="flex flex-col items-center">
                        <Avatar className="w-10 h-10 mb-1">
                          <AvatarImage src={visitor.avatar || ''} alt={visitor.name || ''} />
                          <AvatarFallback>{visitor.name ? visitor.name[0] : '访'}</AvatarFallback>
                        </Avatar>
                        <div className="text-[10px] text-[rgba(0,0,0,0.6)] text-center w-12 truncate">
                          {visitor.name || '访客'}
                        </div>
                        <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[10px] mt-0.5">
                          {visitor.skill || '能力'}
                        </Badge>
                      </div>
                    )
                  ))
                ) : (
                  <div className="text-[13px] text-[rgba(0,0,0,0.4)]">暂无探访人信息</div>
                )}
              </div>
            </div>

            {/* 走访记录 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">走访记录</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">{visit.record || '暂无记录'}</p>
            </div>

            {/* 拜访成果 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">拜访成果</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">{visit.outcome || '暂无成果'}</p>
            </div>

            {/* 关键要点 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">关键要点</h3>
              <ul className="space-y-1.5">
                {visit.keyPoints && visit.keyPoints.length > 0 ? (
                  visit.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start text-[13px] text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-none mt-1.5 mr-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[13px] text-[rgba(0,0,0,0.4)]">暂无关键要点</li>
                )}
              </ul>
            </div>

            {/* 下一步计划 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">下一步计划</h3>
              <ul className="space-y-1.5">
                {visit.nextSteps && visit.nextSteps.length > 0 ? (
                  visit.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start text-[13px] text-gray-700">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-none mt-1.5 mr-2 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[13px] text-[rgba(0,0,0,0.4)]">暂无下一步计划</li>
                )}
              </ul>
            </div>

            {/* 备注 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">备注</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">{visit.notes || '暂无备注'}</p>
            </div>

            {/* 评分 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">本次评分</h3>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= visit.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[rgba(0,0,0,0.1)]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 照片 */}
            {visit.images && visit.images.length > 0 && (
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">现场照片</h3>
                <div className="grid grid-cols-2 gap-2">
                  {visit.images.map((image: string, index: number) => (
                    <div key={index} className="w-full h-32 overflow-hidden">
                      <img
                        src={image}
                        alt={`照片${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 走访录音 */}
            {visit.audioUrl && (
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">走访反馈录音</h3>
                <div className="p-4 bg-[rgba(0,0,0,0.02)]">
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-1 bg-[rgba(0,0,0,0.1)] rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #60a5fa ${progress}%, rgba(0,0,0,0.1) ${progress}%)`,
                      }}
                    />
                    <div className="flex justify-between text-[10px] text-[rgba(0,0,0,0.4)] mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={togglePlay}
                      className="w-14 h-14 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <p className="text-[14px] text-gray-900 font-medium">走访反馈录音</p>
                      <p className="text-[12px] text-[rgba(0,0,0,0.4)]">
                        {visit.audioDuration || formatTime(duration)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 申请成为被访者 */}
            <div className="flex justify-center pt-4 pb-4">
              <button
                onClick={handleOpenDialog}
                className="px-6 py-2 rounded-none bg-gradient-to-br from-blue-400 to-blue-500 text-white text-sm font-normal hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl hover:from-blue-500 hover:to-blue-600 active:scale-95 shadow-lg transition-all duration-200"
              >
                申请成为被访者
              </button>
            </div>
          </div>
        </div>

        {/* 隐藏的音频元素 */}
        {visit.audioUrl && (
          <audio ref={audioRef} src={visit.audioUrl} />
        )}
      </div>

      {/* 申请对话框 */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>申请成为被访者</DialogTitle>
            <DialogDescription>
              填写以下信息，我们将尽快与您联系
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Input
                placeholder="姓名"
                value={formData.name}
                onChange={handleInputChange('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="电话号码"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="微信号"
                value={formData.wechat}
                onChange={handleInputChange('wechat')}
                className={errors.wechat ? 'border-red-500' : ''}
              />
              {errors.wechat && (
                <p className="text-red-500 text-sm mt-1">{errors.wechat}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-400 hover:bg-blue-500 text-white"
            >
              {isSubmitting ? '提交中...' : '提交申请'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
