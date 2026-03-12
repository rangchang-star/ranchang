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

    // 转换数据格式
    const data = visitList.map((visit: any) => ({
      id: visit.id,
      companyId: visit.companyId,
      companyName: visit.companyName,
      industry: visit.industry,
      location: visit.location,
      description: visit.description,
      date: visit.date,
      capacity: visit.capacity,
      registeredCount: visit.registeredCount,
      coverImage: visit.coverImage,
      coverImageKey: visit.coverImageKey,
      status: visit.status,
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
        id: crypto.randomUUID(),
        companyId: body.companyId,
        companyName: body.companyName,
        industry: body.industry,
        location: body.location,
        description: body.description,
        date: new Date(body.date),
        capacity: body.capacity,
        coverImage: body.coverImage,
        coverImageKey: body.coverImageKey,
        status: body.status || 'draft',
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
