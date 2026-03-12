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
        userName: appUsers.name,
        industry: visits.industry,
        location: visits.location,
        description: visits.description,
        date: visits.date,
        capacity: visits.capacity,
        registeredCount: visits.registeredCount,
        coverImage: visits.coverImage,
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
