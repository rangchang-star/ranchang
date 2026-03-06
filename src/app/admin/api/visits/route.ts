import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(request: NextRequest) {
  try {
    // 转换数据格式以适配后台管理页面
    const mockVisits = MockDatabase.getVisits();
    const visits = mockVisits.map((visit) => {
      // 将中文日期格式转换为标准 ISO 格式
      // 例如: '2024年3月15日' -> '2024-03-15T00:00:00Z'
      const parseChineseDate = (dateStr: string): string => {
        const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (match) {
          const year = match[1];
          const month = match[2].padStart(2, '0');
          const day = match[3].padStart(2, '0');
          return `${year}-${month}-${day}T00:00:00Z`;
        }
        // 如果不是中文格式，尝试直接解析
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
        // 默认返回当前时间
        return new Date().toISOString();
      };

      return {
        id: visit.id,
        date: visit.date,
        time: visit.duration || '14:00-16:00',
        status: 'completed',
        target: visit.target || {
          name: '待确认',
          title: '待确认',
          company: '待确认',
          avatar: '',
        },
        purpose: visit.record.substring(0, 50) + '...',
        location: visit.location || '待确认',
        participants: visit.visitors?.length || 0,
        rating: visit.rating || 5,
        tags: [...visit.status, visit.industry],
        title: visit.title,
        industry: visit.industry,
        duration: visit.duration,
        visitors: visit.visitors,
        record: visit.record,
        audioDuration: visit.audioDuration,
        audioUrl: visit.audioUrl,
        image: visit.image,
        outcome: visit.outcome,
        keyPoints: visit.keyPoints,
        nextSteps: visit.nextSteps,
        notes: visit.notes,
        images: visit.images,
        views: 0, // mockVisits没有views字段，暂时设为0
        likes: 0, // mockVisits没有likes字段，暂时设为0
        createdAt: parseChineseDate(visit.date), // 转换为标准 ISO 格式
      };
    });

    return NextResponse.json({
      success: true,
      data: visits,
      total: visits.length,
    });
  } catch (error) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访列表失败' },
      { status: 500 }
    );
  }
}
