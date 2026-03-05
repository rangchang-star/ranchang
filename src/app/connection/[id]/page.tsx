'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Flame, PlayCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

const tagStampMap = {
  personLookingForJob: { label: '人找事', description: '我有能力，寻找项目机会' },
  jobLookingForPerson: { label: '事找人', description: '我有项目，寻找合作伙伴' },
  pureExchange: { label: '纯交流', description: '只想交流学习，暂无合作需求' },
};

export default function ConnectionDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // 从 API 加载用户数据
  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        setError(null);

        const id = params.id as string;
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
          throw new Error('加载用户信息失败');
        }

        const data = await response.json();

        if (data.success) {
          // 将 API 数据转换为前端需要的格式
          const formattedUser = {
            id: data.data.id.toString(),
            name: data.data.name || data.data.nickname,
            age: data.data.age || 0,
            avatar: data.data.avatar || '/avatar-default.jpg',
            tags: data.data.tags || [],
            industry: data.data.industry || '',
            tagStamp: data.data.tagStamp || 'pureExchange',
            need: data.data.need || '',
            abilityTags: data.data.abilityTags || [],
            resourceTags: data.data.resourceTags || [],
            currentDeclaration: {
              direction: 'confidence',
              text: data.data.need || '',
              summary: data.data.bio || '',
              date: new Date(data.data.createdAt).toLocaleDateString('zh-CN'),
              views: 0,
            },
            isLiked: false,
            followers: 0,
            following: 0,
          };
          setUser(formattedUser);
        } else {
          throw new Error(data.error || '加载用户信息失败');
        }
      } catch (err: any) {
        console.error('加载用户信息失败:', err);
        setError(err.message || '加载用户信息失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [params.id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // 实现分享功能
    if (navigator.share) {
      navigator.share({
        title: user.name,
        text: user.need,
        url: window.location.href,
      });
    }
  };

  const tagStamp = tagStampMap[user.tagStamp as keyof typeof tagStampMap];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/discovery">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">会员详情</h1>
            <div className="w-10" /> {/* 占位，保持标题居中 */}
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* 加载状态和错误状态 */}
          {isLoading && (
            <div className="text-center py-20 text-gray-400">加载中...</div>
          )}
          
          {error && (
            <div className="text-center py-20 text-red-400">{error}</div>
          )}

          {!isLoading && !error && user && (
          <>
          <div className="relative">
            <div className={`absolute top-0 right-0 px-3 py-1 text-[11px] font-medium rounded-bl-md z-10 border-l-2 border-t-2 ${
              user.tagStamp === 'personLookingForJob'
                ? 'bg-[rgba(34,197,94,0.15)] text-gray-600 border-gray-400'
                : 'bg-blue-100 text-gray-600 border-gray-400'
            }`}>
              {tagStamp?.label}
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">{user.name}</h2>
                  <p className="text-[13px] text-[rgba(0,0,0,0.4)]">{user.age}岁</p>
                </div>

                {/* 行业标签 */}
                <div className="mb-3">
                  <span className="px-3 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal">
                    {user.industry}
                  </span>
                </div>

                {/* 关注数据 */}
                <div className="flex items-center space-x-6 text-[13px]">
                  <div>
                    <span className="font-semibold text-gray-900">{user.followers}</span>
                    <span className="text-[rgba(0,0,0,0.4)] ml-1">关注者</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{user.following}</span>
                    <span className="text-[rgba(0,0,0,0.4)] ml-1">关注</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleLike}
              className={`flex-1 font-normal text-[13px] py-3 ${
                isLiked
                  ? 'border-red-400 text-red-400 bg-red-50'
                  : 'border-[rgba(0,0,0,0.2)] text-gray-700'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-400' : ''}`} />
              喜欢
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="px-4 py-3 border-[rgba(0,0,0,0.2)]"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </Button>
          </div>

          {/* 能力标签 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">能力标签</h3>
            <div className="flex flex-wrap gap-2">
              {user.abilityTags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[12px] font-normal"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 资源标签 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">资源标签</h3>
            <div className="flex flex-wrap gap-2">
              {user.resourceTags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[12px] font-normal"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 一句话需求 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">需求描述</h3>
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              <p className="text-[13px] text-gray-900 leading-relaxed">
                {user.need}
              </p>
            </div>
          </div>

          {/* 当前宣告 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">当前宣告</h3>
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              <div className="flex items-start space-x-2">
                <Flame className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      {user.currentDeclaration.direction === 'confidence' ? '信心' : ''}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                        <PlayCircle className="w-8 h-8 text-[rgba(0,0,0,0.4)]" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-900 leading-relaxed mb-2">
                    {user.currentDeclaration.text}
                  </p>
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] leading-relaxed mb-2">
                    {user.currentDeclaration.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[rgba(0,0,0,0.4)]">
                    <span>{user.currentDeclaration.date}</span>
                    <span>{user.currentDeclaration.views.toLocaleString()}次</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
