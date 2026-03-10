'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { Settings, Flame, TrendingUp, Briefcase, Award, ChevronRight, PlayCircle, Clock, Heart, Edit, Mic, Upload, RotateCcw, User, Bell, X, CheckCircle, AlertCircle, Info, Calendar, MapPin, Users, LogOut, ChevronDown, ChevronUp, Zap, Building2 } from 'lucide-react';

// 量表维度类型
interface AssessmentDimension {
  name: string;
  score: number;
  description: string;
}

// 量表类型
interface Assessment {
  name: string;
  score: number;
  level: string;
  summary: string;
  dimensions: AssessmentDimension[];
}

// 通知类型定义
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

// 行业数据项
const industryOptions = [
  '企业服务', '金融投资', '制造业', '教育培训', '医疗健康',
  '消费零售', '房地产', '互联网', '人工智能', '新能源',
  '汽车行业', '物流运输', '传媒娱乐', '农业', '政府公共',
  '法律咨询', '建筑设计', '化工环保', '通信', '其他'
];

// 资源标签数据项
const resourceTags = [
  '资金', '人才', '技术', '渠道', '客户资源',
  '供应链', '品牌', '专利', '场地', '设备',
  '数据资源', '政府关系', '媒体资源', '合作伙伴', '其他'
];

// 人找事/事找人/纯交流选项
const connectionType = [
  { id: 'personLookingForJob', label: '人找事', description: '我有能力，寻找项目机会' },
  { id: 'jobLookingForPerson', label: '事找人', description: '我有项目，寻找合作伙伴' },
  { id: 'pureExchange', label: '纯交流', description: '只想交流学习，暂无合作需求' }
];

// 高燃宣告方向选项
const declarationDirections = [
  { id: 'confidence', name: '信心', icon: 'icon-confidence.jpg' },
  { id: 'mission', name: '使命', icon: 'icon-mission.jpg' },
  { id: 'self', name: '自我', icon: 'icon-self.jpg' },
  { id: 'opponent', name: '对手', icon: 'icon-opponent.jpg' },
  { id: 'environment', name: '环境', icon: 'icon-environment.jpg' }
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [visitRecords, setVisitRecords] = useState<any[]>([]);
  const [favoriteVisits, setFavoriteVisits] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // 加载用户通知
  useEffect(() => {
    async function loadNotifications() {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/notifications?user_id=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data || []);
        }
      } catch (err) {
        console.error('加载通知失败:', err);
      }
    }
    loadNotifications();
  }, [user?.id]);

  // 加载用户信息
  useEffect(() => {
    async function loadUserInfo() {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/users/${user.id}`);
        const data = await response.json();
        if (data.success) {
          setUserInfo(data.data);
        }
      } catch (err) {
        console.error('加载用户信息失败:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserInfo();
  }, [user?.id]);

  // 加载用户量表评估结果
  useEffect(() => {
    async function loadAssessments() {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/assessments?user_id=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setAssessments(data.data || []);
        }
      } catch (err) {
        console.error('加载量表评估结果失败:', err);
      }
    }
    loadAssessments();
  }, [user?.id]);

  // 加载用户探访记录
  useEffect(() => {
    async function loadVisits() {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/users/${user.id}/favorites/visits`);
        const data = await response.json();
        if (data.success) {
          setVisitRecords(data.data || []);
        }
      } catch (err) {
        console.error('加载探访记录失败:', err);
      }
    }
    loadVisits();
  }, [user?.id]);

  // 加载用户收藏的探访
  useEffect(() => {
    async function loadFavoriteVisits() {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/users/${user.id}/favorites/visits`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setFavoriteVisits(data.data);
          }
        }
      } catch (error) {
        console.error('加载收藏探访项目失败:', error);
      }
    }
    loadFavoriteVisits();
  }, [user?.id]);

  // 加载用户参与的活动
  useEffect(() => {
    async function loadActivities() {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/activities`);
        const data = await response.json();
        if (data.success) {
          // 过滤出用户参与的活动
          setActivities(data.data || []);
        }
      } catch (err) {
        console.error('加载活动列表失败:', err);
      }
    }
    loadActivities();
  }, [user?.id]);

  // 处理通知点击
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    setShowNotifications(false);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
      router.push('/');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">请先登录</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={userInfo?.avatar || ''} alt={userInfo?.name} />
                <AvatarFallback>{userInfo?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{userInfo?.name || '用户'}</h1>
                <p className="text-xs text-gray-500">{userInfo?.industry || '未设置行业'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <Link href="/settings">
                <Button variant="ghost" className="p-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 通知下拉面板 */}
        {showNotifications && (
          <div className="fixed top-16 left-0 right-0 z-50 max-w-md mx-auto bg-white border-b border-gray-200 shadow-lg">
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-900">消息通知</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }}
                  className="text-sm text-blue-600"
                >
                  全部已读
                </button>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-400">暂无通知</div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full px-5 py-3 flex items-start space-x-3 hover:bg-gray-50 border-b border-gray-50"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="px-5 py-6 space-y-6">
          {/* 需求描述 */}
          {userInfo?.need && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{userInfo.need}</p>
            </div>
          )}

          {/* 量表评估 */}
          {assessments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">量表评估</h2>
                <Link href="/assessment">
                  <Button variant="ghost" className="text-blue-600">
                    查看全部 <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {assessments.map((assessment, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{assessment.name}</span>
                      <Badge variant={assessment.level === '优秀' ? 'default' : 'secondary'}>
                        {assessment.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assessment.summary}</p>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-orange-500">{assessment.score}分</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 参与的活动 */}
          {activities.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">参与的活动</h2>
                <Link href="/activities">
                  <Button variant="ghost" className="text-blue-600">
                    查看全部 <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {activities.slice(0, 3).map((activity: any) => (
                  <div key={activity.id} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{activity.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        {activity.date}
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        {activity.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 探访记录 */}
          {visitRecords.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">探访记录</h2>
                <Link href="/visits">
                  <Button variant="ghost" className="text-blue-600">
                    查看全部 <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {visitRecords.slice(0, 3).map((visit: any) => (
                  <div key={visit.id} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{visit.title}</h3>
                    <p className="text-sm text-gray-600">{visit.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 快捷操作 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
            <div className="grid grid-cols-4 gap-4">
              <Link href="/profile/edit" className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600">编辑资料</span>
              </Link>
              <Link href="/assessment" className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs text-gray-600">量表评估</span>
              </Link>
              <Link href="/declarations" className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">高燃宣告</span>
              </Link>
              <button onClick={handleLogout} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-xs text-gray-600">退出登录</span>
              </button>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <BottomNav />
      </div>
    </div>
  );
}
