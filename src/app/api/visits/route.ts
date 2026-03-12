import { NextRequest, NextResponse } from 'next/server';
import { db, visits } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取探访列表（前台）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    // 只选择数据库实际存在的字段
    let query = db
      .select({
        id: visits.id,
        company_id: visits.company_id,
        company_name: visits.company_name,
        industry: visits.industry,
        location: visits.location,
        description: visits.description,
        date: visits.date,
        capacity: visits.capacity,
        registered_count: visits.registered_count,
        cover_image: visits.cover_image,
        status: visits.status,
        created_at: visits.created_at,
        updated_at: visits.updated_at,
      })
      .from(visits)
      .orderBy(desc(visits.date));

    if (status === 'upcoming') {
      query = (query as any).where(eq(visits.status, 'upcoming'));
    } else if (status === 'ended') {
      query = (query as any).where(eq(visits.status, 'ended'));
    }

    const visitList = await query;

    // 转换数据格式（数据库 snake_case → 前端 camelCase）
    const data = visitList.map((visit: any) => ({
      id: visit.id,
      companyId: visit.company_id,
      companyName: visit.company_name || '',
      industry: visit.industry || '',
      location: visit.location || '',
      description: visit.description || '',
      date: visit.date || '',
      time: visit.time || '',  // 兜底
      capacity: visit.capacity || 0,
      participants: visit.participants || [],
      registeredCount: visit.registered_count || 0,
      coverImage: visit.cover_image || '',
      coverImageKey: visit.cover_image_key || visit.cover_image || '',  // 优先用cover_image_key，没有则用cover_image
      visitorId: visit.visitor_id,
      record: visit.record || '',
      outcome: visit.outcome || '',
      notes: visit.notes || '',
      keyPoints: visit.key_points || [],
      nextSteps: visit.next_steps || [],
      rating: visit.rating || 0,
      feedbackAudio: visit.feedback_audio || '',
      photos: visit.photos || [],
      status: visit.status || '',
      createdAt: visit.created_at,
      updatedAt: visit.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取探访列表失败',
      },
      { status: 500 }
    );
  }
}
