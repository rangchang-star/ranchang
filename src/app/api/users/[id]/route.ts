import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取用户信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const users = await db
      .select()
      .from(appUsers)
      .where(eq(appUsers.id, id));

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    const user = users[0];

    const data = {
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
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新用户信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedUser = await db
      .update(appUsers)
      .set({
        nickname: body.nickname,
        name: body.name,
        avatar: body.avatar,
        bio: body.bio,
        industry: body.industry,
        company: body.company,
        position: body.position,
        updatedAt: new Date(),
      })
      .where(eq(appUsers.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser[0],
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新用户信息失败' },
      { status: 500 }
    );
  }
}
