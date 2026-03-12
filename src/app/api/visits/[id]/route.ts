import { NextRequest, NextResponse } from 'next/server';
import { db, visits } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取探访详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const visitList = await db
      .select()
      .from(visits)
      .where(eq(visits.id, id));

    if (visitList.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访不存在' },
        { status: 404 }
      );
    }

    const visit = visitList[0];

    const data = {
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
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取探访详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访详情失败' },
      { status: 500 }
    );
  }
}
