'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, Tag, Star, Users } from 'lucide-react';
import Link from 'next/link';

type ResourceItem = {
  id: string;
  userId: string;
  type: string;
  subtype: string;
  direction: string;
  text: string;
  summary: string;
  audioUrl: string | null;
  views: number;
  isFeatured: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  name: string;
  avatar: string | null;
  city: string | null;
  industry: string | null;
  role: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function DiscoveryPage() {
  const [featuredItems, setFeaturedItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Map<string, User>>(new Map());

  // 加载资源现货数据
  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        // 调用 declarations-featured API
        const response = await fetch('/api/declarations-featured');
        if (!response.ok) {
          throw new Error('获取资源现货失败');
        }
        const result = await response.json();
        const data: ResourceItem[] = result.data || [];
        setFeaturedItems(data);

        // 收集用户ID
        const userIds = [...new Set(data.map(item => item.userId))];

        // 批量获取用户信息
        if (userIds.length > 0) {
          const userResponse = await fetch(`/api/users?ids=${userIds.join(',')}`);
          if (userResponse.ok) {
            const userData: User[] = await userResponse.json();
            const userMap = new Map(userData.map(user => [user.id, user]));
            setUsers(userMap);
          }
        }
      } catch (error) {
        console.error('加载资源现货失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  // 获取子类型标签
  const getSubtypeLabel = (subtype: string) => {
    const labels: Record<string, string> = {
      ability: '能力现货',
      connection: '人脉现货',
      resource: '资源现货',
    };
    return labels[subtype] || '资源现货';
  };

  // 获取子类型图标
  const getSubtypeIcon = (subtype: string) => {
    switch (subtype) {
      case 'ability':
        return <Tag className="w-4 h-4 text-amber-500" />;
      case 'connection':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 头部区域 */}
      <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">发现</h1>
              <span className="text-gray-400 text-sm">探索创业资源与机会</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索资源现货..."
                  className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4" />
                <span>筛选</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* 资源现货板块 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span>资源现货</span>
            </h2>
            <Link href="/declarations" className="text-blue-400 hover:text-blue-300 text-sm">
              查看全部 →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-400">加载中...</div>
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="bg-gray-800/30 rounded-lg p-8 text-center border border-gray-700">
              <p className="text-gray-400">暂无资源现货数据</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => {
                const user = users.get(item.userId);
                return (
                  <div
                    key={item.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start space-x-4">
                      {/* 排序号 */}
                      <div className="text-2xl font-bold text-blue-400 min-w-[2rem]">
                        {1}
                      </div>

                      {/* 头像 */}
                      <Link href={`/user/${item.userId}`} className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      </Link>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        {/* 用户信息 */}
                        <div className="flex items-center space-x-2 mb-2">
                          <Link
                            href={`/user/${item.userId}`}
                            className="font-semibold text-white hover:text-blue-400 transition-colors"
                          >
                            {user?.name || '未知用户'}
                          </Link>
                          {user?.city && (
                            <span className="text-gray-500 text-sm">· {user.city}</span>
                          )}
                        </div>

                        {/* 资源标签 */}
                        <div className="flex items-center space-x-2 mb-3">
                          {getSubtypeIcon(item.subtype)}
                          <span className="text-sm text-gray-400">
                            {getSubtypeLabel(item.subtype)}
                          </span>
                        </div>

                        {/* 文本摘要 */}
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                          {item.summary || item.text}
                        </p>

                        {/* 底部信息 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{item.date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{item.views} 次浏览</span>
                            </span>
                          </div>
                          {item.audioUrl && (
                            <span className="flex items-center space-x-1 text-blue-400">
                              <Clock className="w-3 h-3" />
                              <span>音频</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 其他板块占位 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-500" />
            <span>活跃创业者</span>
          </h2>
          <div className="bg-gray-800/30 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">更多内容敬请期待...</p>
          </div>
        </section>
      </div>
    </div>
  );
}
