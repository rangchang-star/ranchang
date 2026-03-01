'use client';

import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

export default function AdminEntryPage() {
  const adminPages = [
    {
      href: '/admin',
      title: '数据看板',
      description: '查看平台核心数据统计',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/members',
      title: '会员管理',
      description: '管理平台会员信息',
      icon: Users,
    },
    {
      href: '/admin/activities',
      title: '活动管理',
      description: '管理活动及报名',
      icon: Calendar,
    },
    {
      href: '/admin/consultations',
      title: '咨询管理',
      description: '处理用户咨询留言',
      icon: MessageSquare,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            管理后台入口
          </h2>
          <p className="text-muted-foreground">
            点击下方卡片进入对应的后台管理页面
          </p>
        </div>

        <div className="space-y-4">
          {adminPages.map((page) => {
            const Icon = page.icon;
            return (
              <Card key={page.href} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <a href={page.href} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {page.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💡 提示：也可以直接在地址栏输入完整路径访问
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            例如：http://localhost:5000/admin
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
