import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationToUsers } from '@/lib/notifications';

// POST - 发送平台消息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIds, content } = body;

    // 验证参数
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '请至少选择一个用户' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '请输入消息内容' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { success: false, error: '消息内容不能超过500字' },
        { status: 400 }
      );
    }

    // 批量发送通知
    const result = await sendNotificationToUsers({
      userIds,
      type: 'system',
      title: '平台消息',
      content: content.trim(),
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: '发送失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `成功发送消息给 ${result.count} 位用户`,
      data: {
        sentCount: result.count,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('发送平台消息失败:', error);
    return NextResponse.json(
      { success: false, error: '发送消息失败' },
      { status: 500 }
    );
  }
}
