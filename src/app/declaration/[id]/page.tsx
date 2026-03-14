'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Heart, Share2, Volume2, VolumeX, RotateCcw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AvatarDisplay } from '@/components/avatar-upload';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function DeclarationDetailPage() {
  const params = useParams();
  const { user, isLoggedIn } = useAuth();
  const [declaration, setDeclaration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // 从音频文件获取
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 弹窗状态
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [showUserDetailDialog, setShowUserDetailDialog] = useState(false);

  // 静态封面图
  const coverImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop';

  // 类型颜色映射（与个人中心一致）
  const getTypeColorClass = (type: string) => {
    return 'border-blue-400 bg-blue-400/40 text-blue-400';
  };

  // 从 API 加载宣告数据
  useEffect(() => {
    async function loadDeclaration() {
      try {
        setIsLoading(true);
        setError(null);

        const id = params.id as string;
        const response = await fetch(`/api/declarations/${id}`);

        if (!response.ok) {
          throw new Error('加载资源现货信息失败');
        }

        const data = await response.json();

        if (data.success) {
          setDeclaration(data.data);
          setLikesCount(data.data.likes || 0);

          // 如果用户已登录，检查是否已经喜欢过
          if (isLoggedIn && user) {
            const likeResponse = await fetch(`/api/declarations/${id}/like/status?userId=${user.id}`);
            if (likeResponse.ok) {
              const likeData = await likeResponse.json();
              if (likeData.success) {
                setIsLiked(likeData.data.isLiked);
              }
            }
          }
        } else {
          throw new Error(data.error || '加载资源现货信息失败');
        }
      } catch (err: any) {
        console.error('加载资源现货信息失败:', err);
        setError(err.message || '加载资源现货信息失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadDeclaration();
  }, [params.id, isLoggedIn, user]);

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
  }, [declaration]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-14 flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (error || !declaration) {
    return (
      <div className="min-h-screen bg-white pb-14 flex items-center justify-center">
        <div className="text-red-400">{error || '资源现货信息不存在'}</div>
      </div>
    );
  }

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
    if (!audioRef.current || !declaration.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current || !declaration.audioUrl) return;

    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
    setProgress(parseFloat(e.target.value));
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 点赞功能
  const handleLike = async () => {
    // 登录验证
    if (!isLoggedIn || !user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await fetch(`/api/declarations/${declaration.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          action,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLiked(data.data.isLiked);
        setLikesCount(data.data.likesCount);
      } else {
        throw new Error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('点赞失败:', error);
      alert('操作失败，请稍后重试');
    }
  };

  // 分享功能
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: declaration.title,
          text: declaration.content.substring(0, 100),
          url: window.location.href,
        });
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板');
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  // 联系功能
  const handleContact = () => {
    // 检查登录状态
    if (!isLoggedIn) {
      // 未登录，显示登录提示
      setShowLoginDialog(true);
    } else {
      // 已登录，显示功能提示
      setShowFeatureDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-14">
      <div className="w-full max-w-md mx-auto pb-8">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/discovery">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">资源现货</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="space-y-6">
          {/* 封面图 - 静态图片 */}
          <div className="w-full h-12 overflow-hidden">
            <img
              src={coverImage}
              alt="资源现货"
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          {/* 播放器 */}
          <div className="px-5">
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              {/* 进度条 */}
              {declaration.audioUrl && (
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
              )}

              {/* 播放控制 */}
              <div className="flex items-center justify-center space-x-6">
                <Button variant="ghost" onClick={handleRewind} className="p-2">
                  <RotateCcw className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
                </Button>
                <Button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center"
                  disabled={!declaration.audioUrl}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </Button>
                <Button variant="ghost" onClick={handleFastForward} className="p-2">
                  <RotateCcw className="w-5 h-5 text-[rgba(0,0,0,0.6)] rotate-180" />
                </Button>
              </div>
            </div>
          </div>

          {/* 内容 */}
          <div className="px-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                {/* 类型标签 - 蓝色边框、蓝色背景、蓝色文字（与个人中心一致） */}
                <div className="px-3 py-1.5 text-[11px] border border-blue-400 bg-blue-400/40 text-blue-400">
                  {declaration.typeLabel}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={toggleMute} className="p-2" disabled={!declaration.audioUrl}>
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
                    )}
                  </Button>
                  <Button variant="ghost" onClick={handleLike} className="p-2">
                    <Heart
                      className={`w-5 h-5 ${isLiked ? 'fill-red-400 text-red-400' : 'text-[rgba(0,0,0,0.6)]'}`}
                    />
                  </Button>
                  <Button variant="ghost" onClick={handleShare} className="p-2">
                    <Share2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
                  </Button>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{declaration.title}</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
                {declaration.typeLabel}
              </p>
            </div>

            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">内容</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {declaration.content}
              </p>
            </div>

            {/* 创作者信息 - 大灰色底色 - 点击弹出用户详情 */}
            <div
              className="flex items-center space-x-3 p-4 bg-[rgba(0,0,0,0.02)] cursor-pointer hover:bg-[rgba(0,0,0,0.04)] transition-colors"
              onClick={() => setShowUserDetailDialog(true)}
            >
              {/* 头像 - 使用AvatarDisplay组件 */}
              <AvatarDisplay
                avatarKey={declaration.user?.avatar || '/default-avatar.png'}
                name={declaration.user?.name || '未知用户'}
                size="md"
              />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-gray-900">
                  {declaration.user?.name || '未知用户'}
                  <span className="ml-2 text-[rgba(0,0,0,0.4)]">
                    {declaration.user?.age ? `${declaration.user.age}岁` : ''}
                  </span>
                </div>
                <div className="text-[11px] text-[rgba(0,0,0,0.4)]">
                  {declaration.user?.industry || ''}
                  {declaration.user?.company && ` · ${declaration.user.company}`}
                  {declaration.user?.position && ` · ${declaration.user.position}`}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {declaration.user?.hardcoreTags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[9px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="flex items-center justify-around py-4 border-t border-b border-[rgba(0,0,0,0.05)]">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{declaration.views || 0}</div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">浏览</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{likesCount}</div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">喜欢</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{declaration.shares || 0}</div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">分享</div>
              </div>
            </div>

            {/* 我要连接按钮 */}
            <div className="mt-6">
              <Button
                onClick={handleContact}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-3"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                我要连接
              </Button>
            </div>

            {/* 发布时间 */}
            <div className="text-[11px] text-[rgba(0,0,0,0.4)] text-center mt-6">
              发布于 {declaration.createdAt ? formatDate(declaration.createdAt) : ''}
            </div>
          </div>
        </div>

        {/* 隐藏的音频元素 */}
        {declaration.audioUrl && (
          <audio ref={audioRef} src={declaration.audioUrl} />
        )}

        {/* 登录提示弹窗 */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="w-[80%] max-w-[80%]">
            <DialogHeader>
              <DialogTitle>登录提示</DialogTitle>
              <DialogDescription>
                请先登录后再使用此功能
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowLoginDialog(false)}
              >
                取消
              </Button>
              <Button
                className="bg-blue-400 hover:bg-blue-500"
                onClick={() => {
                  setShowLoginDialog(false);
                  // TODO: 跳转到登录页面
                  window.location.href = '/login';
                }}
              >
                去登录
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 功能提示弹窗 */}
        <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
          <DialogContent className="w-[80%] max-w-[80%]">
            <DialogHeader>
              <DialogTitle>功能提示</DialogTitle>
              <DialogDescription>
                您暂未开通及时沟通功能，可参加平台活动认识这位会员
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button
                className="bg-blue-400 hover:bg-blue-500"
                onClick={() => setShowFeatureDialog(false)}
              >
                我知道了
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 用户详情弹窗 - 80%宽度 */}
        <Dialog open={showUserDetailDialog} onOpenChange={setShowUserDetailDialog}>
          <DialogContent className="w-[80%] max-w-[80%] max-h-[90vh] overflow-y-auto">
            {declaration && declaration.user && (
              <div className="space-y-6">
                {/* 用户基本信息 */}
                <div className="flex items-start space-x-4">
                  <AvatarDisplay
                    avatarKey={declaration.user.avatar || '/default-avatar.png'}
                    name={declaration.user.name || '未知用户'}
                    size="xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-1">{declaration.user.name}</h2>
                      <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
                        {declaration.user.age ? `${declaration.user.age}岁` : ''}
                      </p>
                    </div>

                    {/* 行业标签 */}
                    {declaration.user.industry && (
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal">
                          {declaration.user.industry}
                        </span>
                      </div>
                    )}

                    {/* 关注数据 */}
                    <div className="flex items-center space-x-6 text-[13px]">
                      <div>
                        <span className="font-semibold text-gray-900">0</span>
                        <span className="text-[rgba(0,0,0,0.4)] ml-1">关注者</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">0</span>
                        <span className="text-[rgba(0,0,0,0.4)] ml-1">关注</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 硬核标签 */}
                {declaration.user.hardcoreTags && declaration.user.hardcoreTags.length > 0 && (
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-3">硬核标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {declaration.user.hardcoreTags.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[9px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 资源标签 */}
                {declaration.user.resourceTags && declaration.user.resourceTags.length > 0 && (
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-3">资源标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {declaration.user.resourceTags.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 border border-[rgba(0,0,0,0.2)] text-[rgba(0,0,0,0.6)] text-[9px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 公司和职位 */}
                {(declaration.user.company || declaration.user.position) && (
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-2">职业信息</h3>
                    <p className="text-[13px] text-gray-700">
                      {declaration.user.company && declaration.user.position
                        ? `${declaration.user.company} · ${declaration.user.position}`
                        : declaration.user.company || declaration.user.position || '暂无'}
                    </p>
                  </div>
                )}

                {/* 资源现货 */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="px-2 py-1 bg-blue-400/40 border border-blue-400 text-blue-400 text-[11px]">
                      {declaration.typeLabel}
                    </div>
                  </div>
                  <p className="text-[16px] font-bold text-gray-900 leading-relaxed mb-2">
                    {declaration.title}
                  </p>
                  {declaration.content && (
                    <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
                      {declaration.content}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-gray-500">
                      {declaration.createdAt ? formatDate(declaration.createdAt) : ''}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-[11px] text-gray-500">{declaration.views || 0}次浏览</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
