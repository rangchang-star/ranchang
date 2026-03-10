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

    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const declarations = await db.select().from(dailyDeclarations).orderBy(desc(dailyDeclarations.date));

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
    if (!body.title || !body.date) {
      return NextResponse.json({
        success: false,
        error: '请填写标题和日期'
      }, { status: 400 });
    }

    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');

    const result = await db.insert(dailyDeclarations).values({
      title: body.title,
      date: new Date(body.date),
      image: body.image || null,
      audio: body.audio || null,
      summary: body.summary || null,
      text: body.text || null,
      icon_type: body.icon_type || null,
      rank: body.rank || null,
      profile: body.profile || null,
      duration: body.duration || null,
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
