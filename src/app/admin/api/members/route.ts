import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { desc, like, eq, and, or } from 'drizzle-orm';

// GET - 获取会员列表（后台）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let query = db.select().from(appUsers).orderBy(desc(appUsers.createdAt));

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(appUsers.nickname, `%${search}%`),
          like(appUsers.name, `%${search}%`),
          like(appUsers.phone, `%${search}%`)
        )
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
      bio: user.bio,
      industry: user.industry,
      company: user.company,
      position: user.position,
      level: user.level,
      achievement: user.achievement,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取会员列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取会员列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建会员（后台）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newUser = await db
      .insert(appUsers)
      .values({
        id: crypto.randomUUID(),
        phone: body.phone,
        nickname: body.nickname,
        name: body.name,
        avatar: body.avatar,
        bio: body.bio,
        industry: body.industry,
        company: body.company,
        position: body.position,
        level: body.level || 1,
        status: body.status || 'active',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newUser[0],
    });
  } catch (error) {
    console.error('创建会员失败:', error);
    return NextResponse.json(
      { success: false, error: '创建会员失败' },
      { status: 500 }
    );
  }
}
