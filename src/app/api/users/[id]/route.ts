import { NextRequest, NextResponse } from 'next/server';

// 字段名转换函数：snake_case -> camelCase
function convertToCamelCase(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // 如果是 Date 对象，直接返回
  if (data instanceof Date) {
    return data.toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(item => convertToCamelCase(item));
  }

  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // 转换 snake_case 到 camelCase
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelCaseKey] = convertToCamelCase(data[key]);
      }
    }
    return result;
  }

  return data;
}

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

    // 转换字段名为 camelCase
    const convertedData = convertToCamelCase(result[0]);

    return NextResponse.json({
      success: true,
      data: convertedData
    });
  } catch (error: any) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户详情失败: ' + error.message
    }, { status: 500 });
  }
}

export async function DELETE(
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

    // 直接创建数据库连接，避免连接池满的问题
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';

    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { users } = await import('@/storage/database/supabase/schema');
    const { eq } = await import('drizzle-orm');

    // 创建单个连接（不使用连接池）
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    const db = drizzle(client);

    // 先检查用户是否存在
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (result.length === 0) {
      await client.end();
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    // 删除用户
    await db.delete(users).where(eq(users.id, id));

    // 立即关闭连接
    await client.end();

    return NextResponse.json({
      success: true,
      message: '用户删除成功',
      data: { id }
    });
  } catch (error: any) {
    console.error('删除用户失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除用户失败: ' + error.message
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

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 直接创建数据库连接，避免连接池满的问题
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';

    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { users } = await import('@/storage/database/supabase/schema');
    const { eq } = await import('drizzle-orm');

    // 创建单个连接（不使用连接池）
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    const db = drizzle(client);

    // 构建更新对象，只包含传入的字段
    const updateData: any = {
      updated_at: new Date(),
    };

    // 动态添加字段
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.age !== undefined) updateData.age = body.age;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.industry !== undefined) updateData.industry = body.industry;
    if (body.need !== undefined) updateData.need = body.need;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.tag_stamp !== undefined) updateData.tag_stamp = body.tag_stamp;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.hardcore_tags !== undefined) updateData.hardcore_tags = body.hardcore_tags;
    if (body.resource_tags !== undefined) updateData.resource_tags = body.resource_tags;

    // 更新用户数据
    await db.update(users)
      .set(updateData)
      .where(eq(users.id, id));

    // 立即关闭连接
    await client.end();

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
