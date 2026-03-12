'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Play, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// 宣告类型定义
interface Declaration {
  id: string;
  rank: number;
  icon: string;
  iconType: string;
  title: string;
  summary: string;
  duration: string;
  image: string;
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  user?: {
    id: string;
    name: string;
    nickname: string;
    avatar: string;
    position: string;
    company: string;
  };
}

export default function MyDeclarationsPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从API加载宣告数据
  useEffect(() => {
    async function loadDeclarations() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/declarations');

        if (!response.ok) {
          throw new Error('加载宣告数据失败');
        }

        const data = await response.json();

        if (data.success) {
          // 转换数据格式
          const formattedDeclarations = data.data.map((declaration: any) => ({
            id: declaration.id,
            rank: declaration.rank || 0,
            icon: declaration.user?.avatar || '/avatar-default.jpg',
            iconType: declaration.iconType || '',
            title: declaration.summary || declaration.text?.substring(0, 30) || '',
            summary: declaration.text || '',
            duration: declaration.duration || '0:00',
            image: declaration.image || '',
            publishDate: declaration.createdAt ? new Date(declaration.createdAt).toLocaleDateString('zh-CN') : '',
            views: declaration.views || 0,
            likes: Math.floor((declaration.views || 0) * 0.1), // 模拟点赞数为浏览量的10%
            comments: Math.floor((declaration.views || 0) * 0.02), // 模拟评论数为浏览量的2%
            user: declaration.user || null,
          }));

          setDeclarations(formattedDeclarations);
        } else {
          throw new Error(data.error || '加载宣告数据失败');
        }
      } catch (err: any) {
        console.error('加载宣告数据失败:', err);
        setError(err.message || '加载宣告数据失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadDeclarations();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条宣告吗？')) {
      // 这里应该调用删除API
      console.log('删除宣告:', id);
    }
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="w-full max-w-md mx-auto">
          {/* 顶部导航 */}
          <div className="sticky top-0 bg-white z-50 px-5 py-4">
            <div className="flex items-center justify-between">
              <Link href="/profile">
                <Button variant="ghost" className="p-2">
                  <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
                </Button>
              </Link>
              <h1 className="text-[15px] font-semibold text-gray-900">我的宣告</h1>
              <Link href="/declaration/create">
                <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-3 py-1.5 flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  新建
                </Button>
              </Link>
            </div>
          </div>

          {/* 加载状态 */}
          <div className="flex items-center justify-center py-20">
            <div className="text-[13px] text-[rgba(0,0,0,0.4)]">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="w-full max-w-md mx-auto">
          {/* 顶部导航 */}
          <div className="sticky top-0 bg-white z-50 px-5 py-4">
            <div className="flex items-center justify-between">
              <Link href="/profile">
                <Button variant="ghost" className="p-2">
                  <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
                </Button>
              </Link>
              <h1 className="text-[15px] font-semibold text-gray-900">我的宣告</h1>
              <Link href="/declaration/create">
                <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-3 py-1.5 flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  新建
                </Button>
              </Link>
            </div>
          </div>

          {/* 错误状态 */}
          <div className="flex items-center justify-center py-20">
            <div className="text-[13px] text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">我的宣告</h1>
            <Link href="/declaration/create">
              <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-3 py-1.5 flex items-center">
                <Plus className="w-4 h-4 mr-1" />
                新建
              </Button>
            </Link>
          </div>
        </div>

        <div className="px-5 space-y-4">
          {declarations.map((declaration) => (
            <Link
              key={declaration.id}
              href={`/declaration/${declaration.id}`}
              className="block"
            >
              <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-start space-x-3">
                  {/* 封面图 */}
                  <div className="w-20 h-14 flex-shrink-0 overflow-hidden relative">
                    <Image
                      src={declaration.image}
                      alt={declaration.title}
                      width={80}
                      height={56}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className="rounded-none bg-blue-400 text-white font-normal text-[9px]">
                        排名{declaration.rank}
                      </Badge>
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[9px]">
                        {declaration.iconType}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {declaration.title}
                    </h3>
                    <p className="text-[11px] text-[rgba(0,0,0,0.4)] line-clamp-2 mb-2">
                      {declaration.summary}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[rgba(0,0,0,0.4)]">
                      <span>{declaration.publishDate}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Play className="w-3 h-3 mr-0.5" />
                          {declaration.duration}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-0.5" />
                          {declaration.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-0.5" />
                          {declaration.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {declarations.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[rgba(0,0,0,0.05)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[rgba(0,0,0,0.25)]" />
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-4">
                还没有发布过宣告
              </p>
              <Link href="/declaration/create">
                <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[13px]">
                  发布第一条宣告
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
