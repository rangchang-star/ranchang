'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Eye, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 探访数据类型
interface Visit {
  id: string;
  title: string;
  theme: string;
  date: string;
  time: string;
  status: string;
  target: {
    name: string;
    title: string;
    company: string;
    avatar: string;
  };
  purpose: string;
  location: string;
  participants: number;
  rating: number;
  tags: string[];
  industry: string;
  duration: string;
  visitors: any[];
  record: string;
  audioDuration: string;
  audioUrl: string;
  image: string;
  mainImage: string;
  outcome: string;
  keyPoints: string[];
  nextSteps: string[];
  notes: string;
  images: string[];
  views: number;
  likes: number;
  createdAt: string;
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 从 API 加载探访数据
  useEffect(() => {
    async function loadVisits() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/admin/api/visits');

        if (!response.ok) {
          throw new Error('加载探访数据失败');
        }

        const data = await response.json();

        if (data.success) {
          setVisits(data.data);
        } else {
          throw new Error(data.error || '加载探访数据失败');
        }
      } catch (err: any) {
        console.error('加载探访数据失败:', err);
        setError(err.message || '加载探访数据失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadVisits();
  }, []);

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.target?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.target?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.purpose?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === '' || visit.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // 收集所有可用的标签，排除不需要显示的标签
  const excludedTags = ['人工智能', '企业管理', '在线培训', '投资', '设计', '已审核', '已发布', '在线教育'];
  const availableTags = Array.from(
    new Set(visits.flatMap((visit) => visit.tags))
  ).filter(tag => !excludedTags.includes(tag));

  // 按时间排序的探访列表
  const sortedVisits = [...filteredVisits].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // 切换排序
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">探访管理</h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">管理点亮页探访内容</p>
          </div>
          <Link href="/admin/visits/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加探访
            </Button>
          </Link>
        </div>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                placeholder="搜索探访对象、公司、目的..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="pl-10 text-[13px]"
              />
            </div>
          </div>

          {/* 标签筛选 */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-[13px] text-[rgba(0,0,0,0.6)]">标签筛选：</span>
            <button
              onClick={() => setSelectedTag('')}
              disabled={isLoading}
              className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                selectedTag === ''
                  ? 'bg-[rgba(59,130,246,0.4)] text-white'
                  : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
              }`}
            >
              全部
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                disabled={isLoading}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  selectedTag === tag
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-red-500">{error}</p>
          </div>
        )}

        {/* 探访列表 */}
        {!isLoading && !error && (
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-gray-900">
              探访列表（{sortedVisits.length}）
            </h3>
            <button
              onClick={toggleSortOrder}
              className="flex items-center space-x-1 text-[13px] text-[rgba(0,0,0,0.6)] hover:text-blue-600 transition-colors"
            >
              <span>按时间排序</span>
              {sortOrder === 'asc' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {sortedVisits.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无符合条件的探访记录</p>
              </div>
            ) : (
              sortedVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* 活动主图或探访对象头像 */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(0,0,0,0.05)]">
                      <Image
                        src={visit.mainImage || visit.image || visit.target.avatar}
                        alt={visit.theme || visit.title}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* 活动主题 */}
                      {visit.theme && (
                        <div className="mb-1">
                          <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                            {visit.theme}
                          </h3>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-[13px] font-medium text-gray-900">
                          {visit.target.name}
                        </h3>
                        <span className="text-[12px] text-[rgba(0,0,0,0.6)]">
                          {visit.target.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[12px] text-[rgba(0,0,0,0.6)] mb-2">
                        <span>{visit.target.company}</span>
                        <span>·</span>
                        <span>{visit.date}</span>
                        <span>·</span>
                        <span>{visit.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-wrap gap-2">
                          {visit.tags?.filter(tag => !excludedTags.includes(tag)).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-white text-[11px] font-normal"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link href={`/visit/${visit.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        预览
                      </Button>
                    </Link>
                    <Link href={`/admin/visits/${visit.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        编辑
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('确定要删除这条探访记录吗？')) {
                          // 实际项目中需要调用删除API
                          console.log('删除探访:', visit.id);
                        }
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
