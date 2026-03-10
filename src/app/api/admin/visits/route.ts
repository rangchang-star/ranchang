import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { db, visits: visitsTable } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const dbVisits = await db.select().from(visitsTable).orderBy(desc(visitsTable.created_at));

    // 转换数据格式以适配后台管理页面
    const visits = dbVisits.map((visit: any) => ({
      id: visit.id,
      date: visit.date || visit.createdAt,
      time: visit.duration || '14:00-16:00',
      status: visit.status === 'active' ? 'completed' : visit.status,
      target: {
        name: visit.companyName || '待确认',
        title: '待确认',
        company: visit.companyName || '待确认',
        avatar: '',
      },
      purpose: visit.description ? visit.description.substring(0, 50) + '...' : '暂无描述',
      location: visit.location || '待确认',
      participants: visit.registeredCount || 0,
      rating: 5,
      tags: [visit.status, '探访'],
      title: visit.companyName,
      industry: visit.industry || '',
      duration: visit.duration,
      visitors: [],
      record: visit.description,
      audioDuration: '',
      audioUrl: '',
      image: visit.coverImage,
      outcome: '',
      keyPoints: [],
      nextSteps: [],
      notes: '',
      images: [],
      views: 0,
      likes: 0,
      createdAt: visit.createdAt,
    }));

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
