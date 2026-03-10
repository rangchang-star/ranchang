import { NextRequest, NextResponse } from 'next/server';

// 获取所有每日宣告
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
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';

    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { dailyDeclarations } = await import('@/storage/database/supabase/schema');
    const { desc } = await import('drizzle-orm');

    // 创建单个连接（不使用连接池）
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    const db = drizzle(client);

    const declarations = await db.select().from(dailyDeclarations).orderBy(desc(dailyDeclarations.date));

    // 立即关闭连接
    await client.end();

    return NextResponse.json({
      success: true,
      data: declarations,
    });
  } catch (error: any) {
    console.error('获取每日宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日宣告失败: ' + error.message },
      { status: 500 }
    );
  }
}

// 创建每日宣告
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
    if (!body.title || !body.date || !body.image || !body.audio) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');

    const result = await db.insert(dailyDeclarations).values({
      title: body.title,
      date: new Date(body.date),
      image: body.image,
      audio: body.audio,
      summary: body.summary || '',
      text: body.text || '',
      icon_type: body.icon_type || '',
      rank: body.rank || 0,
      profile: body.profile || '',
      duration: body.duration || '',
      views: body.views || 0,
      is_featured: body.is_featured || false,
    }).returning();

    return NextResponse.json({
      success: true,
      message: '每日宣告创建成功',
      data: result[0]
    });
  } catch (error: any) {
    console.error('创建每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建每日宣告失败: ' + error.message
    }, { status: 500 });
  }
}
