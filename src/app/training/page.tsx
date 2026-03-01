'use client';

import { PageContainer } from '@/components/page-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Target, Zap } from 'lucide-react';

const courses = [
  {
    id: '1',
    title: 'AI实战赋能营',
    subtitle: '用AI，给自己的经验插上翅膀',
    target: '想用AI提升效率的职场人/创业者',
    icon: <Zap className="w-8 h-8 text-primary" />,
    content: [
      {
        title: '教学内容',
        items: [
          'AI工具选型与组合',
          '提示词工程实战',
          'AI辅助决策',
          '用AI梳理商业逻辑',
        ],
      },
      {
        title: '学后获得',
        items: [
          '一套可落地的AI工作流',
          '专属AI工具包',
          '加入AI实战社群',
        ],
      },
    ],
    founderName: '张老师',
    founderTitle: 'AI实战专家',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=kindlefield-ai-course',
  },
  {
    id: '2',
    title: 'AI+商业创新工作坊',
    subtitle: '让AI成为你的创新加速器',
    target: '创业者、企业高管、创新者',
    icon: <Target className="w-8 h-8 text-primary" />,
    content: [
      {
        title: '教学内容',
        items: [
          'AI驱动的商业模式设计',
          'AI辅助的产品创新',
          'AI赋能的市场营销',
          'AI工具的团队协作应用',
        ],
      },
      {
        title: '学后获得',
        items: [
          'AI创新方法论框架',
          '行业AI应用案例库',
          '与资深专家1对1交流',
        ],
      },
    ],
    founderName: '李老师',
    founderTitle: '商业创新顾问',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=kindlefield-innovation-workshop',
  },
];

export default function TrainingPage() {
  return (
    <PageContainer title="用AI，给自己的经验插上翅膀">
      <div className="space-y-8">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex-shrink-0">{course.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold font-serif text-foreground">
                    {course.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.subtitle}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit mt-2">
                {course.target}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {course.content.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold mb-3 text-foreground">
                    {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Separator />

              {/* 创始人二维码 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
                <div className="text-center">
                  <img
                    src={course.qrCode}
                    alt="创始人二维码"
                    className="w-32 h-32 mx-auto mb-2"
                  />
                  <p className="text-xs text-muted-foreground">扫码咨询报名</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground mb-1">
                    {course.founderName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {course.founderTitle}
                  </p>
                  <Button className="mt-4">立即咨询</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
