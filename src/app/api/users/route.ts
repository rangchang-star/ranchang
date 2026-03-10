import { NextRequest, NextResponse } from 'next/server';

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const result = await db.select().from(users).orderBy(desc(users.created_at));

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建用户（注册）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.phone || !body.password) {
      return NextResponse.json({
        success: false,
        error: '手机号和密码不能为空'
      }, { status: 400 });
    }

    const { db, users } = await import('@/storage/database/supabase/connection');

    const result = await db.insert(users).values({
      phone: body.phone,
      password: body.password,
      name: body.name || null,
      avatar: body.avatar || null,
      age: body.age || null,
      company: body.company || null,
      position: body.position || null,
      industry: body.industry || null,
      bio: body.bio || null,
      need: body.need || null,
      tags: body.tags || null,
      hardcore_tags: body.hardcore_tags || null,
      resource_tags: body.resource_tags || null,
      status: body.status || 'active',
      is_trusted: body.is_trusted || false,
      is_featured: body.is_featured || false,
      connection_count: 0,
      activity_count: 0,
      role: body.role || 'user',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('创建用户失败:', error);

    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: '该手机号已被注册'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: '创建用户失败: ' + error.message
    }, { status: 500 });
  }
}
