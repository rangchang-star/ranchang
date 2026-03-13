'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, Clock, MapPin, CheckCircle, XCircle, Clock as ClockIcon, Search, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 活动信息类型
interface ActivityInfo {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  capacity: number;
  teaFee: number;
  startDate: string;
  endDate: string;
  address: string;
}

// 报名信息类型
interface Registration {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userCompany: string;
  userPosition: string;
  userAvatar: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  registeredAt: string;
}

// 统计信息类型
interface Statistics {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  completed: number;
}

export default function ActivityRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [activityId, setActivityId] = useState<string>('');

  useEffect(() => {
    async function loadActivityId() {
      const resolvedParams = await params;
      setActivityId(resolvedParams.id);
    }
    loadActivityId();
  }, [params]);

  useEffect(() => {
    if (!activityId) return;

    async function loadRegistrations() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/admin/api/activities/${activityId}/registrations`);

        if (!response.ok) {
          throw new Error('加载报名信息失败');
        }

        const data = await response.json();

        if (data.success) {
          setActivityInfo(data.data.activity);
          setRegistrations(data.data.registrations);
          setStatistics(data.data.statistics);
        } else {
          throw new Error(data.error || '加载报名信息失败');
        }
      } catch (err: any) {
        console.error('加载报名信息失败:', err);
        setError(err.message || '加载报名信息失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadRegistrations();
  }, [activityId]);

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (registrationId: string) => {
    if (!confirm('确定要通过该报名申请吗？')) return;

    try {
      const response = await fetch(`/admin/api/activities/${activityId}/registrations/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: registrationId,
          status: 'approved',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '审核失败');
      }

      const updatedRegistrations = registrations.map((reg) =>
        reg.userId === registrationId ? { ...reg, status: 'approved' as const } : reg
      );
      setRegistrations(updatedRegistrations);
      alert('已通过该报名申请');
    } catch (error: any) {
      console.error('审核失败:', error);
      alert(error.message || '审核失败');
    }
  };

  const handleReject = async (registrationId: string) => {
    if (!confirm('确定要拒绝该报名申请吗？')) return;

    try {
      const response = await fetch(`/admin/api/activities/${activityId}/registrations/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: registrationId,
          status: 'rejected',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '审核失败');
      }

      const updatedRegistrations = registrations.map((reg) =>
        reg.userId === registrationId ? { ...reg, status: 'rejected' as const } : reg
      );
      setRegistrations(updatedRegistrations);
      alert('已拒绝该报名申请');
    } catch (error: any) {
      console.error('审核失败:', error);
      alert(error.message || '审核失败');
    }
  };

  const handleExport = () => {
    if (filteredRegistrations.length === 0) {
      alert('没有数据可导出');
      return;
    }

    const headers = ['用户ID', '姓名', '手机号', '公司', '职位', '报名状态', '报名时间'];
    const statusMap = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      completed: '已完成',
    };
    const rows = filteredRegistrations.map(reg => [
      reg.userId,
      reg.userName,
      reg.userPhone,
      reg.userCompany,
      reg.userPosition,
      statusMap[reg.status],
      new Date(reg.registeredAt).toLocaleString('zh-CN'),
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
    link.setAttribute('download', `${activityInfo?.title || '活动'}_报名名单_${new Date().toLocaleDateString('zh-CN')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: '待审核',
        className: 'bg-yellow-100 text-yellow-800',
        icon: ClockIcon,
      },
      approved: {
        label: '已通过',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      rejected: {
        label: '已拒绝',
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
      completed: {
        label: '已完成',
        className: 'bg-blue-100 text-blue-800',
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/activities">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 mb-1">报名管理</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                {activityInfo?.title || '加载中...'}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出名单
          </Button>
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
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
              返回
            </Button>
          </div>
        )}

        {/* 内容 */}
        {!isLoading && !error && activityInfo && (
          <>
            {/* 活动信息 */}
            <div className="border border-[rgba(0,0,0,0.1)] p-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3">活动信息</h3>
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(activityInfo.startDate).split(' ')[0]}</span>
                </div>
                <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDate(activityInfo.startDate).split(' ')[1]} - {formatDate(activityInfo.endDate).split(' ')[1]}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                  <MapPin className="w-4 h-4" />
                  <span>{activityInfo.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                  <Users className="w-4 h-4" />
                  <span>
                    容量: {statistics?.approved || 0} / {activityInfo.capacity}
                  </span>
                </div>
              </div>
            </div>

            {/* 统计信息 */}
            {statistics && (
              <div className="grid grid-cols-4 gap-4">
                <div className="border border-[rgba(0,0,0,0.1)] p-4">
                  <div className="text-[24px] font-bold text-gray-900 mb-1">{statistics.total}</div>
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">总报名</div>
                </div>
                <div className="border border-[rgba(0,0,0,0.1)] p-4">
                  <div className="text-[24px] font-bold text-green-600 mb-1">{statistics.approved}</div>
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">已通过</div>
                </div>
                <div className="border border-[rgba(0,0,0,0.1)] p-4">
                  <div className="text-[24px] font-bold text-yellow-600 mb-1">{statistics.pending}</div>
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">待审核</div>
                </div>
                <div className="border border-[rgba(0,0,0,0.1)] p-4">
                  <div className="text-[24px] font-bold text-red-600 mb-1">{statistics.rejected}</div>
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">已拒绝</div>
                </div>
              </div>
            )}

            {/* 筛选和搜索 */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
                <input
                  placeholder="搜索姓名、公司、手机号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[rgba(0,0,0,0.1)] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[13px] text-[rgba(0,0,0,0.6)]">状态筛选：</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                  }`}
                >
                  待审核
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                    statusFilter === 'approved'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                  }`}
                >
                  已通过
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                    statusFilter === 'rejected'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                  }`}
                >
                  已拒绝
                </button>
              </div>
            </div>

            {/* 报名列表 */}
            <div className="border border-[rgba(0,0,0,0.1)]">
              <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <h3 className="text-[13px] font-semibold text-gray-900">
                  报名列表（{filteredRegistrations.length}）
                </h3>
              </div>
              {filteredRegistrations.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-[rgba(0,0,0,0.3)] mb-4" />
                  <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无符合条件的报名记录</p>
                </div>
              ) : (
                <div className="divide-y divide-[rgba(0,0,0,0.05)]">
                  {filteredRegistrations.map((registration) => (
                    <div
                      key={registration.userId}
                      className="p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <img
                            src={registration.userAvatar}
                            alt={registration.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-[15px] font-semibold text-gray-900">
                                {registration.userName}
                              </h4>
                              {getStatusBadge(registration.status)}
                            </div>
                            <div className="space-y-1 text-[13px] text-[rgba(0,0,0,0.6)]">
                              <p>{registration.userCompany} · {registration.userPosition}</p>
                              <p>{registration.userPhone}</p>
                              <p className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>报名时间：{formatDate(registration.registeredAt)}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        {registration.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-400 hover:bg-green-50 hover:border-green-500"
                              onClick={() => handleApprove(registration.userId)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              通过
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-400 hover:bg-red-50 hover:border-red-500"
                              onClick={() => handleReject(registration.userId)}
                            >
                              <XCircle className="w-4 h-4" />
                              拒绝
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
