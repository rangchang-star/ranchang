'use client';

import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target, Zap } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  target: string;
  icon: React.ReactNode;
  content: {
    title: string;
    items: string[];
  }[];
  founderName: string;
  founderTitle: string;
  qrCode: string;
}

export default function TrainingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/training/courses');
        const data = await response.json();

        if (data.success) {
          setCourses(data.data || []);
        } else {
          throw new Error(data.error || '加载课程失败');
        }
      } catch (err: any) {
        console.error('加载课程失败:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (isLoading) {
    return (
      <PageContainer title="用AI，给自己的经验插上翅膀">
        <div className="text-center text-gray-400 py-10">
          加载中...
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="用AI，给自己的经验插上翅膀">
        <div className="text-center text-red-400 py-10">
          {error}
        </div>
      </PageContainer>
    );
  }

  if (courses.length === 0) {
    return (
      <PageContainer title="用AI，给自己的经验插上翅膀">
        <div className="text-center text-gray-400 py-10">
          暂无课程
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="用AI，给自己的经验插上翅膀">
      <div className="space-y-10">
        {courses.map((course) => (
          <div key={course.id} className="space-y-6">
            {/* 课程标题 */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-primary">{course.icon}</div>
                <h2 className="text-2xl font-bold text-foreground">
                  {course.title}
                </h2>
              </div>
              <p className="text-muted-foreground">
                {course.subtitle}
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                {course.target}
              </span>
            </div>

            {/* 课程内容 */}
            <div className="space-y-6">
              {course.content.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 讲师信息 */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-foreground">讲师：</span>
                <span className="text-sm text-foreground">{course.founderName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{course.founderTitle}</span>
              </div>
            </div>

            {/* 二维码 */}
            {course.qrCode && (
              <div className="flex justify-center py-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <img src={course.qrCode} alt="扫码咨询" className="w-32 h-32" />
                  <p className="text-xs text-center text-muted-foreground mt-2">扫码咨询</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
