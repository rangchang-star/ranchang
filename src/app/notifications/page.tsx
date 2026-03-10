'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// 通知类型定义
interface Notification {
  id: string;
  type: 'activity' | 'follow' | 'comment' | 'like' | 'system' | 'message' | 'promotion' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  content: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

// 从localStorage加载通知或使用默认数据
const loadNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return mockNotifications;
  try {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : mockNotifications;
  } catch {
    return mockNotifications;
  }
};

// 模拟数据（作为备用）
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'activity',
    title: '活动提醒',
    content: '您报名的"AI时代创业者论坛"将于明天14:00开始',
    time: '10分钟前',
    read: false,
    actionUrl: '/activity/1',
  },
  {
    id: '2',
    type: 'follow',
    title: '新关注',
    content: '张总关注了您',
    time: '30分钟前',
    read: false,
    actionUrl: '/connection/zhang-zong',
  },
  {
    id: '3',
    type: 'comment',
    title: '新评论',
    content: '王姐评论了您的宣告："非常受启发，期待更多分享"',
    time: '1小时前',
    read: false,
    actionUrl: '/declaration/1',
  },
  {
    id: '4',
    type: 'like',
    title: '新的喜欢',
    content: '李总喜欢了您的宣告"用AI重塑传统制造业"',
    time: '2小时前',
    read: true,
    actionUrl: '/declaration/1',
  },
  {
    id: '5',
    type: 'system',
    title: '系统通知',
    content: '您的创业心理评估报告已生成，点击查看详细结果',
    time: '3小时前',
    read: true,
    actionUrl: '/assessment/entrepreneurial-psychology/result',
  },
  {
    id: '6',
    type: 'message',
    title: '新消息',
    content: '陈总给您发送了消息："想请教一下供应链管理的问题"',
    time: '昨天',
    read: true,
    actionUrl: '/messages/chen-zong',
  },
  {
    id: '7',
    type: 'activity',
    title: '活动结束',
    content: '您参加的"35+创业者闭门会"已圆满结束',
    time: '2天前',
    read: true,
    actionUrl: '/activity/2',
  },
  {
    id: '8',
    type: 'promotion',
    title: '限时优惠',
    content: '燃场VIP会员限时8折，仅剩3天！',
    time: '3天前',
    read: true,
    actionUrl: '/membership',
  },
];

const filterOptions = [
  { id: 'all', name: '全部' },
  { id: 'unread', name: '未读' },
  { id: 'follow', name: '关注' },
  { id: 'activity', name: '活动' },
  { id: 'system', name: '系统' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications());
  const [selectedFilter, setSelectedFilter] = useState('all');

  // 更新通知状态并保存到localStorage
  const updateNotificationState = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    try {
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('保存通知失败:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    updateNotificationState(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    updateNotificationState(updated);
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    updateNotificationState(updated);
  };

  const getFilteredNotifications = () => {
    if (selectedFilter === 'all') {
      return notifications;
    }
    if (selectedFilter === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    return notifications.filter((n) => n.type === selectedFilter);
  };

  const filteredNotifications = getFilteredNotifications();

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
            <div className="flex items-center space-x-2">
              <h1 className="text-[15px] font-semibold text-gray-900">消息通知</h1>
              {unreadCount > 0 && (
                <Badge className="rounded-none bg-red-400 text-white font-normal text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                onClick={handleMarkAllAsRead}
                className="p-2"
                title="全部已读"
              >
                <CheckCheck className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="px-5 py-3 overflow-x-auto">
          <div className="flex space-x-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`px-4 py-1.5 text-[11px] whitespace-nowrap border ${
                  selectedFilter === option.id
                    ? 'border-blue-400 bg-blue-400 bg-opacity-10 text-blue-400'
                    : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* 通知列表 */}
        <div className="px-5">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              {filteredNotifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.actionUrl || '#'}
                  className="block p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* 未读指示器 */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    )}

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-[13px] font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            )}
                          </div>
                          <p className="text-[11px] text-[rgba(0,0,0,0.6)] line-clamp-2">
                            {notification.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[rgba(0,0,0,0.3)]">
                          {notification.time}
                        </span>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-1"
                            >
                              <Check className="w-3.5 h-3.5 text-[rgba(0,0,0,0.4)]" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[rgba(0,0,0,0.3)] hover:text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[rgba(0,0,0,0.05)] rounded-none flex items-center justify-center mx-auto mb-4">
                <CheckCheck className="w-8 h-8 text-[rgba(0,0,0,0.25)]" />
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
                {selectedFilter === 'unread' ? '暂无未读消息' : '暂无通知'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
