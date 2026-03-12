import { NextRequest, NextResponse } from 'next/server';
import { db, visits } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取探访列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    let query = db.select().from(visits).orderBy(desc(visits.date));

    if (status && status !== 'all') {
      query = (query as any).where(eq(visits.status, status as any));
    }

    const visitList = await query;

    // 转换数据格式，添加兼容字段
    const data = visitList.map((visit: any) => ({
      id: visit.id,
      title: visit.companyName, // 兼容前端使用的 title 字段
      companyId: visit.companyId,
      companyName: visit.companyName,
      industry: visit.industry,
      location: visit.location,
      description: visit.description,
      date: visit.date,
      time: null, // 数据库中不存在此字段
      capacity: visit.capacity,
      participants: null, // 数据库中不存在此字段
      registeredCount: visit.registeredCount,
      coverImage: visit.coverImage,
      coverImageKey: visit.coverImageKey,
      status: visit.status,
      record: null, // 数据库中不存在此字段
      outcome: null, // 数据库中不存在此字段
      notes: null, // 数据库中不存在此字段
      keyPoints: [], // 数据库中不存在此字段
      nextSteps: [], // 数据库中不存在此字段
      rating: null, // 数据库中不存在此字段
      feedbackAudio: null, // 数据库中不存在此字段
      photos: [], // 数据库中不存在此字段
      createdAt: visit.createdAt,
      updatedAt: visit.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建探访
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newVisit = await db
      .insert(visits)
      .values({
        companyId: body.companyId,
        companyName: body.companyName,
        date: new Date(body.date),
        capacity: body.capacity,
        coverImage: body.coverImage,
        coverImageKey: body.coverImageKey,
        status: body.status || 'draft',
        location: body.location || null,
        description: body.description || null,
        industry: body.industry || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newVisit[0],
    });
  } catch (error) {
    console.error('创建探访失败:', error);
    return NextResponse.json(
      { success: false, error: '创建探访失败' },
      { status: 500 }
    );
  }
}
