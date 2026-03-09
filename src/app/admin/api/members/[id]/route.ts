import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const dbUsers = await db.select().from(users).where(eq(users.id, id));

    if (dbUsers.length === 0) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    const user = dbUsers[0];

    // 转换为前端需要的格式
    const memberData = {
      id: user.id.toString(),
      // 基本信息
      name: user.nickname || user.name,
      age: user.age,
      avatar: user.avatar,
      connectionType: user.connectionType || 'personLookingForJob',
      industry: user.industry,
      need: user.need,
      hardcoreTags: user.abilityTags || [],
      resourceTags: user.resourceTags || [],

      // 后台标签（暂时使用空数组）
      adminTags: [],

      // 公司信息
      phone: user.phone,
      email: '', // 数据库中没有email字段
      company: user.company,
      position: user.position,
      faith: '', // 数据库中没有faith字段

      // 其他信息
      level: user.isFeatured ? '活跃会员' : '种子会员',
      joinDate: user.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : new Date(user.createdAt).toISOString().split('T')[0],
      status: user.status || 'active',
      isFeatured: user.isFeatured,
      role: 'user',
      bio: user.bio,
      connectionCount: 0,
      activityCount: 0,

      // 高燃宣告（暂时为空）
      declaration: null,

      // 量表评估（暂时为空）
      assessments: [],

      // 探访记录（暂时为空）
      visitRecords: [],

      // 参与活动（暂时为空）
      activities: [],
    };

    return NextResponse.json({
      success: true,
      data: memberData,
    });
  } catch (error) {
    console.error('获取会员详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取会员详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.update(users)
      .set({
        name: body.name,
        nickname: body.name,
        age: body.age,
        industry: body.industry,
        company: body.company,
        position: body.position,
        bio: body.bio,
        need: body.need,
        abilityTags: body.hardcoreTags,
        resourceTags: body.resourceTags,
        connectionType: body.connectionType,
        isFeatured: body.isFeatured,
        avatar: body.avatar,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '用户不存在或更新失败'
      }, { status: 404 });
    }

    const updatedUser = result[0];

    return NextResponse.json({
      success: true,
      message: '会员信息更新成功',
      data: updatedUser,
    });
  } catch (error) {
    console.error('更新会员信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新会员信息失败' },
      { status: 500 }
    );
  }
}
