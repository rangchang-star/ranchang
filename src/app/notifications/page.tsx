'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// 通知类型定义
interface Notification {
  id: string;
  type: 'activity' | 'follow' | 'comment' | 'like' | 'system' | 'message' | 'promotion' | 'info' | 'success' | 'warning' | 'error' | 'platform' | 'activity_approved';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

const filterOptions = [
  { id: 'all', name: '全部' },
  { id: 'unread', name: '未读' },
  { id: 'follow', name: '关注' },
  { id: 'activity', name: '活动' },
  { id: 'system', name: '系统' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // 获取用户ID（这里暂时从localStorage获取，实际应该从认证信息中获取）
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('userId');
    } catch {
      return null;
    }
  };

  // 加载通知列表
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const userId = getUserId();

      if (!userId) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const response = await fetch(`/api/notifications`, {
        headers: {
          'x-user-id': userId
        }
      });
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('加载通知列表失败:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const userId = getUserId();
      
      if (!userId) return;

      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      });

      // 更新本地状态
      const updated = notifications.map((n) => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = getUserId();
      
      if (!userId) return;

      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      });

      // 更新本地状态
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('标记全部已读失败:', error);
    }
  };

  const handleDelete = async (id: string) => {
    // 用户要求不做消息批量管理功能，这里暂时不实现
    alert('消息删除功能暂未实现');
  };

  const getFilteredNotifications = () => {
    if (selectedFilter === 'all') {
      return notifications;
    }
    if (selectedFilter === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications.filter((n) => n.type === selectedFilter);
  };

  const filteredNotifications = getFilteredNotifications();

  // 格式化时间
  const formatTime = (createdAt: string) => {
    try {
      const date = new Date(createdAt);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      if (days < 7) return `${days}天前`;
      
      return date.toLocaleDateString('zh-CN');
    } catch {
      return createdAt;
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
                disabled={unreadCount === 0}
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
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-[13px] text-[rgba(0,0,0,0.4)]">加载中...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              {filteredNotifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.actionUrl || '#'}
                  className="block p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {/* 未读指示器 */}
                    {!notification.isRead && (
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
                            {!notification.isRead && (
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            )}
                          </div>
                          <p className="text-[11px] text-[rgba(0,0,0,0.6)] line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[rgba(0,0,0,0.3)]">
                          {formatTime(notification.createdAt)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
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
