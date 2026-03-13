'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Share2, Heart, Check, XCircle, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarDisplay } from '@/components/avatar-upload';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLoginModal } from '@/contexts/login-modal-context-v2';

// 倒计时 Hook
const useCountdown = (endTime: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

// 状态图标组件
const ActivityStatusBadge = ({ status, endTime }: { status: string; endTime?: string }) => {
  const timeLeft = useCountdown(endTime);

  if (status === 'ended') {
    return (
      <div className="flex items-center space-x-1 px-3 py-1 bg-[rgba(0,0,0,0.08)]">
        <div className="w-1.5 h-1.5 bg-[rgba(0,0,0,0.4)]" />
        <span className="text-[10px] text-[rgba(0,0,0,0.4)]">已结束</span>
      </div>
    );
  }

  if (status === 'ongoing' && endTime) {
    return (
      <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50">
        <div className="w-1.5 h-1.5 bg-blue-400 animate-pulse" />
        <span className="text-[10px] text-blue-400 font-medium">{timeLeft}</span>
      </div>
    );
  }

  return null;
};

export default function ActivityDetailPage() {
  const params = useParams();
  const { user, isLoggedIn } = useAuth();
  const { showLoginModal } = useLoginModal();
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'pending' | 'approved' | 'rejected' | 'completed' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 从 API 加载活动数据
  useEffect(() => {
    async function loadActivity() {
      try {
        setIsLoading(true);
        setError(null);

        const id = params.id as string;
        const response = await fetch(`/api/activities/${id}`);

        if (!response.ok) {
          throw new Error('加载活动信息失败');
        }

        const data = await response.json();

        if (data.success) {
          // 将 API 数据转换为前端需要的格式
          const formattedActivity = {
            id: data.data.id.toString(),
            category: data.data.type || '', // type→category
            title: data.data.title || '',
            subtitle: '', // API不返回subtitle
            description: data.data.description || '',
            image: data.data.coverImage || '', // coverImage→image
            tags: [data.data.type || '', '名额紧张'], // 使用type作为标签
            enrollments: [], // API不返回participants
            enrolledCount: data.data.registeredCount || 0, // registeredCount→enrolledCount
            maxEnrollments: data.data.capacity || 0, // capacity→maxEnrollments
            participants: [], // API不返回participants
            guests: [], // API不返回guests
            address: data.data.location || '', // location→address
            teaFee: '免费', // API不返回teaFee，默认为免费
            status: data.data.status === 'published' ? 'ongoing' : 'ended', // published→ongoing
            endTime: data.data.endTime || '',
            startDate: data.data.date && data.data.startTime
              ? new Date(`${data.data.date}T${data.data.startTime}`).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '',
            organizer: '燃场',
            organizerAvatar: '/logo-ranchang.png',
          };
          setActivity(formattedActivity);
        } else {
          throw new Error(data.error || '加载活动信息失败');
        }
      } catch (err: any) {
        console.error('加载活动信息失败:', err);
        setError(err.message || '加载活动信息失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }

    loadActivity();
  }, [params.id]);

  // 加载用户报名状态
  useEffect(() => {
    if (!user || !activity) return;

    const userId = user.id;
    const activityId = activity.id;

    async function loadEnrollmentStatus() {
      try {
        const response = await fetch(`/api/activities/${activityId}/enrollment-status?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          setEnrollmentStatus(data.data.status);
        }
      } catch (err) {
        console.error('加载报名状态失败:', err);
      }
    }

    loadEnrollmentStatus();
  }, [user, activity, isLoggedIn]);

  const handleEnroll = async () => {
    // 登录验证
    if (!isLoggedIn || !user) {
      showLoginModal();
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 调用报名API
      const response = await fetch('/api/activities/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId: activity.id,
          userId: user.id,
          userName: user.name || user.nickname,
          userPhone: user.phone,
          reason: '希望参加活动',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEnrollmentStatus('pending');
        alert('报名申请已提交，请等待审核');
      } else {
        throw new Error(data.error || '报名失败');
      }
    } catch (err: any) {
      console.error('报名失败:', err);
      alert(err.message || '报名失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: activity.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/discovery">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">活动详情</h1>
            <Button variant="ghost" onClick={handleShare} className="p-2">
              <Share2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* 加载状态和错误状态 */}
          {isLoading && (
            <div className="text-center py-20 text-gray-400">加载中...</div>
          )}
          
          {error && (
            <div className="text-center py-20 text-red-400">{error}</div>
          )}

          {!isLoading && !error && activity && (
            <div>
            {/* 活动图片 */}
            <div className="w-full h-48 overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 活动基本信息 */}
            <div className="px-5 space-y-4">
            <div>
              <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[10px] mb-2">
                {activity.category}
              </Badge>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{activity.title}</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.5)]">{activity.subtitle}</p>
            </div>

            {/* 活动标签 */}
            {activity.tags && activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    className="rounded-none bg-blue-400 text-white font-normal text-[10px] px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 活动状态 */}
            <ActivityStatusBadge status={activity.status} endTime={activity.endTime} />

            {/* 活动描述 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">活动介绍</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* 活动信息 */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] text-gray-900">{activity.startDate}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] text-gray-900">{activity.address}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] text-gray-900">
                    已报名{activity.enrolledCount}/{activity.maxEnrollments}人
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Coins className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] text-gray-900">{activity.teaFee}</div>
                </div>
              </div>
            </div>

            {/* 参与嘉宾 */}
            {(activity as any).guests && (activity as any).guests.length > 0 && (
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                  参与嘉宾 <span className="text-[11px] text-[rgba(0,0,0,0.5)] font-normal">{(activity as any).guests?.length || 0} 位嘉宾</span>
                </h3>
                <div className="flex items-center space-x-2">
                  {(activity as any).guests?.map((guest: any) => (
                    <AvatarDisplay key={guest.id} avatarKey={guest.avatar} name={guest.name} size="md" />
                  ))}
                </div>
              </div>
            )}

            {/* 参与人员（报名用户） */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                参与人员 <span className="text-[11px] text-[rgba(0,0,0,0.5)] font-normal">已报名{activity.enrolledCount}/{activity.maxEnrollments}</span>
              </h3>
              <div className="flex items-center space-x-2">
                {(activity as any).participants?.slice(0, 8).map((member: any) => (
                  <AvatarDisplay key={member.id} avatarKey={member.avatar} name={member.name} size="sm" />
                ))}
                {(activity as any).participants?.length > 8 && (
                  <div className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.05)] flex items-center justify-center text-[10px] text-[rgba(0,0,0,0.5)]">
                    +{(activity as any).participants?.length - 8}
                  </div>
                )}
              </div>
            </div>

            {/* 主办方 */}
            <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-3">
                <img
                  src={activity.organizerAvatar}
                  alt={activity.organizer}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">{activity.organizer}</div>
                  <div className="text-[11px] text-[rgba(0,0,0,0.4)]">主办方</div>
                </div>
              </div>
              <div className="text-[10px] text-black font-light">
                聚焦本地 35岁+ 硬核群体小圈子
              </div>
            </div>
            </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        {!isLoading && !error && activity && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.1)] px-5 py-4">
          <div className="max-w-md mx-auto space-y-3">
            {/* 审核中状态 */}
            {enrollmentStatus === 'pending' && (
              <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-50 border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-[13px] font-medium text-yellow-700">审核中</span>
              </div>
            )}

            {/* 已通过状态 */}
            {enrollmentStatus === 'approved' && (
              <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 border border-green-200">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-[13px] font-medium text-green-700">通过审核</span>
              </div>
            )}

            {/* 已拒绝状态 */}
            {enrollmentStatus === 'rejected' && (
              <div className="flex items-center justify-between space-x-3">
                <div className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 border border-red-200">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-[13px] font-medium text-red-700">审核未通过</span>
                </div>
                <Button
                  onClick={handleEnroll}
                  disabled={isSubmitting}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-normal text-[13px] py-3 px-6"
                >
                  {isSubmitting ? '提交中...' : '重新报名'}
                </Button>
              </div>
            )}

            {/* 未报名或已完成状态 */}
            {!enrollmentStatus && (
              <Button
                onClick={handleEnroll}
                disabled={activity.status === 'ended' || isSubmitting}
                className={`w-full font-normal text-[13px] py-3 ${
                  activity.status === 'ended'
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-400 hover:bg-blue-500'
                }`}
              >
                {isSubmitting ? '提交中...' : activity.status === 'ended' ? '活动已结束' : '立即报名'}
              </Button>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
