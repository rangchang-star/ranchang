'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';

interface AssetData {
  id: string;
  type: string;
  typeName: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  price: number;
  originalPrice?: number;
  views: number;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
}

export default function AssetDetailPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<AssetData | null>(null);

  useEffect(() => {
    async function loadAsset() {
      try {
        // TODO: 创建 /api/assets/[id] 接口
        const response = await fetch(`/api/assets/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setAsset(data.data);
        } else {
          setError(data.error || '加载失败');
        }
      } catch (err) {
        console.error('Failed to load asset:', err);
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    }

    loadAsset();
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share && asset) {
      navigator.share({
        title: asset.title,
        text: asset.description?.substring(0, 100),
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="w-full max-w-md mx-auto px-5 py-20 text-center text-gray-500">
          加载中...
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="w-full max-w-md mx-auto px-5 py-20 text-center">
          <Link href="/assets">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
          </Link>
          <p className="mt-8 text-gray-500">{error || '资产不存在'}</p>
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
            <Link href="/assets">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">资产详情</h1>
            <Button variant="ghost" onClick={handleShare} className="p-2">
              <Share2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {/* 封面图 */}
          {asset.cover && (
            <div className="w-full h-56 overflow-hidden relative">
              <img
                src={asset.cover}
                alt={asset.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="px-5 space-y-4">
            {/* 标题和价格 */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="rounded-none bg-blue-400 text-white font-normal text-[10px]">
                  {asset.typeName}
                </Badge>
                <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[10px]">
                  {asset.category}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{asset.title}</h1>
              {asset.subtitle && (
                <p className="text-[13px] text-[rgba(0,0,0,0.5)] mb-3">
                  {asset.subtitle}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-red-400">¥{asset.price}</span>
                {asset.originalPrice && (
                  <span className="text-sm text-[rgba(0,0,0,0.3)] line-through">
                    ¥{asset.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* 描述 */}
            <div>
              <h2 className="text-[13px] font-semibold text-gray-900 mb-2">详细介绍</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {asset.description || '暂无描述'}
              </p>
            </div>

            {/* 标签 */}
            {asset.tags && asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {asset.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 讲师信息 */}
            {asset.instructor && (
              <div className="p-4 bg-[rgba(0,0,0,0.02)]">
                <h2 className="text-[13px] font-semibold text-gray-900 mb-3">讲师介绍</h2>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={asset.instructor.avatar} alt={asset.instructor.name} />
                    <AvatarFallback>{asset.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-gray-900">
                      {asset.instructor.name}
                    </div>
                    <div className="text-[11px] text-[rgba(0,0,0,0.4)]">
                      {asset.instructor.title}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 购买按钮 */}
            <Button className="w-full" size="lg">
              立即购买
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
