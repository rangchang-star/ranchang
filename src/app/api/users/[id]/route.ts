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
      age: user.age,
      email: user.email,
      industry: user.industry,
      // 新增的字段
      status: user.status,
      level: user.level,
      hardcoreTags: user.hardcoreTags,
      isFeatured: user.isFeatured,
      isTrusted: user.isTrusted,
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

    // 构建更新对象，只更新存在的字段
    const updateData: any = {
      updatedAt: new Date(),
    };

    // 只更新真实环境存在的字段
    if (body.nickname !== undefined) updateData.nickname = body.nickname;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.age !== undefined) updateData.age = body.age;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.industry !== undefined) updateData.industry = body.industry;

    // 新增的字段
    if (body.status !== undefined) updateData.status = body.status;
    if (body.level !== undefined) updateData.level = body.level;
    if (body.hardcoreTags !== undefined) updateData.hardcore_tags = body.hardcoreTags;
    if (body.isFeatured !== undefined) updateData.is_featured = body.isFeatured;
    if (body.isTrusted !== undefined) updateData.is_trusted = body.isTrusted;

    const updatedUser = await db
      .update(appUsers)
      .set(updateData as any)
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

// DELETE - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 先检查用户是否存在
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

    // 删除用户
    await db.delete(appUsers).where(eq(appUsers.id, id));

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    );
  }
}
