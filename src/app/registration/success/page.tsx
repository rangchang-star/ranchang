'use client';

import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, Users, Clock, Share2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// 模拟数据
const mockRegistration = {
  activityId: '1',
  activityName: 'AI时代创业者论坛',
  activityImage: 'https://images.unsplash.com/photo-1544526223-9db7cc7435e9?w=800&h=400&fit=crop',
  activityDate: '2024年3月20日 14:00-17:00',
  activityLocation: '北京市朝阳区国贸大厦A座会议室',
  fee: 99,
  participants: 45,
  registrationId: 'REG2024031500123',
  registrationTime: '2024年3月15日 10:30',
  host: {
    name: '燃场',
    avatar: '/logo.png',
  },
  nextActivities: [
    {
      id: '2',
      name: '35+创业者闭门会',
      date: '2024年3月25日',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&h=120&fit=crop',
    },
  ],
};

export default function RegistrationSuccessPage() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `我报名了${mockRegistration.activityName}`,
        text: `快来一起参加吧！`,
        url: window.location.href,
      });
    }
  };

  const handleAddToCalendar = () => {
    // 这里应该实现添加到日历功能
    console.log('添加到日历');
    alert('已添加到日历提醒');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto">
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
                  src={mockRegistration.activityImage}
                  alt={mockRegistration.activityName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {mockRegistration.activityName}
                </h3>
                <p className="text-[11px] text-[rgba(0,0,0,0.4)] mb-2">
                  报名编号：{mockRegistration.registrationId}
                </p>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-[rgba(0,0,0,0.3)]" />
                  <span className="text-[10px] text-[rgba(0,0,0,0.4)]">
                    {mockRegistration.participants}人已报名
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
                  {mockRegistration.activityDate}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">活动时间</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  {mockRegistration.activityLocation}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">活动地点</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  报名于 {mockRegistration.registrationTime}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">报名时间</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  ¥{mockRegistration.fee}元
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">活动费用</div>
              </div>
            </div>
          </div>

          {/* 主办方 */}
          <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.02)]">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={mockRegistration.host.avatar} alt={mockRegistration.host.name} />
                <AvatarFallback>{mockRegistration.host.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-[13px] font-semibold text-gray-900">
                  {mockRegistration.host.name}
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">主办方</div>
              </div>
            </div>
            <Link href={`/connection/${mockRegistration.host.name}`}>
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
          {mockRegistration.nextActivities.length > 0 && (
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
                推荐活动
              </h3>
              <div className="space-y-3">
                {mockRegistration.nextActivities.map((activity) => (
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
                        <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 返回按钮 */}
          <Link href="/discovery">
            <Button variant="ghost" className="w-full font-normal text-[13px]">
              返回发现页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
