import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { eq, and, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 从 cookie 或 session 获取当前用户ID
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    // 获取未读数量
    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return NextResponse.json({
      success: true,
      count: result[0].count,
    });
  } catch (error) {
    console.error('获取未读数量失败:', error);
    return NextResponse.json(
      { success: false, error: '获取未读数量失败' },
      { status: 500 }
    );
  }
}
