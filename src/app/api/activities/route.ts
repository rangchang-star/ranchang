import { NextRequest, NextResponse } from 'next/server';

// GET - 获取活动列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 直接创建数据库连接，避免连接池满的问题
    const connectionString = process.env.DATABASE_URL || '';

    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { activities } = await import('@/storage/database/supabase/schema');
    const { desc } = await import('drizzle-orm');

    // 创建单个连接（不使用连接池）
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    const db = drizzle(client);

    const result = await db.select().from(activities).orderBy(desc(activities.created_at));

    // 立即关闭连接
    await client.end();

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 验证必填字段
    if (!body.title || !body.description) {
      return NextResponse.json({
        success: false,
        error: '请填写标题和描述'
      }, { status: 400 });
    }

    // 插入数据库
    const { db, activities } = await import('@/storage/database/supabase/connection');
    const { sql } = await import('drizzle-orm');
    const result = await db.insert(activities).values({
      id: sql`gen_random_uuid()`,
      title: body.title,
      description: body.description,
      date: body.date ? new Date(body.date) : null,
      start_time: body.start_time || null,
      end_time: body.end_time || null,
      location: body.location || null,
      capacity: body.capacity || null,
      type: body.type || null,
      cover_image: body.cover_image || null,
      status: body.status || 'active',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('创建活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建活动失败: ' + error.message
    }, { status: 500 });
  }
}
