'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        // TODO: 创建 /api/notifications 接口
        const response = await fetch('/api/notifications');
        const data = await response.json();

        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <Check className="w-4 h-4" />
        </div>;
      case 'warning':
        return <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
          <Bell className="w-4 h-4" />
        </div>;
      case 'error':
        return <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <Bell className="w-4 h-4" />
        </div>;
      default:
        return <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <Bell className="w-4 h-4" />
        </div>;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">消息通知</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read)}
            >
              全部已读
            </Button>
          </div>
        </div>

        {/* 通知列表 */}
        <div className="px-5 py-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              加载中...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无通知
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'bg-gray-50 border-gray-100'
                      : 'bg-white border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" />
                          )}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                            disabled={notification.read}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {notification.content}
                      </p>

                      <div className="text-xs text-gray-400">
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
