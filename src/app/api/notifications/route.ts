import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { eq, and, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 从 cookie 或 session 获取当前用户ID
    // 这里暂时使用硬编码的方式，实际应该从认证信息中获取
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取总数量和未读数量
    const [totalCountResult, unreadCountResult] = await Promise.all([
      db.select({ count: count() }).from(notifications).where(eq(notifications.userId, userId)),
      db.select({ count: count() }).from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
    ]);

    const total = totalCountResult[0].count;
    const unreadCount = unreadCountResult[0].count;
    const totalPages = Math.ceil(total / limit);

    // 获取消息列表
    const list = await db
      .select({
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
        actionUrl: notifications.actionUrl,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: list,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      unreadCount,
    });
  } catch (error) {
    console.error('获取消息列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取消息列表失败' },
      { status: 500 }
    );
  }
}
