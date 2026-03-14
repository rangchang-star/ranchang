import { NextRequest, NextResponse } from 'next/server';
import { db, notifications, appUsers } from '@/lib/db';
import { and, inArray, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, target, actionUrl } = body;

    // 参数校验
    if (!title || !message || !target) {
      return NextResponse.json(
        { success: false, error: '标题、内容和发送对象不能为空' },
        { status: 400 }
      );
    }

    // 确定目标用户
    let targetUserIds: string[] = [];

    if (target === 'all') {
      // 获取所有用户
      const users = await db.select({ id: appUsers.id }).from(appUsers);
      targetUserIds = users.map((u) => u.id);
    } else if (Array.isArray(target) && target.length > 0) {
      // 指定用户
      targetUserIds = target;
    } else {
      return NextResponse.json(
        { success: false, error: '发送对象参数错误' },
        { status: 400 }
      );
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有可发送的用户' },
        { status: 400 }
      );
    }

    // 批量插入通知
    const notificationsToInsert = targetUserIds.map((userId) => ({
      userId,
      type: 'system',
      title,
      content: message, // 从请求的message参数映射到数据库的content字段
      isRead: false,
    }));

    await db.insert(notifications).values(notificationsToInsert);

    return NextResponse.json({
      success: true,
      count: targetUserIds.length,
      message: '群发成功',
    });
  } catch (error) {
    console.error('群发消息失败:', error);
    return NextResponse.json(
      { success: false, error: '群发失败' },
      { status: 500 }
    );
  }
}
