import { NextRequest, NextResponse } from 'next/server';

// 获取单个每日宣告
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const dbDeclarations = await db.select().from(dailyDeclarations).where(eq(dailyDeclarations.id, id));

    if (dbDeclarations.length === 0) {
      return NextResponse.json(
        { success: false, error: '每日宣告不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dbDeclarations[0],
    });
  } catch (error) {
    console.error('获取每日宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日宣告失败' },
      { status: 500 }
    );
  }
}

// 更新每日宣告
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.date) {
      return NextResponse.json({
        success: false,
        error: '请填写标题和日期'
      }, { status: 400 });
    }

    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.update(dailyDeclarations)
      .set({
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
        updated_at: new Date(),
      })
      .where(eq(dailyDeclarations.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: '每日宣告不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '每日宣告更新成功',
      data: result[0]
    });
  } catch (error) {
    console.error('更新每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新每日宣告失败'
    }, { status: 500 });
  }
}

// 删除每日宣告
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.delete(dailyDeclarations)
      .where(eq(dailyDeclarations.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: '每日宣告不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '每日宣告删除成功'
    });
  } catch (error) {
    console.error('删除每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除每日宣告失败'
    }, { status: 500 });
  }
}
