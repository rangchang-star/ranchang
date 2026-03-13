'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Search, Edit, Eye, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 活动数据类型
interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  type: string;
  status: string;
  registeredCount: number;
  createdAt: string;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // 从 API 加载活动数据
  useEffect(() => {
    async function loadActivities() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/activities');

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

  let filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || activity.status === statusFilter;
    const matchesType = typeFilter === '' || activity.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // 状态映射（与数据库枚举一致）
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-gray-100 text-gray-600' },
    published: { label: '报名中', color: 'bg-blue-100 text-blue-600' },
    ended: { label: '已结束', color: 'bg-gray-100 text-gray-600' },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-600' },
  };

  // 类型映射
  const typeMap: Record<string, { label: string; color: string }> = {
    salon: { label: '沙龙', color: 'bg-purple-100 text-purple-600' },
    workshop: { label: '工作坊', color: 'bg-blue-100 text-blue-600' },
    visit: { label: '探访', color: 'bg-green-100 text-green-600' },
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">活动管理</h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">管理平台活动和报名</p>
          </div>
          <Link href="/admin/activities/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              创建活动
            </Button>
          </Link>
        </div>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <input
                type="text"
                placeholder="搜索活动名称、地点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:bg-[rgba(0,0,0,0.04)] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:bg-[rgba(0,0,0,0.04)] transition-colors"
            >
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="published">报名中</option>
              <option value="ended">已结束</option>
              <option value="cancelled">已取消</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:bg-[rgba(0,0,0,0.04)] transition-colors"
            >
              <option value="">全部类型</option>
              <option value="salon">沙龙</option>
              <option value="workshop">工作坊</option>
              <option value="visit">探访</option>
            </select>
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
        {!isLoading && !error && filteredActivities.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无活动数据</p>
          </div>
        )}

        {!isLoading && !error && filteredActivities.length > 0 && (
          <div className="space-y-3">
            {filteredActivities.map((activity) => {
              const statusInfo = statusMap[activity.status] || statusMap.draft;
              const typeInfo = typeMap[activity.type] || typeMap.salon;

              return (
                <div
                  key={activity.id}
                  className="p-4 bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                          {activity.title}
                        </h3>
                        <span className={`px-2 py-1 text-[11px] rounded-full ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span className={`px-2 py-1 text-[11px] rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-[13px] text-[rgba(0,0,0,0.6)] mb-2 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-4 text-[12px] text-[rgba(0,0,0,0.4)]">
                        <span>📍 {activity.location}</span>
                        <span>📅 {activity.date}</span>
                        <span>👥 {activity.registeredCount}/{activity.capacity}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/admin/activities/${activity.id}/registrations`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          报名
                        </Button>
                      </Link>
                      <Link href={`/admin/activities/${activity.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          编辑
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
