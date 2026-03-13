'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Heart, Share2, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AvatarDisplay } from '@/components/avatar-upload';

export default function DeclarationDetailPage() {
  // 静态数据 - 后期会从API获取
  const declaration = {
    id: '1',
    title: '30分钟安装openclaw',
    content: '30分钟快速安装openclaw，帮助你快速搭建AI开发环境，包含环境配置、依赖安装、基础测试等完整流程。',
    profile: '能力现货',
    duration: '5:23',
    rank: 1,
    iconType: 'ability',
    views: 128,
    likes: 56,
    shares: 23,
    createdAt: '2026-03-13T10:30:00',
    audioUrl: null, // 暂无音频
    image: '/default-cover.jpg',
    creator: {
      name: '威哥',
      avatar: '/avatar-default.jpg',
      industry: '互联网/IT/软件',
      tags: ['AI技术', '定方向', '从0到1'],
    },
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(323); // 5:23 = 323秒
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: declaration.title,
        text: declaration.content.substring(0, 100),
        url: window.location.href,
      });
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
          {/* 封面图 */}
          <div className="w-full h-12 overflow-hidden">
            <img
              src={declaration.image}
              alt={declaration.title}
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          {/* 播放器 */}
          <div className="px-5">
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              {/* 进度条 */}
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
                <div className="flex items-center space-x-2">
                  <Badge className="rounded-none bg-blue-400 text-white font-normal text-[10px]">
                    排名{declaration.rank}
                  </Badge>
                  <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[10px]">
                    {declaration.iconType}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={toggleMute} className="p-2">
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
                {declaration.profile} · {declaration.duration}
              </p>
            </div>

            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">内容</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {declaration.content}
              </p>
            </div>

            {/* 创作者信息 */}
            <div className="flex items-center space-x-3 p-4 bg-[rgba(0,0,0,0.02)]">
              <AvatarDisplay
                avatarKey={declaration.creator?.avatar || '/default-avatar.png'}
                name={declaration.creator?.name || '未知用户'}
                size="md"
              />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-gray-900">
                  {declaration.creator?.name || '未知用户'}
                </div>
                <div className="text-[11px] text-[rgba(0,0,0,0.4)]">
                  {declaration.creator?.industry || ''}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {declaration.creator?.tags?.map((tag: string) => (
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
                <div className="text-xl font-semibold text-gray-900">{declaration.views}</div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">浏览</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{declaration.likes}</div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">喜欢</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{declaration.shares}</div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">分享</div>
              </div>
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
      </div>
    </div>
  );
}
