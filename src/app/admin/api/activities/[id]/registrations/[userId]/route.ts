import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

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
