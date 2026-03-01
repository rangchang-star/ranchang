'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: '总会员数',
      value: '1,234',
      change: '+12%',
      icon: Users,
    },
    {
      title: '活动总数',
      value: '48',
      change: '+8%',
      icon: Calendar,
    },
    {
      title: '咨询留言',
      value: '89',
      change: '+23%',
      icon: MessageSquare,
    },
    {
      title: '本周活跃',
      value: '256',
      change: '+15%',
      icon: TrendingUp,
    },
  ];

  const recentActivities = [
    { id: 1, title: '转型期私董会', date: '2024-04-10', enrolled: 8, status: '报名中' },
    { id: 2, title: '跨界沙龙：AI时代的商业创新', date: '2024-04-15', enrolled: 20, status: '报名中' },
    { id: 3, title: 'AI实战赋能营', date: '2024-04-20', enrolled: 25, status: '名额紧张' },
  ];

  const recentConsultations = [
    { id: 1, title: '45岁转型困惑', type: '心理', date: '2024-03-15', status: '待处理' },
    { id: 2, title: '传统制造业转型', type: '商业', date: '2024-03-14', status: '已回复' },
    { id: 3, title: '股权分家问题', type: '商业', date: '2024-03-13', status: '待处理' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">数据看板</h2>
          <p className="text-muted-foreground">实时监控平台运营数据</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary">{stat.change}</span> 较上周
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近活动 */}
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.date} · 已报名 {activity.enrolled} 人
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        activity.status === '名额紧张'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 最近咨询 */}
          <Card>
            <CardHeader>
              <CardTitle>最近咨询</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConsultations.map((consult) => (
                  <div key={consult.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{consult.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {consult.type} · {consult.date}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        consult.status === '待处理'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {consult.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 会员增长趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>会员增长趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                图表区域（可集成 ECharts 实现数据可视化）
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
