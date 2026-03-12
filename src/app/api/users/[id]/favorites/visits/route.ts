import { NextRequest, NextResponse } from 'next/server';
import { db, visitRegistrations, visits } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';

// GET - 获取用户收藏的探访列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // 获取用户参与的探访
    const registrations = await db
      .select({
        visit: visits,
        registeredAt: visitRegistrations.createdAt,
      })
      .from(visitRegistrations)
      .innerJoin(visits, eq(visitRegistrations.visitId, visits.id))
      .where(eq(visitRegistrations.userId, userId))
      .orderBy(desc(visitRegistrations.createdAt));

    const data = registrations.map((item: any) => ({
      id: item.visit.id,
      companyName: item.visit.companyName,
      industry: item.visit.industry,
      location: item.visit.location,
      description: item.visit.description,
      date: item.visit.date,
      capacity: item.visit.capacity,
      registeredCount: item.visit.registeredCount,
      coverImage: item.visit.coverImage,
      status: item.visit.status,
      registeredAt: item.registeredAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取收藏探访失败:', error);
    return NextResponse.json(
      { success: false, error: '获取收藏探访失败' },
      { status: 500 }
    );
  }
}
