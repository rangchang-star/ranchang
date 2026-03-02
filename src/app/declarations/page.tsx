'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Play, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// 模拟数据
const mockDeclarations = [
  {
    id: '1',
    rank: 1,
    icon: '/icon-confidence.jpg',
    iconType: '信心',
    title: '用AI重塑传统制造业',
    summary: '基于15年供应链管理经验，帮助传统制造业实现数字化转型',
    duration: '5:23',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&h=120&fit=crop',
    publishDate: '2024年3月1日',
    views: 2847,
    likes: 156,
    comments: 23,
  },
  {
    id: '2',
    rank: 2,
    icon: '/icon-mission.jpg',
    iconType: '使命',
    title: '35+创业者的破局之路',
    summary: '探索中年创业的机遇与挑战，找到自己的使命',
    duration: '8:15',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=120&fit=crop',
    publishDate: '2024年2月20日',
    views: 1523,
    likes: 89,
    comments: 15,
  },
  {
    id: '3',
    rank: 3,
    icon: '/icon-self.jpg',
    iconType: '自我',
    title: '从HR到企业合伙人',
    summary: '分享从人力资源专家到企业合伙人的转型经历',
    duration: '6:42',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=120&fit=crop',
    publishDate: '2024年2月10日',
    views: 987,
    likes: 67,
    comments: 9,
  },
];

export default function MyDeclarationsPage() {
  const [declarations] = useState(mockDeclarations);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条宣告吗？')) {
      // 这里应该调用删除API
      console.log('删除宣告:', id);
    }
  };

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
                    <img
                      src={declaration.image}
                      alt={declaration.title}
                      className="w-full h-full object-cover"
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
