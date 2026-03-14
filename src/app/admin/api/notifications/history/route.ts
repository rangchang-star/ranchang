import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 查询所有 type='platform' 的通知记录
    // 按相同内容分组统计
    const result = await db.execute(sql`
      SELECT 
        id,
        title,
        message,
        action_url as "actionUrl",
        created_at as "createdAt",
        COUNT(*) as count
      FROM notifications
      WHERE type = 'platform'
      GROUP BY title, message, action_url, created_at, id
      ORDER BY created_at DESC
      LIMIT 20
    `);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('加载发送记录失败:', error);
    return NextResponse.json(
      { success: false, error: '加载发送记录失败' },
      { status: 500 }
    );
  }
}
