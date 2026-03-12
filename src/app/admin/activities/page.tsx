'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, CheckCircle, XCircle, Download, ArrowUpDown, Search, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 活动数据类型
interface Activity {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  type: string;
  enrolled: number;
  max: number;
  tags: string[];
  status: string;
  pendingApplications: number;
  category: string;
  description: string;
  image: string;
  address: string;
  capacity: number;
  teaFee: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [timeSort, setTimeSort] = useState<'asc' | 'desc' | null>(null);

  // 从 API 加载活动数据
  useEffect(() => {
    async function loadActivities() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/admin/api/activities');

        if (!response.ok) {
          throw new Error('加载活动数据失败');
        }

        const data = await response.json();

        if (data.success) {
          setActivities(data.data);
        } else {
          throw new Error(data.error || '加载活动数据失败');
        }
      } catch (err: any) {
        console.error('加载活动数据失败:', err);
        setError(err.message || '加载活动数据失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadActivities();
  }, []);

  const filteredActivities = activities
    .filter((activity) => activity.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((activity) => {
      if (statusFilter === 'all') return true;
      return activity.status === statusFilter;
    })
    .sort((a, b) => {
      if (timeSort === null) return 0;
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return timeSort === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      private: '私董会',
      salon: '沙龙',
      ai: 'AI实战',
    };
    return labels[type] || type;
  };

  const handleExport = () => {
    if (filteredActivities.length === 0) {
      alert('没有数据可导出');
      return;
    }

    const headers = ['活动ID', '活动标题', '日期', '时间', '地点', '类型', '已报名', '最大人数', '报名率', '状态'];
    const rows = filteredActivities.map(activity => [
      activity.id,
      activity.title,
      activity.date,
      activity.time,
      activity.location,
      getTypeLabel(activity.type),
      activity.enrolled,
      activity.max,
      `${Math.round((activity.enrolled / activity.max) * 100)}%`,
      activity.status === 'active' ? '进行中' : '已结束',
    ]);

    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `活动数据_${new Date().toLocaleDateString('zh-CN')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm('确定要删除这个活动吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      const data = await response.json();
      if (data.success) {
        alert('活动已删除');
        // 重新加载活动列表
        const reloadResponse = await fetch('/admin/api/activities');
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json();
          if (reloadData.success) {
            setActivities(reloadData.data);
          }
        }
      } else {
        throw new Error(data.error || '删除失败');
      }
    } catch (error) {
      console.error('删除活动失败:', error);
      alert(error instanceof Error ? error.message : '删除失败');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">活动管理</h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">管理平台活动及报名</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </Button>
            <Link href="/admin/activities/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                发布活动
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                placeholder="搜索活动名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-[13px]"
              />
            </div>
          </div>
          
          {/* 标签筛选和排序 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[13px] text-[rgba(0,0,0,0.6)]">状态筛选：</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                进行中
              </button>
              <button
                onClick={() => setStatusFilter('ended')}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  statusFilter === 'ended'
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                已结束
              </button>
            </div>

            {/* 时间排序按钮 */}
            <button
              onClick={() => {
                if (timeSort === null) {
                  setTimeSort('desc');
                } else if (timeSort === 'desc') {
                  setTimeSort('asc');
                } else {
                  setTimeSort(null);
                }
              }}
              className={`px-3 py-1.5 text-[13px] font-normal transition-colors flex items-center space-x-1 ${
                timeSort !== null
                  ? 'bg-[rgba(59,130,246,0.4)] text-white'
                  : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{timeSort === 'asc' ? '时间↑' : timeSort === 'desc' ? '时间↓' : '时间排序'}</span>
            </button>
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

        {/* 活动列表 */}
        {!isLoading && !error && (
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900">
              活动列表（{filteredActivities.length}）
            </h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{activity.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-white text-[11px] font-normal">
                        {getTypeLabel(activity.type)}
                      </span>
                      {activity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-white text-[11px] font-normal"
                        >
                          {tag}
                        </span>
                      ))}
                      {activity.status === 'ended' && (
                        <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[11px] font-normal">
                          已结束
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/activities/${activity.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                    </Link>
                    <Link href={`/admin/activities/${activity.id}/registrations`}>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        报名
                        {activity.pendingApplications > 0 && (
                          <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-normal">
                            {activity.pendingApplications}
                          </span>
                        )}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-400 hover:bg-blue-50 hover:border-blue-500"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-[13px]">
                  <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                    <Calendar className="w-4 h-4" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                    <Clock className="w-4 h-4" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[rgba(0,0,0,0.6)]" />
                  <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                    已报名: <span className="text-gray-900 font-medium">{activity.enrolled}</span>
                    {' '} / {activity.max}
                  </span>
                  <div className="flex-1 bg-[rgba(0,0,0,0.05)] h-2">
                    <div
                      className="bg-blue-400 h-2"
                      style={{ width: `${(activity.enrolled / activity.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[rgba(0,0,0,0.6)]">
                    {Math.round((activity.enrolled / activity.max) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
