'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock, X, Bell, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// 通知类型定义
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// 活动类型定义
interface Activity {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  enrolled: number;
  max: number;
  tags: string[];
  status: string;
  applicationStatus: 'approved' | 'pending' | 'none' | undefined;
  description: string;
  image: string;
}

const filters = [
  { id: 'all', label: '全部活动' },
  { id: 'upcoming', label: '待参加' },
  { id: 'ended', label: '已结束' },
  { id: 'pending', label: '待审核' },
];

export default function ActivitiesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [activityToApply, setActivityToApply] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 从 API 加载活动数据
  useEffect(() => {
    async function loadActivities() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/activities');

        if (!response.ok) {
          throw new Error('加载活动列表失败');
        }

        const data = await response.json();

        if (data.success) {
          // 将 API 数据转换为前端需要的格式
          const formattedActivities = data.data.map((activity: any) => ({
            id: activity.id.toString(),
            type: activity.category || 'private',
            title: activity.title,
            date: activity.start_date ? new Date(activity.start_date).toISOString().split('T')[0] : '',
            time: activity.start_date && activity.end_date
              ? `${new Date(activity.start_date).getHours()}:${String(new Date(activity.start_date).getMinutes()).padStart(2, '0')}-${new Date(activity.end_date).getHours()}:${String(new Date(activity.end_date).getMinutes()).padStart(2, '0')}`
              : '14:00-17:00',
            location: activity.address?.split('·')[0] || '上海',
            address: activity.address || '',
            enrolled: 0,
            max: activity.capacity || 12,
            tags: [activity.category === 'private' ? '私董会' : activity.category],
            status: activity.status === 'published' ? 'ongoing' : 'ended',
            applicationStatus: 'none' as 'approved' | 'pending' | 'none',
            description: activity.description,
            image: activity.image || '',
          }));

          setActivities(formattedActivities);
        } else {
          throw new Error(data.error || '加载活动列表失败');
        }
      } catch (err: any) {
        console.error('加载活动列表失败:', err);
        setError(err.message || '加载活动列表失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadActivities();
  }, []);

  // 添加通知（从 API 创建）
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  // 标记通知为已读（前端本地状态，不再保存到 localStorage）
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // 获取通知图标
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredActivities = (() => {
    switch (selectedFilter) {
      case 'upcoming':
        return activities.filter((a) => a.status === 'ongoing' && a.applicationStatus === 'approved');
      case 'ended':
        return activities.filter((a) => a.status === 'ended');
      case 'pending':
        return activities.filter((a) => a.applicationStatus === 'pending');
      default:
        return activities;
    }
  })();

  const handleApply = (activity: Activity) => {
    setActivityToApply(activity);
    setShowApplyConfirm(true);
  };

  const confirmApply = async () => {
    if (!activityToApply) return;

    if (sessionStorage.getItem('activity-applying') === 'true') {
      alert('正在报名中，请勿重复提交');
      return;
    }
    sessionStorage.setItem('activity-applying', 'true');

    try {
      const response = await fetch('/api/activities/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId: activityToApply.id }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedActivities = activities.map((a) =>
          a.id === activityToApply.id
            ? { ...a, applicationStatus: 'pending' as const, enrolled: a.enrolled + 1 }
            : a
        );
        setActivities(updatedActivities);
        setShowApplyConfirm(false);
        setActivityToApply(null);
        addNotification({
          id: `apply-${Date.now()}`,
          type: 'success',
          title: '报名成功',
          message: `您已成功报名「${activityToApply.title}」，等待审核`,
          time: new Date().toLocaleString('zh-CN'),
          read: false,
        });
      } else {
        alert(data.error || '报名失败');
      }
    } catch (error) {
      console.error('报名失败:', error);
      alert('报名失败，请稍后重试');
    } finally {
      sessionStorage.removeItem('activity-applying');
    }
  };

  const handleCancel = async (activity: Activity) => {
    if (!confirm(`确定要取消报名「${activity.title}」吗？`)) return;

    if (sessionStorage.getItem('activity-canceling') === 'true') {
      alert('正在取消中，请勿重复操作');
      return;
    }
    sessionStorage.setItem('activity-canceling', 'true');

    try {
      const updatedActivities = activities.map((a) =>
        a.id === activity.id
          ? { ...a, applicationStatus: undefined, enrolled: Math.max(0, a.enrolled - 1) }
          : a
      );
      setActivities(updatedActivities);
      addNotification({
        id: `cancel-${Date.now()}`,
        type: 'info',
        title: '报名已取消',
        message: `您已取消「${activity.title}」的报名`,
        time: new Date().toLocaleString('zh-CN'),
        read: false,
      });
    } catch (error) {
      console.error('取消报名失败:', error);
      alert('取消报名失败，请稍后重试');
    } finally {
      sessionStorage.removeItem('activity-canceling');
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
            <h1 className="text-[15px] font-semibold text-gray-900">参与活动</h1>
            <Link href="/notifications" className="relative">
              <Button variant="ghost" className="p-2">
                <Bell className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* Slogan */}
          <div className="py-2">
            <p className="text-[13px] font-bold text-blue-400 leading-relaxed">
              让不同的人，碰撞出可能的火花
            </p>
          </div>

          {/* 筛选标签 */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
            {filters.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 text-[13px] font-normal whitespace-nowrap transition-colors ${
                  selectedFilter === tab.id
                    ? 'bg-[rgba(59,130,246,0.4)] text-blue-600'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 活动列表 */}
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {isLoading ? (
              <div className="py-10 text-center text-gray-400">
                加载中...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-400">
                {error}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                暂无活动
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="py-5 space-y-4">
                  {/* 活动图片 */}
                  {activity.image && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 活动标题 */}
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                      {activity.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activity.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 活动信息 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activity.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activity.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                        {activity.enrolled}/{activity.max}人
                      </span>
                    </div>
                  </div>

                  {/* 活动状态 */}
                  <div>
                    {activity.status === 'ended' ? (
                      <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.4)] text-[11px] font-normal">
                        已结束
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal">
                        进行中
                      </span>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-2">
                    {activity.status === 'ended' ? (
                      <Button
                        variant="outline"
                        className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        查看详情
                      </Button>
                    ) : activity.applicationStatus === 'none' ? (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          查看详情
                        </Button>
                        <Button
                          className="flex-1 bg-blue-400 hover:bg-blue-500 h-10 text-[13px] font-normal"
                          onClick={() => handleApply(activity)}
                        >
                          立即报名
                        </Button>
                      </>
                    ) : activity.applicationStatus === 'pending' ? (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          查看详情
                        </Button>
                        <div className="flex-1 flex items-center justify-center bg-[rgba(251,191,36,0.15)] text-yellow-600 text-[13px] h-10">
                          待审核
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          查看详情
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 h-10 text-[13px] font-normal"
                          onClick={() => handleCancel(activity)}
                        >
                          取消报名
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 活动详情悬浮窗口 */}
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className="w-[95%] max-w-[480px] max-h-[85vh] overflow-y-auto p-0">
          <VisuallyHidden>
            <DialogTitle>活动详情</DialogTitle>
          </VisuallyHidden>
          {selectedActivity && (
            <>
              {/* 活动图片 */}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={selectedActivity.image}
                  alt={selectedActivity.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 活动内容 */}
              <div className="p-5 space-y-4">
                {/* 标题和标签 */}
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900 mb-2">
                    {selectedActivity.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 活动描述 */}
                <div>
                  <p className="text-[13px] text-[rgba(0,0,0,0.6)] leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>

                {/* 活动信息 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{selectedActivity.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{selectedActivity.time}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{selectedActivity.location}</span>
                      {selectedActivity.address && (
                        <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">{selectedActivity.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                    <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                      {selectedActivity.enrolled}/{selectedActivity.max}人
                    </span>
                  </div>
                </div>

                {/* 活动状态 */}
                <div>
                  {selectedActivity.status === 'ended' ? (
                    <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.4)] text-[11px] font-normal">
                      已结束
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal">
                      进行中
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 报名确认弹窗 */}
      <Dialog open={showApplyConfirm} onOpenChange={setShowApplyConfirm}>
        <DialogContent className="w-[95%] max-w-[480px] p-6">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold text-gray-900">
              确认报名
            </DialogTitle>
          </DialogHeader>
          {activityToApply && (
            <div className="space-y-4">
              <p className="text-[13px] text-[rgba(0,0,0,0.3)]">
                确定要报名参加以下活动吗？
              </p>
              <div className="p-4 bg-[rgba(0,0,0,0.03)] space-y-2">
                <h3 className="text-[15px] font-semibold text-gray-900">
                  {activityToApply.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[rgba(0,0,0,0.4)]" />
                  <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activityToApply.date}</span>
                  <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activityToApply.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[rgba(0,0,0,0.4)]" />
                  <span className="text-[13px] text-[rgba(0,0,0,0.6)]">{activityToApply.location}</span>
                </div>
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                报名后需要等待管理员审核，审核通过后会显示在"待参加"列表中。
              </p>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)] h-10 text-[13px] font-normal"
                  onClick={() => setShowApplyConfirm(false)}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 bg-blue-400 hover:bg-blue-500 h-10 text-[13px] font-normal"
                  onClick={confirmApply}
                >
                  确认报名
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
