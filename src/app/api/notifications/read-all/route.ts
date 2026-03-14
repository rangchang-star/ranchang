import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    // 从 cookie 或 session 获取当前用户ID
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    // 标记全部为已读
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('标记全部已读失败:', error);
    return NextResponse.json(
      { success: false, error: '标记全部已读失败' },
      { status: 500 }
    );
  }
}
