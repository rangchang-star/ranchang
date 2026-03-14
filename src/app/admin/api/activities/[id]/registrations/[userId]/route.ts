import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations, notifications, activities } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// PUT - 更新报名状态（审核）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;
    const body = await request.json();
    const { status, reviewNote } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查状态是否有效
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: '无效的状态' },
        { status: 400 }
      );
    }

    // 先查询报名信息（含活动标题和用户ID）
    const registration = await db
      .select({
        id: activityRegistrations.id,
        status: activityRegistrations.status,
        userId: activityRegistrations.userId,
        activityId: activityRegistrations.activityId,
        activityTitle: activities.title,
      })
      .from(activityRegistrations)
      .innerJoin(activities, eq(activityRegistrations.activityId, activities.id))
      .where(
        and(
          eq(activityRegistrations.activityId, id),
          eq(activityRegistrations.userId, userId)
        )
      )
      .limit(1);

    if (registration.length === 0) {
      return NextResponse.json(
        { success: false, error: '报名记录不存在' },
        { status: 404 }
      );
    }

    const oldRegistration = registration[0];

    // 更新报名状态
    const updatedRegistration = await db
      .update(activityRegistrations)
      .set({
        status: status as any,
        reviewedAt: new Date(),
        ...(reviewNote && { note: reviewNote }),
      })
      .where(
        and(
          eq(activityRegistrations.activityId, id),
          eq(activityRegistrations.userId, userId)
        )
      )
      .returning();

    if (updatedRegistration.length === 0) {
      return NextResponse.json(
        { success: false, error: '报名记录不存在' },
        { status: 404 }
      );
    }

    // 如果是从 pending 变为 approved，则发送通知
    if (oldRegistration.status === 'pending' && status === 'approved') {
      await db.insert(notifications).values({
        userId,
        type: 'activity',
        title: '活动报名审核通过',
        message: `你报名的《${oldRegistration.activityTitle}》已审核通过，请准时参加。`,
        isRead: false,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedRegistration[0],
    });
  } catch (error) {
    console.error('更新报名状态失败:', error);
    return NextResponse.json(
      { success: false, error: '更新报名状态失败' },
      { status: 500 }
    );
  }
}
