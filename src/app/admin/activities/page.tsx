'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, CheckCircle, XCircle, Download, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

const mockActivities = [
  {
    id: '1',
    title: '转型期私董会',
    date: '2024-04-10',
    time: '14:00-17:00',
    location: '上海·静安',
    type: 'private',
    enrolled: 8,
    max: 12,
    tags: ['私董会', '名额紧张'],
    status: 'active',
    pendingApplications: 3,
  },
  {
    id: '2',
    title: '跨界沙龙：AI时代的商业创新',
    date: '2024-04-15',
    time: '19:00-21:00',
    location: '北京·朝阳',
    type: 'salon',
    enrolled: 20,
    max: 30,
    tags: ['跨界', 'AI'],
    status: 'active',
    pendingApplications: 5,
  },
  {
    id: '3',
    title: 'AI实战赋能营（第一期）',
    date: '2024-04-20',
    time: '09:00-17:00',
    location: '深圳·南山',
    type: 'ai',
    enrolled: 25,
    max: 30,
    tags: ['AI实战', '工作坊'],
    status: 'active',
    pendingApplications: 2,
  },
  {
    id: '4',
    title: '数字化转型分享会',
    date: '2024-03-15',
    time: '14:00-16:00',
    location: '线上',
    type: 'salon',
    enrolled: 45,
    max: 50,
    tags: ['已结束'],
    status: 'ended',
    pendingApplications: 0,
  },
];

const mockApplications = [
  {
    id: 'app-1',
    activityId: '1',
    userName: '张三',
    userPhone: '138****1234',
    userCompany: '某科技公司',
    userPosition: 'CEO',
    reason: '希望参与私董会，获得更多创业指导',
    status: 'pending',
    applyTime: '2024-04-05 10:30',
  },
  {
    id: 'app-2',
    activityId: '1',
    userName: '李四',
    userPhone: '139****5678',
    userCompany: '某制造企业',
    userPosition: '总经理',
    reason: '数字化转型需要同行交流',
    status: 'pending',
    applyTime: '2024-04-05 14:20',
  },
  {
    id: 'app-3',
    activityId: '1',
    userName: '王五',
    userPhone: '137****9012',
    userCompany: '某咨询公司',
    userPosition: '合伙人',
    reason: '了解最新AI应用趋势',
    status: 'pending',
    applyTime: '2024-04-06 09:15',
  },
  {
    id: 'app-4',
    activityId: '2',
    userName: '赵六',
    userPhone: '136****3456',
    userCompany: '某创业公司',
    userPosition: '创始人',
    reason: '拓展人脉资源',
    status: 'approved',
    applyTime: '2024-04-01 11:00',
  },
];

export default function AdminActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [timeSort, setTimeSort] = useState<'asc' | 'desc' | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState(mockApplications);

  const filteredActivities = mockActivities
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

  const filteredApplications = selectedActivity
    ? applications.filter((app) => app.activityId === selectedActivity)
    : applications.filter((app) => app.status === 'pending');

  const addNotification = (notification: any) => {
    try {
      const stored = localStorage.getItem('notifications');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('notifications', JSON.stringify([notification, ...existing]));
    } catch (error) {
      console.error('保存通知失败:', error);
    }
  };

  const handleApprove = (applicationId: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: 'approved' as const } : app
    );
    setApplications(updatedApplications);

    const app = applications.find(a => a.id === applicationId);
    const activity = mockActivities.find(a => a.id === app?.activityId);

    updateLocalStorage(applicationId, 'approved');

    addNotification({
      id: `approval-${Date.now()}`,
      type: 'success',
      title: '报名审核通过',
      message: `您报名的「${activity?.title || '活动'}」已通过审核，请按时参加`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      actionUrl: `/activity/${app?.activityId}`,
    });

    alert('已通过申请');
  };

  const handleReject = (applicationId: string) => {
    if (!confirm('确定要拒绝此申请吗？')) return;

    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: 'rejected' as const } : app
    );
    setApplications(updatedApplications);

    const app = applications.find(a => a.id === applicationId);
    const activity = mockActivities.find(a => a.id === app?.activityId);

    updateLocalStorage(applicationId, 'rejected');

    addNotification({
      id: `rejection-${Date.now()}`,
      type: 'error',
      title: '报名审核未通过',
      message: `您报名的「${activity?.title || '活动'}」未通过审核，如有疑问请联系客服`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
    });

    alert('已拒绝申请');
  };

  const updateLocalStorage = (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const storedActivities = localStorage.getItem('activities');
      if (storedActivities) {
        const activities = JSON.parse(storedActivities);
        const app = applications.find(a => a.id === applicationId);
        if (app) {
          const activity = activities.find((a: any) => a.id === app.activityId);
          if (activity) {
            if (!activity.applications) {
              activity.applications = [];
            }
            const existingApp = activity.applications.find((a: any) => a.id === applicationId);
            if (existingApp) {
              existingApp.status = status;
            }
            localStorage.setItem('activities', JSON.stringify(activities));
          }
        }
      }
    } catch (error) {
      console.error('更新localStorage失败:', error);
    }
  };

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
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              发布活动
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1 max-w-md">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
            <Input
              placeholder="搜索活动..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 快捷搜索按钮 */}
          <div className="flex items-center space-x-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={
                statusFilter === 'all'
                  ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border-blue-400'
                  : ''
              }
            >
              全部
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
              className={
                statusFilter === 'active'
                  ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border-blue-400'
                  : ''
              }
            >
              进行中
            </Button>
            <Button
              variant={statusFilter === 'ended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('ended')}
              className={
                statusFilter === 'ended'
                  ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border-blue-400'
                  : ''
              }
            >
              已结束
            </Button>
          </div>

          {/* 时间排序按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (timeSort === null) {
                setTimeSort('desc');
              } else if (timeSort === 'desc') {
                setTimeSort('asc');
              } else {
                setTimeSort(null);
              }
            }}
            className={
              timeSort !== null
                ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border-blue-400'
                : ''
            }
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            {timeSort === 'asc' ? '时间↑' : timeSort === 'desc' ? '时间↓' : '时间排序'}
          </Button>
        </div>

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
                      <span className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal">
                        {getTypeLabel(activity.type)}
                      </span>
                      {activity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal"
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
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedActivity(activity.id);
                        setShowApplications(true);
                      }}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      报名
                      {activity.pendingApplications > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-normal">
                          {activity.pendingApplications}
                        </span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-400 hover:bg-blue-50 hover:border-blue-500">
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
                    <Calendar className="w-4 h-4" />
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

        {showApplications && (
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-gray-900">
                  {selectedActivity
                    ? `报名审核 - ${mockActivities.find(a => a.id === selectedActivity)?.title}`
                    : '待审核申请'}
                  <span className="ml-2 px-2 py-0.5 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal">
                    {filteredApplications.length}条
                  </span>
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowApplications(false);
                    setSelectedActivity(null);
                  }}
                >
                  关闭
                </Button>
              </div>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-[15px] font-semibold text-gray-900">{application.userName}</h3>
                        <span className={`px-2 py-0.5 text-[11px] font-normal ${
                          application.status === 'pending'
                            ? 'bg-[rgba(59,130,246,0.4)] text-blue-600'
                            : application.status === 'approved'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {application.status === 'pending' ? '待审核' : application.status === 'approved' ? '已通过' : '已拒绝'}
                        </span>
                      </div>
                      <div className="text-[13px] text-[rgba(0,0,0,0.6)] space-y-1">
                        <p>电话: {application.userPhone}</p>
                        <p>公司: {application.userCompany}</p>
                        <p>职位: {application.userPosition}</p>
                        <p>申请时间: {application.applyTime}</p>
                      </div>
                      <div className="mt-2 p-2 bg-[rgba(0,0,0,0.02)] text-[13px]">
                        <span className="font-medium text-gray-900">申请理由: </span>
                        <span className="text-[rgba(0,0,0,0.6)]">{application.reason}</span>
                      </div>
                    </div>
                  </div>
                  {application.status === 'pending' && (
                    <div className="flex items-center justify-end space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(application.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        拒绝
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(application.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        通过
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="text-center py-8 text-[rgba(0,0,0,0.6)] text-[13px]">
                  暂无申请记录
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
