import { NextRequest, NextResponse } from 'next/server';
import { db, visits, appUsers, visitRegistrations } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取探访列表（含报名人数）
export async function GET(request: NextRequest) {
  try {
    const visitList = await db
      .select({
        id: visits.id,
        companyId: visits.companyId,
        companyName: visits.companyName,
        industry: visits.industry,
        location: visits.location,
        description: visits.description,
        date: visits.date,
        capacity: visits.capacity,
        registeredCount: visits.registeredCount,
        coverImage: visits.coverImage,
        coverImageKey: visits.coverImageKey,
        status: visits.status,
        createdAt: visits.createdAt,
        updatedAt: visits.updatedAt,
      })
      .from(visits)
      .leftJoin(appUsers, eq(visits.companyId, appUsers.id))
      .orderBy(desc(visits.createdAt));

    // 计算每个探访的报名人数
    const data = await Promise.all(visitList.map(async (visit: any) => {
      const registrationCount = await db
        .select({ count: visitRegistrations.id })
        .from(visitRegistrations)
        .where(eq(visitRegistrations.visitId, visit.id));

      return {
        ...visit,
        registrationCount: registrationCount.length,
      };
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
        date: body.date ? new Date(body.date) : new Date(),
        location: body.location || null,
        description: body.description || null,
        industry: body.industry || null,
        capacity: body.capacity || 0,
        status: body.status || 'draft',
        coverImage: body.coverImage || null,
        coverImageKey: body.coverImageKey || null,
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
