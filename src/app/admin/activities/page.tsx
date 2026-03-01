'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Calendar, MapPin } from 'lucide-react';
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
  },
];

export default function AdminActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = mockActivities.filter((activity) =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      private: '私董会',
      salon: '沙龙',
      ai: 'AI实战',
    };
    return labels[type] || type;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">活动管理</h2>
            <p className="text-muted-foreground">管理平台活动及报名</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            发布活动
          </Button>
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
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        报名
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
      </div>
    </AdminLayout>
  );
}
