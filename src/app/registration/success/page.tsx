'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, Users, Clock, Share2, Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RegistrationData {
  activityId: string;
  activityName: string;
  activityImage: string;
  activityDate: string;
  activityLocation: string;
  fee: number;
  participants: number;
  registrationId: string;
  registrationTime: string;
  host: {
    name: string;
    avatar: string;
  };
  nextActivities: Array<{
    id: string;
    name: string;
    date: string;
    image: string;
  }>;
}

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('id');
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRegistrationData() {
      if (!registrationId) {
        setError('缺少报名ID');
        setLoading(false);
        return;
      }

      try {
        // 从 API 获取报名数据
        // 注意：需要创建对应的 API 接口 /api/registrations/[id]
        const response = await fetch(`/api/registrations/${registrationId}`);
        const data = await response.json();

        if (data.success) {
          setRegistration(data.data);
        } else {
          setError('加载报名数据失败');
        }
      } catch (err) {
        console.error('Failed to load registration data:', err);
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    }

    loadRegistrationData();
  }, [registrationId]);

  const handleShare = () => {
    if (navigator.share && registration) {
      navigator.share({
        title: `我报名了${registration.activityName}`,
        text: `快来一起参加吧！`,
        url: window.location.href,
      });
    }
  };

  const handleAddToCalendar = () => {
    alert('已添加到日历提醒');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error || '报名数据加载失败'}</p>
          <Link href="/activities/my">
            <Button>返回我的活动</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="px-4 py-3 flex items-center">
          <Link href="/activities/my">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* 成功提示 */}
        <div className="bg-green-400 px-5 py-8">
          <div className="text-center text-white">
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">报名成功！</h1>
            <p className="text-sm opacity-90">您的报名已确认</p>
          </div>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* 活动信息 */}
          <div className="p-4 bg-[rgba(0,0,0,0.02)]">
            <div className="flex items-start space-x-3">
              <div className="w-20 h-14 flex-shrink-0 overflow-hidden">
                <img
                  src={registration.activityImage}
                  alt={registration.activityName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {registration.activityName}
                </h3>
                <p className="text-[11px] text-[rgba(0,0,0,0.4)] mb-2">
                  报名编号：{registration.registrationId}
                </p>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-[rgba(0,0,0,0.3)]" />
                  <span className="text-[10px] text-[rgba(0,0,0,0.4)]">
                    {registration.participants}人已报名
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 活动详情 */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  {registration.activityDate}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">活动时间</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  {registration.activityLocation}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">活动地点</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  报名于 {registration.registrationTime}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">报名时间</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  ¥{registration.fee} 茶水费
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">活动费用</div>
              </div>
            </div>
          </div>

          {/* 主办方 */}
          <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.02)]">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={registration.host.avatar} alt={registration.host.name} />
                <AvatarFallback>{registration.host.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-[13px] font-semibold text-gray-900">
                  {registration.host.name}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">主办方</div>
              </div>
            </div>
            <Link href={`/connection/${registration.host.name}`}>
              <Button variant="outline" className="text-[11px]">
                查看主页
              </Button>
            </Link>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCalendar}
              className="w-full bg-blue-400 hover:bg-blue-500 font-normal text-[13px]"
            >
              <Bell className="w-4 h-4 mr-2" />
              添加到日历提醒
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 font-normal text-[13px]"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享活动
              </Button>
              <Link href="/activities/my" className="flex-1">
                <Button variant="outline" className="w-full font-normal text-[13px]">
                  查看我的活动
                </Button>
              </Link>
            </div>
          </div>

          {/* 推荐活动 */}
          {registration.nextActivities.length > 0 && (
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
                推荐活动
              </h3>
              <div className="space-y-3">
                {registration.nextActivities.map((activity) => (
                  <Link
                    key={activity.id}
                    href={`/activity/${activity.id}`}
                    className="block p-4 bg-[rgba(0,0,0,0.02)]"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-12 flex-shrink-0 overflow-hidden">
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {activity.name}
                        </h4>
                        <div className="text-[10px] text-[rgba(0,0,0,0.4)]">
                          {activity.date}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
