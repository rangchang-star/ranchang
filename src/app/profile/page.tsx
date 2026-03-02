'use client';

import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, BookOpen, MessageSquare, Users, Calendar, ChevronRight } from 'lucide-react';

// 菜单项
const menuItems = [
  {
    icon: BookOpen,
    label: '我的课程',
    subtitle: '2门进行中',
    action: '查看课程',
  },
  {
    icon: MessageSquare,
    label: '我的咨询',
    subtitle: '1条新回复',
    action: '查看消息',
  },
  {
    icon: Users,
    label: '我的社群',
    subtitle: '3个活跃',
    action: '进入社群',
  },
  {
    icon: Calendar,
    label: '活动预约',
    subtitle: '2个待参加',
    action: '查看活动',
  },
];

// 统计数据
const stats = [
  { label: '学习时长', value: '12.5h' },
  { label: '获得证书', value: '3' },
  { label: '参与活动', value: '8' },
  { label: '会员等级', value: '黄金' },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white pb-14">
      {/* 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        <div className="px-5 pt-6 space-y-8 pb-4">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">个人中心</h1>
            <button className="p-2 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
              <Settings className="w-5 h-5 text-[rgba(0,0,0,0.25)]" />
            </button>
          </div>

          {/* 用户信息卡片 */}
          <div className="p-5 bg-white">
            <div className="flex items-start space-x-4">
              {/* 纯方形头像 */}
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/micah/svg?seed=profile"
                  alt="头像"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h2 className="text-base font-bold text-gray-900">王芳</h2>
                  <p className="text-[13px] text-[rgba(0,0,0,0.25)]">人力资源专家 | 45岁</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1">
                    HRBP
                  </span>
                  <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1">
                    团队管理
                  </span>
                  <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1">
                    人才发展
                  </span>
                </div>
                {/* 纯方形按钮 */}
                <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-4 py-2">
                  编辑资料
                </Button>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[rgba(0,0,0,0.05)]">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-[9px] text-[rgba(0,0,0,0.25)] mt-1 line-clamp-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 功能菜单 */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="w-full p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors flex items-center"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* 图标 - 纯方形 */}
                  <div className="w-10 h-10 bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[rgba(0,0,0,0.25)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.label}
                      </span>
                      <span className="text-[13px] text-[rgba(0,0,0,0.25)] line-clamp-1">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.25)] ml-3 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* 我的宣告 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-blue-400">我的宣告</h2>
            </div>
            {/* 灰色横线 */}
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="p-4 bg-white">
              <div className="flex items-start space-x-4">
                {/* 宣告图片 - 纯方形 */}
                <div className="w-16 h-16 flex-shrink-0 bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-[rgba(0,0,0,0.25)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    用AI重构人力资源管理体系
                  </h3>
                  <p className="text-[13px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-3">
                    作为一个从业15年的人力资源专家，我将分享如何利用AI工具优化人才招聘、培养和管理的全流程...
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[9px] text-[rgba(0,0,0,0.25)]">
                <span>2024年2月28日</span>
                <span>1,234次</span>
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-blue-400">最近活动</h2>
            </div>
            {/* 灰色横线 */}
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-3">
              <div className="p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-start space-x-3">
                  {/* 活动图标 - 纯方形 */}
                  <div className="w-12 h-12 flex-shrink-0 bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[rgba(0,0,0,0.25)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      AI实战赋能营
                    </h3>
                    <p className="text-[9px] text-[rgba(0,0,0,0.25)] line-clamp-2">
                      上海市浦东 | 3月15日
                    </p>
                  </div>
                  {/* 纯方形按钮 */}
                  <Button
                    size="sm"
                    className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] flex-shrink-0 ml-2"
                  >
                    已报名
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
