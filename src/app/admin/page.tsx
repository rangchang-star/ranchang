'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, TrendingUp, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalActivities: 0,
    totalConsultations: 0,
    totalVisits: 0,
    weeklyActive: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);

        // 并行加载所有数据
        const [membersRes, activitiesRes, visitsRes] = await Promise.all([
          fetch('/admin/api/members'),
          fetch('/admin/api/activities'),
          fetch('/admin/api/visits'),
        ]);

        const membersData = await membersRes.json();
        const activitiesData = await activitiesRes.json();
        const visitsData = await visitsRes.json();

        if (membersData.success && activitiesData.success && visitsData.success) {
          const members = membersData.data || [];
          const activities = activitiesData.data || [];
          const visits = visitsData.data || [];

          setStats({
            totalMembers: members.length,
            totalActivities: activities.length,
            totalConsultations: 89, // 暂时硬编码，等待咨询数据API
            totalVisits: visits.length,
            weeklyActive: Math.floor(members.length * 0.2), // 假设20%活跃
          });

          // 取最近的3个活动
          setRecentActivities(
            activities
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((activity: any) => ({
                id: activity.id,
                title: activity.title,
                date: activity.date,
                enrolled: activity.enrolled,
                status: activity.status === 'active' ? '报名中' : '已结束',
              }))
          );

          // 暂时硬编码最近咨询，等待咨询数据API
          setRecentConsultations([
            { id: 1, title: '45岁转型困惑', type: '心理', date: '2024-03-15', status: '待处理' },
            { id: 2, title: '传统制造业转型', type: '商业', date: '2024-03-14', status: '已回复' },
            { id: 3, title: '股权分家问题', type: '商业', date: '2024-03-13', status: '待处理' },
          ]);
        }
      } catch (error) {
        console.error('加载看板数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">数据看板</h2>
            <p className="text-muted-foreground">实时监控平台运营数据</p>
          </div>
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">加载中...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">数据看板</h2>
          <p className="text-muted-foreground">实时监控平台运营数据</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                总会员数
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">+12%</span> 较上周
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                活动总数
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">+8%</span> 较上周
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                探访总数
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">+5%</span> 较上周
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                咨询留言
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConsultations}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">+23%</span> 较上周
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                本周活跃
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyActive}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">+15%</span> 较上周
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近活动 */}
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">暂无活动</p>
                )}
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
                {recentConsultations.length > 0 ? (
                  recentConsultations.map((consult) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">暂无咨询</p>
                )}
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
