import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 从 cookie 或 session 获取当前用户ID
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    // 标记为已读
    const result = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: '消息不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('标记已读失败:', error);
    return NextResponse.json(
      { success: false, error: '标记已读失败' },
      { status: 500 }
    );
  }
}
