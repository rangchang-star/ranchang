'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Eye, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 探访数据类型
interface Visit {
  id: string;
  companyId: string;
  companyName: string;
  industry: string;
  location: string;
  description: string;
  date: string;
  time: string | null;
  capacity: number;
  registeredCount: number;
  coverImage: string | null;
  status: string;
  record: string | null;
  outcome: string | null;
  notes: string | null;
  keyPoints: string[] | null;
  nextSteps: string[] | null;
  rating: number | null;
  feedbackAudio: string | null;
  photos: string[] | null;
  participants: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  // 过滤和搜索
  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // 按时间排序
  const sortedVisits = [...filteredVisits].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // 切换排序
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // 删除探访记录
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条探访记录吗？删除后无法恢复！')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/visits/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      const data = await response.json();

      if (data.success) {
        setVisits(visits.filter((v) => v.id !== id));
        alert('删除成功');
      } else {
        throw new Error(data.error || '删除失败');
      }
    } catch (err: any) {
      console.error('删除失败:', err);
      alert(err.message || '删除失败');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: '草稿',
      upcoming: '即将开始',
      completed: '已完成',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600',
      upcoming: 'bg-blue-100 text-blue-600',
      completed: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-600';
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

        {/* 搜索 */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
            <Input
              placeholder="搜索公司名称、地点、行业..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className="pl-10 text-[13px]"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            disabled={isLoading}
          >
            {sortOrder === 'desc' ? (
              <ArrowDown className="w-4 h-4 mr-2" />
            ) : (
              <ArrowUp className="w-4 h-4 mr-2" />
            )}
            {sortOrder === 'desc' ? '最新' : '最早'}
          </Button>
        </div>

        {/* 列表内容 */}
        <div className="border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden">
          <div className="bg-[rgba(0,0,0,0.02)] px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <div className="grid grid-cols-12 gap-4 text-[12px] font-medium text-[rgba(0,0,0,0.6)]">
              <div className="col-span-3">公司名称</div>
              <div className="col-span-2">日期/时间</div>
              <div className="col-span-2">地点</div>
              <div className="col-span-1">状态</div>
              <div className="col-span-1">评分</div>
              <div className="col-span-2">参与人数</div>
              <div className="col-span-1 text-right">操作</div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-[13px] text-[rgba(0,0,0,0.6)]">
              加载中...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-[13px] text-red-400">
              {error}
            </div>
          ) : sortedVisits.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-[rgba(0,0,0,0.6)]">
              暂无探访记录
            </div>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.1)]">
              {sortedVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="px-4 py-3 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="text-[13px] font-medium text-gray-900 truncate">
                        {visit.companyName}
                      </div>
                      {visit.industry && (
                        <div className="text-[11px] text-[rgba(0,0,0,0.4)] truncate">
                          {visit.industry}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="text-[13px] text-gray-900">
                        {formatDate(visit.date)}
                      </div>
                      {visit.time && (
                        <div className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          {visit.time}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="text-[13px] text-gray-900 truncate">
                        {visit.location || '-'}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-[11px] ${getStatusColor(visit.status)}`}>
                        {getStatusText(visit.status)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      {visit.rating ? (
                        <div className="text-[13px] text-yellow-500">
                          {'★'.repeat(visit.rating)}
                        </div>
                      ) : (
                        <div className="text-[13px] text-[rgba(0,0,0,0.4)]">-</div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="text-[13px] text-gray-900">
                        {visit.participants || 0} 人
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end space-x-2">
                      <Link href={`/visit/${visit.id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/visits/${visit.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(visit.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
