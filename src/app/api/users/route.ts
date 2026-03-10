import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 前台使用真实的 ran_field 数据库
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field');

    if (!connectionString || connectionString === '') {
      return NextResponse.json({
        success: false,
        error: '未配置数据库连接'
      }, { status: 500 });
    }

    // 创建临时的数据库连接
    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { users } = await import('@/storage/database/supabase/schema');
    const { desc } = await import('drizzle-orm');

    // 使用 ran_field 数据库
    const client = postgres(connectionString, {
      max: 10,
      ssl: false,
      connection: {
        application_name: 'ran-field-app-frontend',
      },
    });

    const frontendDb = drizzle(client);

    const result = await frontendDb.select().from(users).orderBy(desc(users.created_at));

    await client.end();

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

    // 前台使用真实的 ran_field 数据库
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field');

    if (!connectionString || connectionString === '') {
      return NextResponse.json({
        success: false,
        error: '未配置数据库连接'
      }, { status: 500 });
    }

    // 验证必填字段
    if (!body.phone || !body.name) {
      return NextResponse.json({
        success: false,
        error: '手机号和姓名不能为空'
      }, { status: 400 });
    }

    // 创建临时的数据库连接
    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { users } = await import('@/storage/database/supabase/schema');

    // 使用 ran_field 数据库
    const client = postgres(connectionString, {
      max: 10,
      ssl: false,
      connection: {
        application_name: 'ran-field-app-frontend',
      },
    });

    const frontendDb = drizzle(client);

    const result = await frontendDb.insert(users).values({
      id: randomUUID(),
      phone: body.phone,
      name: body.name,
      avatar: body.avatar || null,
      age: body.age || null,
      email: body.email || null,
      connection_type: body.connection_type || null,
      industry: body.industry || null,
      need: body.need || null,
      ability_tags: body.ability_tags || [],
      resource_tags: body.resource_tags || [],
      level: body.level || null,
      company: body.company || null,
      position: body.position || null,
      status: body.status || 'active',
      is_featured: body.is_featured || false,
      join_date: new Date(),
      last_login: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    await client.end();

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
