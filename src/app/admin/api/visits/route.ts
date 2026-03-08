import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(request: NextRequest) {
  try {
    let visits;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, visits: visitsTable } = await import('@/storage/database/supabase/connection');
        const { desc } = await import('drizzle-orm');

        const dbVisits = await db.select().from(visitsTable).orderBy(desc(visitsTable.createdAt));

        // 转换数据格式以适配后台管理页面
        visits = dbVisits.map((visit: any) => ({
          id: visit.id,
          date: visit.date || visit.createdAt,
          time: visit.duration || '14:00-16:00',
          status: visit.status === 'active' ? 'completed' : visit.status,
          target: {
            name: '待确认',
            title: '待确认',
            company: '待确认',
            avatar: '',
          },
          purpose: visit.description.substring(0, 50) + '...',
          location: visit.location || '待确认',
          participants: 0, // 需要从报名表计算
          rating: 5,
          tags: [visit.status, '探访'],
          title: visit.title,
          industry: '',
          duration: visit.duration,
          visitors: [],
          record: visit.description,
          audioDuration: '',
          audioUrl: '',
          image: visit.image,
          outcome: '',
          keyPoints: [],
          nextSteps: [],
          notes: '',
          images: [],
          views: 0,
          likes: 0,
          createdAt: visit.createdAt,
        }));
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 降级到模拟数据
        const mockVisits = MockDatabase.getVisits();
        visits = mockVisits.map((visit) => {
          const parseChineseDate = (dateStr: string): string => {
            const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
            if (match) {
              const year = match[1];
              const month = match[2].padStart(2, '0');
              const day = match[3].padStart(2, '0');
              return `${year}-${month}-${day}T00:00:00Z`;
            }
            const parsed = new Date(dateStr);
            if (!isNaN(parsed.getTime())) {
              return parsed.toISOString();
            }
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
            views: 0,
            likes: 0,
            createdAt: parseChineseDate(visit.date),
          };
        });
      }
    } else {
      // 使用模拟数据
      const mockVisits = MockDatabase.getVisits();
      visits = mockVisits.map((visit) => {
        const parseChineseDate = (dateStr: string): string => {
          const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
          if (match) {
            const year = match[1];
            const month = match[2].padStart(2, '0');
            const day = match[3].padStart(2, '0');
            return `${year}-${month}-${day}T00:00:00Z`;
          }
          const parsed = new Date(dateStr);
          if (!isNaN(parsed.getTime())) {
            return parsed.toISOString();
          }
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
          views: 0,
          likes: 0,
          createdAt: parseChineseDate(visit.date),
        };
      });
    }

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
