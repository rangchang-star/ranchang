'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Calendar, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/bottom-nav';
import { useState, useEffect } from 'react';

interface AbilityData {
  id: string;
  name: string;
  age: number;
  avatar: string;
  industry: string;
  location: string;
  tagStamp: string;
  need: string;
  bio?: string;
  resources?: string[];
  hardcore_tags?: string[];
  company?: string;
  position?: string;
  description: string;
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
  }>;
  skills?: string[];
  achievements?: string[];
  isTrusted: boolean;
}

export default function AbilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [person, setPerson] = useState<AbilityData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 从 API 获取用户数据
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();

        if (data.success) {
          setPerson(data.data);
        } else {
          setError(data.error || '加载失败');
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-14">
        <div className="w-full max-w-md mx-auto px-5 pt-6">
          <div className="text-center text-gray-500 py-20">
            加载中...
          </div>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-white pb-14">
        <div className="w-full max-w-md mx-auto px-5 pt-6">
          <Link href="/discovery">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
          </Link>
          <div className="mt-8 text-center text-gray-500">
            {error || '未找到该用户信息'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-14">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="px-5 pt-6 pb-4 border-b border-[rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <Link href="/discovery">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 用户信息卡片 */}
        <div className="px-5 py-6">
          <div className="flex items-start space-x-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={person.avatar || ''} alt={person.name} />
              <AvatarFallback>{person.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{person.name}</h1>
                {person.isTrusted && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    已认证
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{person.age}岁</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{person.industry}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {person.resources?.map((resource, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {resource}
              </Badge>
            ))}
          </div>

          {/* 描述 */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">个人简介</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {person.bio || person.description || '暂无简介'}
            </p>
          </div>

          {/* 需求 */}
          {person.need && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">当前需求</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {person.need}
              </p>
            </div>
          )}

          {/* 硬核标签 */}
          {person.hardcore_tags && person.hardcore_tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">核心能力</h2>
              <div className="flex flex-wrap gap-2">
                {person.hardcore_tags.map((tag: string, index: number) => (
                  <Badge key={index} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 公司和职位 */}
          {(person.company || person.position) && (
            <div className="mb-6 p-4 bg-[rgba(0,0,0,0.02)]">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">职业信息</h2>
              {person.company && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">公司：</span>{person.company}
                </p>
              )}
              {person.position && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">职位：</span>{person.position}
                </p>
              )}
            </div>
          )}

          {/* 联系按钮 */}
          <Button className="w-full mt-6" onClick={() => alert('联系功能开发中')}>
            联系对方
          </Button>
        </div>

        {/* 底部导航 */}
        <BottomNav />
      </div>
    </div>
  );
}
