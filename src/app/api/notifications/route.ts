import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const isRead = searchParams.get('isRead');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId参数必填' },
        { status: 400 }
      );
    }

    let query = db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    if (isRead !== undefined) {
      query = (query as any).where(eq(notifications.isRead, isRead === 'true'));
    }

    const notificationList = await query;

    // 转换数据格式
    const data = notificationList.map((notification: any) => ({
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      content: notification.message, // 数据库字段是 message
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取通知列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newNotification = await db
      .insert(notifications)
      .values({
        userId: body.userId,
        type: body.type,
        title: body.title,
        message: body.content || body.message, // 接收 content 参数但映射到 message 字段
        actionUrl: body.actionUrl,
        isRead: false,
        // 不设置 id，使用数据库的 gen_random_uuid()
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newNotification[0],
    });
  } catch (error) {
    console.error('创建通知失败:', error);
    return NextResponse.json(
      { success: false, error: '创建通知失败' },
      { status: 500 }
    );
  }
}
