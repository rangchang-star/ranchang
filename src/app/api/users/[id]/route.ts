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
      gender: user.gender,
      age: user.age,
      email: user.email,
      industry: user.industry,
      company: user.company,
      companyScale: user.companyScale,
      position: user.position,
      level: user.level,
      need: user.need,
      tagStamp: user.tagStamp,
      abilityTags: user.abilityTags,
      hardcoreTags: user.hardcoreTags,
      resourceTags: user.resourceTags,
      experience: user.experience,
      achievement: user.achievement,
      declaration: user.declaration,
      connectionType: user.connectionType,
      joinDate: user.joinDate,
      lastLogin: user.lastLogin,
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
        gender: body.gender,
        age: body.age,
        email: body.email,
        industry: body.industry,
        company: body.company,
        companyScale: body.companyScale,
        position: body.position,
        need: body.need,
        tagStamp: body.tagStamp,
        abilityTags: body.abilityTags,
        hardcoreTags: body.hardcoreTags,
        resourceTags: body.resourceTags,
        experience: body.experience,
        achievement: body.achievement,
        declaration: body.declaration,
        connectionType: body.connectionType,
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
