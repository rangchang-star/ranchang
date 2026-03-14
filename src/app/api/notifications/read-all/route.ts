import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    // 批量更新该用户的所有未读消息为已读
    const updated = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated,
      message: '已全部标记为已读',
    });
  } catch (error) {
    console.error('标记全部已读失败:', error);
    return NextResponse.json(
      { success: false, error: '标记全部已读失败' },
      { status: 500 }
    );
  }
}
