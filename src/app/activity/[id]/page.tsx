'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';

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

// 模拟数据
const mockActivityData = {
  id: '1',
  category: '私董会',
  title: 'CEO转型期私董会',
  subtitle: '战略定位与组织重构',
  description: '邀请10位CEO共同探讨传统企业在AI时代的转型路径，通过深度对话和案例分析，帮助企业在变革中找到新的增长点。本次活动将聚焦于企业战略规划、组织架构调整、人才梯队建设等核心议题。',
  image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
  enrollments: [
    'https://api.dicebear.com/7.x/micah/svg?seed=p1',
    'https://api.dicebear.com/7.x/micah/svg?seed=p2',
    'https://api.dicebear.com/7.x/micah/svg?seed=p3',
    'https://api.dicebear.com/7.x/micah/svg?seed=p4',
    'https://api.dicebear.com/7.x/micah/svg?seed=p5',
    'https://api.dicebear.com/7.x/micah/svg?seed=p6',
    'https://api.dicebear.com/7.x/micah/svg?seed=p7',
    'https://api.dicebear.com/7.x/micah/svg?seed=p8',
  ],
  enrolledCount: 8,
  maxEnrollments: 12,
  address: '北京市朝阳区CBD国贸大厦A座18层',
  teaFee: 'aa茶水费35元',
  status: 'ongoing',
  endTime: '2024-03-15T18:00:00',
  startDate: '2024年3月20日 14:00-17:00',
  organizer: '燃场',
  organizerAvatar: '/logo-ranchang.png',
};

export default function ActivityDetailPage() {
  const params = useParams();
  const [activity] = useState(mockActivityData);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = () => {
    setIsEnrolled(!isEnrolled);
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
                    {activity.enrolledCount}/{activity.maxEnrollments}人已报名
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] text-gray-900">{activity.teaFee}</div>
                </div>
              </div>
            </div>

            {/* 参与人员 */}
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">参与人员</h3>
              <div className="flex items-center space-x-2">
                {activity.enrollments.slice(0, 8).map((avatar, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src={avatar}
                      alt={`参与者${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {activity.enrollments.length > 8 && (
                  <div className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.05)] flex items-center justify-center text-[10px] text-[rgba(0,0,0,0.5)]">
                    +{activity.enrollments.length - 8}
                  </div>
                )}
              </div>
            </div>

            {/* 主办方 */}
            <div className="flex items-center space-x-3 p-3 bg-[rgba(0,0,0,0.02)]">
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
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.1)] px-5 py-4">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleEnroll}
              disabled={activity.status === 'ended' || isEnrolled}
              className={`w-full font-normal text-[13px] py-3 ${
                isEnrolled
                  ? 'bg-green-400 hover:bg-green-500'
                  : activity.status === 'ended'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-400 hover:bg-blue-500'
              }`}
            >
              {isEnrolled ? '已报名' : activity.status === 'ended' ? '活动已结束' : '立即报名'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
