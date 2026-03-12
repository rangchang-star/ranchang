import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq, desc, like } from 'drizzle-orm';

// GET - 获取可选用户列表（用于下拉选择）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    let query = db
      .select({
        id: users.id,
        name: users.name,
        avatar: users.avatar,
        email: users.email,
        level: users.level,
      })
      .from(users)
      .where(eq((users as any).status, 'active'));

    if (search) {
      query = query.where(like(users.name, `%${search}%`));
    }

    const memberList = await query.orderBy(desc((users as any).created_at)).limit(50);

    return NextResponse.json({
      success: true,
      data: memberList,
    });
  } catch (error) {
    console.error('获取可选用户列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取可选用户列表失败',
      },
      { status: 500 }
    );
  }
}
