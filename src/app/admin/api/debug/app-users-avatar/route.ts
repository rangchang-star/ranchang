import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';

// GET - 查询所有用户的 avatar 字段（调试用）
export async function GET(request: NextRequest) {
  try {
    // 查询所有用户
    const users = await db
      .select({
        id: appUsers.id,
        name: appUsers.name,
        avatar: appUsers.avatar,
      })
      .from(appUsers)
      .limit(10);

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('查询用户头像信息失败:', error);
    return NextResponse.json(
      { success: false, error: '查询用户头像信息失败' },
      { status: 500 }
    );
  }
}
