import { NextRequest, NextResponse } from 'next/server';
import { db, notifications, users } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || '';

    let query = db
      .select()
      .from(notifications);

    if (type && type !== 'all') {
      query = query.where(eq((notifications as any).type, type));
    }

    const notificationList = await query.orderBy(desc((notifications as any).created_at));

    return NextResponse.json({
      success: true,
      data: notificationList,
    });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取通知列表失败',
      },
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
        id: crypto.randomUUID(),
        user_id: body.userId,
        type: body.type,
        title: body.title,
        message: body.message,
        action_url: body.actionUrl,
        is_read: false,
        created_at: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newNotification[0],
    });
  } catch (error) {
    console.error('创建通知失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建通知失败',
      },
      { status: 500 }
    );
  }
}
