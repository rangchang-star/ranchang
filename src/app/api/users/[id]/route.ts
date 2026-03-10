import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户详情失败: ' + error.message
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 验证必填字段
    if (!body.name || !body.phone) {
      return NextResponse.json({
        success: false,
        error: '请填写姓名和手机号'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 更新用户数据
    await db.update(users)
      .set({
        name: body.name || null,
        avatar: body.avatar || null,
        age: body.age || null,
        email: body.email || null,
        connection_type: body.connection_type || null,
        industry: body.industry || null,
        need: body.need || null,
        ability_tags: body.ability_tags || null,
        resource_tags: body.resource_tags || null,
        level: body.level || null,
        company: body.company || null,
        position: body.position || null,
        status: body.status || 'active',
        is_featured: body.is_featured || false,
        updated_at: new Date(),
      })
      .where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      message: '用户信息更新成功',
      data: { id }
    });
  } catch (error: any) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新用户信息失败: ' + error.message
    }, { status: 500 });
  }
}
