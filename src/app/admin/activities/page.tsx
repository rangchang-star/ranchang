'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { useState } from 'react';

const mockActivities = [
  {
    id: '1',
    title: '转型期私董会',
    date: '2024-04-10',
    time: '14:00-17:00',
    location: '上海·静安',
    type: 'private',
    enrolled: 8,
    max: 12,
    tags: ['私董会', '名额紧张'],
    status: 'active',
    pendingApplications: 3, // 待审核申请数量
  },
  {
    id: '2',
    title: '跨界沙龙：AI时代的商业创新',
    date: '2024-04-15',
    time: '19:00-21:00',
    location: '北京·朝阳',
    type: 'salon',
    enrolled: 20,
    max: 30,
    tags: ['跨界', 'AI'],
    status: 'active',
    pendingApplications: 5,
  },
  {
    id: '3',
    title: 'AI实战赋能营（第一期）',
    date: '2024-04-20',
    time: '09:00-17:00',
    location: '深圳·南山',
    type: 'ai',
    enrolled: 25,
    max: 30,
    tags: ['AI实战', '工作坊'],
    status: 'active',
    pendingApplications: 2,
  },
  {
    id: '4',
    title: '数字化转型分享会',
    date: '2024-03-15',
    time: '14:00-16:00',
    location: '线上',
    type: 'salon',
    enrolled: 45,
    max: 50,
    tags: ['已结束'],
    status: 'ended',
    pendingApplications: 0,
  },
];

// 模拟报名申请数据
const mockApplications = [
  {
    id: 'app-1',
    activityId: '1',
    userName: '张三',
    userPhone: '138****1234',
    userCompany: '某科技公司',
    userPosition: 'CEO',
    reason: '希望参与私董会，获得更多创业指导',
    status: 'pending', // pending, approved, rejected
    applyTime: '2024-04-05 10:30',
  },
  {
    id: 'app-2',
    activityId: '1',
    userName: '李四',
    userPhone: '139****5678',
    userCompany: '某制造企业',
    userPosition: '总经理',
    reason: '数字化转型需要同行交流',
    status: 'pending',
    applyTime: '2024-04-05 14:20',
  },
  {
    id: 'app-3',
    activityId: '1',
    userName: '王五',
    userPhone: '137****9012',
    userCompany: '某咨询公司',
    userPosition: '合伙人',
    reason: '了解最新AI应用趋势',
    status: 'pending',
    applyTime: '2024-04-06 09:15',
  },
  {
    id: 'app-4',
    activityId: '2',
    userName: '赵六',
    userPhone: '136****3456',
    userCompany: '某创业公司',
    userPosition: '创始人',
    reason: '拓展人脉资源',
    status: 'approved',
    applyTime: '2024-04-01 11:00',
  },
];

export default function AdminActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState(mockApplications);

  const filteredActivities = mockActivities.filter((activity) =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = selectedActivity
    ? applications.filter((app) => app.activityId === selectedActivity)
    : applications.filter((app) => app.status === 'pending');

  // 添加通知到localStorage
  const addNotification = (notification: any) => {
    try {
      const stored = localStorage.getItem('notifications');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('notifications', JSON.stringify([notification, ...existing]));
    } catch (error) {
      console.error('保存通知失败:', error);
    }
  };

  // 审核通过
  const handleApprove = (applicationId: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: 'approved' as const } : app
    );
    setApplications(updatedApplications);

    // 获取申请信息
    const app = applications.find(a => a.id === applicationId);
    const activity = mockActivities.find(a => a.id === app?.activityId);

    // 同时更新localStorage中的活动数据
    updateLocalStorage(applicationId, 'approved');

    // 添加审核通过通知
    addNotification({
      id: `approval-${Date.now()}`,
      type: 'success',
      title: '报名审核通过',
      message: `您报名的「${activity?.title || '活动'}」已通过审核，请按时参加`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      actionUrl: `/activity/${app?.activityId}`,
    });

    alert('已通过申请');
  };

  // 审核拒绝
  const handleReject = (applicationId: string) => {
    if (!confirm('确定要拒绝此申请吗？')) return;

    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: 'rejected' as const } : app
    );
    setApplications(updatedApplications);

    // 获取申请信息
    const app = applications.find(a => a.id === applicationId);
    const activity = mockActivities.find(a => a.id === app?.activityId);

    // 同时更新localStorage中的活动数据
    updateLocalStorage(applicationId, 'rejected');

    // 添加审核拒绝通知
    addNotification({
      id: `rejection-${Date.now()}`,
      type: 'error',
      title: '报名审核未通过',
      message: `您报名的「${activity?.title || '活动'}」未通过审核，如有疑问请联系客服`,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
    });

    alert('已拒绝申请');
  };

  // 更新localStorage中的活动数据
  const updateLocalStorage = (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const storedActivities = localStorage.getItem('activities');
      if (storedActivities) {
        const activities = JSON.parse(storedActivities);
        const app = applications.find(a => a.id === applicationId);
        if (app) {
          const activity = activities.find((a: any) => a.id === app.activityId);
          if (activity) {
            // 更新活动的报名状态
            if (!activity.applications) {
              activity.applications = [];
            }
            const existingApp = activity.applications.find((a: any) => a.id === applicationId);
            if (existingApp) {
              existingApp.status = status;
            }
            localStorage.setItem('activities', JSON.stringify(activities));
          }
        }
      }
    } catch (error) {
      console.error('更新localStorage失败:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      private: '私董会',
      salon: '沙龙',
      ai: 'AI实战',
    };
    return labels[type] || type;
  };

  // 导出活动数据为Excel
  const handleExport = () => {
    if (filteredActivities.length === 0) {
      alert('没有数据可导出');
      return;
    }

    // 构建CSV数据
    const headers = ['活动ID', '活动标题', '日期', '时间', '地点', '类型', '已报名', '最大人数', '报名率', '状态'];
    const rows = filteredActivities.map(activity => [
      activity.id,
      activity.title,
      activity.date,
      activity.time,
      activity.location,
      getTypeLabel(activity.type),
      activity.enrolled,
      activity.max,
      `${Math.round((activity.enrolled / activity.max) * 100)}%`,
      activity.status === 'active' ? '进行中' : '已结束',
    ]);

    // 添加BOM以支持Excel中文显示
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `活动数据_${new Date().toLocaleDateString('zh-CN')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">活动管理</h2>
            <p className="text-muted-foreground">管理平台活动及报名</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              发布活动
            </Button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索活动..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 活动列表 */}
        <Card>
          <CardHeader>
            <CardTitle>活动列表（{filteredActivities.length}）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{getTypeLabel(activity.type)}</Badge>
                        {activity.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {activity.status === 'ended' && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            已结束
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedActivity(activity.id);
                          setShowApplications(true);
                        }}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        报名
                        {activity.pendingApplications > 0 && (
                          <Badge variant="destructive" className="ml-1 text-xs">
                            {activity.pendingApplications}
                          </Badge>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{activity.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.location}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      已报名: <span className="text-foreground font-medium">{activity.enrolled}</span>
                      {' '} / {activity.max}
                    </span>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(activity.enrolled / activity.max) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((activity.enrolled / activity.max) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 报名审核面板 */}
        {showApplications && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedActivity
                    ? `报名审核 - ${mockActivities.find(a => a.id === selectedActivity)?.title}`
                    : '待审核申请'}
                  <Badge variant="outline" className="ml-2">
                    {filteredApplications.length}条
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowApplications(false);
                    setSelectedActivity(null);
                  }}
                >
                  关闭
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{application.userName}</h3>
                          <Badge variant={application.status === 'pending' ? 'secondary' : application.status === 'approved' ? 'default' : 'destructive'}>
                            {application.status === 'pending' ? '待审核' : application.status === 'approved' ? '已通过' : '已拒绝'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>电话: {application.userPhone}</p>
                          <p>公司: {application.userCompany}</p>
                          <p>职位: {application.userPosition}</p>
                          <p>申请时间: {application.applyTime}</p>
                        </div>
                        <div className="mt-2 p-2 bg-secondary/50 rounded text-sm">
                          <span className="font-medium">申请理由: </span>
                          {application.reason}
                        </div>
                      </div>
                    </div>
                    {application.status === 'pending' && (
                      <div className="flex items-center justify-end space-x-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(application.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          拒绝
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(application.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          通过
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {filteredApplications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无申请记录
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
