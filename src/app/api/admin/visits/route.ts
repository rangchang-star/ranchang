import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { db, visits: visitsTable } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const dbVisits = await db.select().from(visitsTable).orderBy(desc(visitsTable.created_at));

    // 转换数据格式以适配后台管理页面
    const visits = dbVisits.map((visit: any) => ({
      id: visit.id,
      date: visit.date || visit.created_at,
      time: visit.date ? visit.date.toString().slice(11,16) + '-' + visit.date.toString().slice(11,16) : '14:00-16:00',
      status: visit.status === 'active' ? 'completed' : visit.status,
      target: {
        name: visit.title,
        title: '探访对象',
        company: '',
        avatar: visit.image || '',
      },
      purpose: visit.description?.substring(0, 50) + '...' || '无',
      location: visit.location || '待确认',
      participants: 0, // 需要从报名表计算
      rating: 5,
      tags: [visit.status, '探访'],
      title: visit.title,
      industry: '',
      duration: '4小时',
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
      capacity: visit.capacity || 0,
      teaFee: visit.tea_fee || 0,
      createdBy: visit.created_by,
      createdAt: visit.created_at?.toISOString(),
      updatedAt: visit.updated_at?.toISOString(),
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
