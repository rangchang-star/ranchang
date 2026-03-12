import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { desc, like, eq, and } from 'drizzle-orm';

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let query = db.select().from(appUsers).orderBy(desc(appUsers.createdAt));

    const conditions = [];
    if (search) {
      conditions.push(
        like(appUsers.nickname, `%${search}%`)
      );
    }
    if (status && status !== 'all') {
      conditions.push(eq(appUsers.status, status as any));
    }

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const userList = await query;

    const data = userList.map((user: any) => ({
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      name: user.name,
      avatar: user.avatar,
      age: user.age,
      gender: user.gender,
      company: user.company,
      position: user.position,
      industry: user.industry,
      city: user.city,
      bio: user.bio,
      hardcoreTags: user.hardcoreTags,
      need: user.need,
      isTrusted: user.isTrusted,
      isFeatured: user.isFeatured,
      status: user.status,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}
