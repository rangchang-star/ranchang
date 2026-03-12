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
        time: visits.time,
        capacity: visits.capacity,
        registeredCount: visits.registeredCount,
        coverImage: visits.coverImage,
        coverImageKey: visits.coverImageKey,
        status: visits.status,
        record: visits.record,
        outcome: visits.outcome,
        notes: visits.notes,
        keyPoints: visits.keyPoints,
        nextSteps: visits.nextSteps,
        rating: visits.rating,
        feedbackAudio: visits.feedbackAudio,
        photos: visits.photos,
        participants: visits.participants,
        createdAt: visits.createdAt,
        updatedAt: visits.updatedAt,
      })
      .from(visits)
      .leftJoin(appUsers, eq(visits.companyId, appUsers.id))
      .orderBy(desc(visits.createdAt));

    // 计算每个探访的报名人数
    const data = await Promise.all(visitList.map(async (visit: any) => {
      let registrationCount = 0;
      try {
        const regs = await db
          .select({ count: visitRegistrations.id })
          .from(visitRegistrations)
          .where(eq(visitRegistrations.visitId, visit.id));
        registrationCount = regs.length;
      } catch (err) {
        // 如果查询失败，保持为 0
        console.warn(`查询探访 ${visit.id} 的报名人数失败:`, err);
      }

      return {
        ...visit,
        registrationCount,
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
        time: body.time || null,
        location: body.location || null,
        description: body.description || null,
        industry: body.industry || null,
        capacity: body.capacity || 0,
        status: body.status || 'draft',
        coverImage: body.coverImage || null,
        coverImageKey: body.coverImageKey || null,
        record: body.record || null,
        outcome: body.outcome || null,
        notes: body.notes || null,
        keyPoints: body.keyPoints || null,
        nextSteps: body.nextSteps || null,
        rating: body.rating || null,
        feedbackAudio: body.feedbackAudio || null,
        photos: body.photos || null,
        participants: body.participants || null,
        visitorIds: body.visitorIds || null,
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
