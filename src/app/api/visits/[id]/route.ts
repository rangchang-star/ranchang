import { NextRequest, NextResponse } from 'next/server';
import { db, visits } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个探访（前台）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const visitList = await db
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
      .where(eq(visits.id, id));

    if (visitList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '探访不存在',
        },
        { status: 404 }
      );
    }

    const visit = visitList[0];

    const data = {
      id: visit.id,
      companyId: visit.company_id,
      companyName: visit.company_name || '',
      industry: visit.industry || '',
      location: visit.location || '',
      description: visit.description || '',
      date: visit.date || '',
      time: '',
      capacity: visit.capacity || 0,
      participants: [],
      registeredCount: visit.registered_count || 0,
      coverImage: visit.cover_image || '',
      coverImageKey: visit.cover_image || '',
      visitorId: null,
      record: '',
      outcome: '',
      notes: '',
      keyPoints: [],
      nextSteps: [],
      rating: 0,
      feedbackAudio: '',
      photos: [],
      status: visit.status || '',
      createdAt: visit.created_at,
      updatedAt: visit.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取探访详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取探访详情失败',
      },
      { status: 500 }
    );
  }
}
