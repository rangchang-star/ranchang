import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq, like } from 'drizzle-orm';

// GET - 查询用户头像信息（调试用）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name') || '';

    if (!name) {
      return NextResponse.json({
        success: false,
        error: '请提供用户名参数',
      });
    }

    // 查询指定用户
    const users = await db
      .select()
      .from(appUsers)
      .where(like(appUsers.name, `%${name}%`));

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
