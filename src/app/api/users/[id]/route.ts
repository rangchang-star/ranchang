import { NextRequest, NextResponse } from 'next/server';

// 字段名转换：snake_case -> camelCase
const convertToCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertToCamelCase);
  if (typeof obj !== 'object') return obj;

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = convertToCamelCase(obj[key]);
    }
  }
  return result;
};

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

    const { client } = await import('@/storage/database/supabase/connection');

    // 使用原生 SQL 查询，显式指定 public schema
    const result = await client`
      SELECT id, name, age, avatar, phone, email, gender, company, company_scale, position, industry, need, tag_stamp, ability_tags, hardcore_tags, resource_tags, level, connection_type, status, is_featured, join_date, last_login, created_at, updated_at
      FROM public.users
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: convertToCamelCase(result[0])
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

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 先检查用户是否存在
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    // 删除用户
    await db.delete(users).where(eq(users.id, id));

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

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 构建更新对象，只包含传入的字段
    const updateData: any = {
      updated_at: new Date(),
    };

    // 动态添加字段
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.age !== undefined) updateData.age = body.age;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.company_scale !== undefined) updateData.company_scale = body.company_scale;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.industry !== undefined) updateData.industry = body.industry;
    if (body.need !== undefined) updateData.need = body.need;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.ability_tags !== undefined) updateData.ability_tags = body.ability_tags;
    if (body.hardcore_tags !== undefined) updateData.hardcore_tags = body.hardcore_tags;
    if (body.resource_tags !== undefined) updateData.resource_tags = body.resource_tags;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.tag_stamp !== undefined) updateData.tag_stamp = body.tag_stamp;

    // 更新用户数据
    await db.update(users)
      .set(updateData)
      .where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      message: '用户信息更新成功',
      data: { id }
    });
  } catch (error: any) {
    console.error('更新用户失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新用户失败: ' + error.message
    }, { status: 500 });
  }
}
