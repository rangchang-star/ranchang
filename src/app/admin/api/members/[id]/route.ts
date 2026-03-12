import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers, userFavorites } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取成员详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await db
      .select()
      .from(appUsers)
      .where(eq(appUsers.id, id))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, error: '成员不存在' },
        { status: 404 }
      );
    }

    // 获取收藏统计
    const favorites = await db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, id));

    return NextResponse.json({
      success: true,
      data: {
        ...user[0],
        favoritesCount: favorites.length,
      },
    });
  } catch (error) {
    console.error('获取成员详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取成员详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新成员信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(appUsers)
      .set({
        nickname: body.nickname,
        bio: body.bio,
        avatar: body.avatar,
        age: body.age,
        gender: body.gender,
        city: body.city,
        hardcoreTags: body.hardcoreTags,
        tags: body.tags,
        need: body.need,
        isTrusted: body.isTrusted,
        isFeatured: body.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(appUsers.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: '成员不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新成员信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新成员信息失败' },
      { status: 500 }
    );
  }
}
