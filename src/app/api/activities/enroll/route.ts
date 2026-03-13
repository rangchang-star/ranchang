import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// POST - 报名活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId, userId, note } = body;

    if (!activityId || !userId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查是否已报名
    const existing = await db
      .select()
      .from(activityRegistrations)
      .where(
        and(
          eq(activityRegistrations.activityId, activityId),
          eq(activityRegistrations.userId, userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: '已经报名过了' },
        { status: 400 }
      );
    }

    // 创建报名记录
    const newRegistration = await db
      .insert(activityRegistrations)
      .values({
        activityId,
        userId,
        note,
        status: 'pending',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newRegistration[0],
    });
  } catch (error) {
    console.error('报名活动失败:', error);
    return NextResponse.json(
      { success: false, error: '报名活动失败' },
      { status: 500 }
    );
  }
}
