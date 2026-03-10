import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const userId = params.id;

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, favorites, visits } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 获取用户收藏的探访
    const userFavorites = await db.select()
      .from(favorites)
      .where(eq(favorites.user_id, parseInt(userId)));

    if (userFavorites.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
      });
    }

    // 获取完整的探访信息
    const visitIds = userFavorites.map(fav => fav.visit_id);
    const visitsResult: any[] = [];

    for (const visitId of visitIds) {
      const visitData = await db.select().from(visits).where(eq(visits.id, visitId));
      if (visitData.length > 0) {
        visitsResult.push(visitData[0]);
      }
    }

    return NextResponse.json({
      success: true,
      data: visitsResult,
      total: visitsResult.length,
    });
  } catch (error: any) {
    console.error('获取收藏的探访失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取收藏的探访失败'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const userId = params.id;
    const { visitId } = await request.json();

    if (!visitId) {
      return NextResponse.json({
        success: false,
        error: '请提供探访ID'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, favorites, visits } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 验证探访是否存在
    const visitData = await db.select().from(visits).where(eq(visits.id, parseInt(visitId)));
    if (visitData.length === 0) {
      return NextResponse.json({
        success: false,
        error: '探访不存在'
      }, { status: 404 });
    }

    // 检查是否已经收藏
    const existing = await db.select()
      .from(favorites)
      .where(
        (await import('drizzle-orm')).and(
          eq(favorites.user_id, parseInt(userId)),
          eq(favorites.visit_id, parseInt(visitId))
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        error: '已经收藏过该探访'
      }, { status: 400 });
    }

    // 添加收藏
    const result = await db.insert(favorites).values({
      user_id: parseInt(userId),
      visit_id: parseInt(visitId),
      created_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: '收藏成功',
      data: result[0]
    });
  } catch (error: any) {
    console.error('添加收藏失败:', error);
    return NextResponse.json({
      success: false,
      error: '添加收藏失败'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return NextResponse.json({
        success: false,
        error: '请提供探访ID'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, favorites } = await import('@/storage/database/supabase/connection');
    const { eq, and } = await import('drizzle-orm');

    // 移除收藏
    const result = await db.delete(favorites)
      .where(
        and(
          eq(favorites.user_id, parseInt(userId)),
          eq(favorites.visit_id, parseInt(visitId))
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '收藏不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '取消收藏成功'
    });
  } catch (error: any) {
    console.error('取消收藏失败:', error);
    return NextResponse.json({
      success: false,
      error: '取消收藏失败'
    }, { status: 500 });
  }
}
