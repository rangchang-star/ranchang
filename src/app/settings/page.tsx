'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 模拟数据
const mockSettings = {
  notifications: {
    push: true,
    activity: true,
    message: true,
    follow: true,
    comment: true,
    system: false,
  },
  privacy: {
    publicProfile: true,
    showPhone: false,
    showEmail: false,
    allowFollow: true,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);

  const handleToggle = (category: string, key: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: !settings[category as keyof typeof settings][key as never],
      },
    });
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      // 这里应该调用退出登录API
      console.log('退出登录');
      window.location.href = '/login';
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
            <h1 className="text-[15px] font-semibold text-gray-900">设置</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* 通知设置 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-[rgba(0,0,0,0.4)]" />
              <h2 className="text-[15px] font-semibold text-gray-900">通知设置</h2>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">推送通知</span>
                <button
                  onClick={() => handleToggle('notifications', 'push')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.push ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">活动提醒</span>
                <button
                  onClick={() => handleToggle('notifications', 'activity')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.activity ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notifications.activity ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">消息提醒</span>
                <button
                  onClick={() => handleToggle('notifications', 'message')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.message ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notifications.message ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">关注提醒</span>
                <button
                  onClick={() => handleToggle('notifications', 'follow')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.follow ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notifications.follow ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">评论提醒</span>
                <button
                  onClick={() => handleToggle('notifications', 'comment')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.comment ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notifications.comment ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">系统通知</span>
                <button
                  onClick={() => handleToggle('notifications', 'system')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.system ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notifications.system ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 隐私设置 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-[rgba(0,0,0,0.4)]" />
              <h2 className="text-[15px] font-semibold text-gray-900">隐私设置</h2>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">公开个人资料</span>
                <button
                  onClick={() => handleToggle('privacy', 'publicProfile')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.privacy.publicProfile ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.privacy.publicProfile ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">显示手机号</span>
                <button
                  onClick={() => handleToggle('privacy', 'showPhone')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.privacy.showPhone ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.privacy.showPhone ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">显示邮箱</span>
                <button
                  onClick={() => handleToggle('privacy', 'showEmail')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.privacy.showEmail ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.privacy.showEmail ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] text-gray-900">允许关注</span>
                <button
                  onClick={() => handleToggle('privacy', 'allowFollow')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.privacy.allowFollow ? 'bg-blue-400' : 'bg-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.privacy.allowFollow ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 账号设置 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-[rgba(0,0,0,0.4)]" />
              <h2 className="text-[15px] font-semibold text-gray-900">账号设置</h2>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              <Link href="/profile/edit" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">编辑个人资料</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/settings/password" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">修改密码</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/settings/bind-phone" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">绑定手机号</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/settings/delete-account" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-red-400">注销账号</span>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </Link>
            </div>
          </div>

          {/* 帮助与反馈 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[rgba(0,0,0,0.4)]" />
              <h2 className="text-[15px] font-semibold text-gray-900">帮助与反馈</h2>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              <Link href="/help" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">帮助中心</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/feedback" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">意见反馈</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/about" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">关于我们</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/privacy" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">隐私政策</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/terms" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">用户协议</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
            </div>
          </div>

          {/* 版本信息 */}
          <div className="text-center py-4">
            <p className="text-[11px] text-[rgba(0,0,0,0.3)]">
              燃场 v1.0.0
            </p>
          </div>

          {/* 退出登录 */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-400 border-red-400 hover:bg-red-400 hover:bg-opacity-10 font-normal text-[13px]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}
