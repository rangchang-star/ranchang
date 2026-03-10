import { NextRequest, NextResponse } from 'next/server';

// GET - 获取报名列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const activityId = searchParams.get('activityId');
    const visitId = searchParams.get('visitId');

    if (!userId && !activityId && !visitId) {
      return NextResponse.json({
        success: false,
        error: '请提供至少一个查询参数'
      }, { status: 400 });
    }

    const { db, registrations, activityRegistrations } = await import('@/storage/database/supabase/connection');
    const { eq, and, desc, sql } = await import('drizzle-orm');

    let result;

    // 根据查询参数选择查询哪个表
    if (activityId) {
      // 查询活动报名记录
      const conditions = [];
      if (userId) conditions.push(eq(activityRegistrations.user_id, parseInt(userId)));
      conditions.push(eq(activityRegistrations.activity_id, parseInt(activityId)));

      result = await db.select().from(activityRegistrations)
        .where(and(...conditions))
        .orderBy(desc(activityRegistrations.registered_at));
    } else if (visitId) {
      // 查询探访报名记录
      const conditions = [];
      if (userId) conditions.push(eq(registrations.user_id, parseInt(userId)));
      conditions.push(eq(registrations.visit_id, parseInt(visitId)));

      result = await db.select().from(registrations)
        .where(and(...conditions))
        .orderBy(desc(registrations.created_at));
    } else if (userId) {
      // 查询用户的所有报名记录（使用 registrations 表）
      result = await db.select().from(registrations)
        .where(eq(registrations.user_id, parseInt(userId)))
        .orderBy(desc(registrations.created_at));
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取报名列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取报名列表失败'
    }, { status: 500 });
  }
}

// POST - 创建报名记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityId, visitId } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: '用户ID不能为空'
      }, { status: 400 });
    }

    if (!activityId && !visitId) {
      return NextResponse.json({
        success: false,
        error: '活动ID或探访ID不能为空'
      }, { status: 400 });
    }

    const { db, registrations, activityRegistrations } = await import('@/storage/database/supabase/connection');
    const { eq, and, count } = await import('drizzle-orm');

    let result;

    // 根据类型创建报名记录
    if (activityId) {
      // 检查是否已经报名
      const existingRegistration = await db.select()
        .from(activityRegistrations)
        .where(and(
          eq(activityRegistrations.user_id, parseInt(userId)),
          eq(activityRegistrations.activity_id, parseInt(activityId)),
        ));

      if (existingRegistration && existingRegistration.length > 0) {
        return NextResponse.json({
          success: false,
          error: '您已经报名过此活动'
        }, { status: 400 });
      }

      // 创建活动报名记录
      result = await db.insert(activityRegistrations).values({
        activity_id: parseInt(activityId),
        user_id: parseInt(userId),
        status: 'registered',
        registered_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();
    } else {
      // 检查是否已经报名
      const existingRegistration = await db.select()
        .from(registrations)
        .where(and(
          eq(registrations.user_id, parseInt(userId)),
          eq(registrations.visit_id, parseInt(visitId!)),
        ));

      if (existingRegistration && existingRegistration.length > 0) {
        return NextResponse.json({
          success: false,
          error: '您已经报名过此探访'
        }, { status: 400 });
      }

      // 创建探访报名记录
      result = await db.insert(registrations).values({
        user_id: parseInt(userId),
        visit_id: parseInt(visitId!),
        status: 'registered',
        created_at: new Date(),
      }).returning();
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: '报名成功'
    });
  } catch (error: any) {
    console.error('创建报名失败:', error);

    return NextResponse.json({
      success: false,
      error: '创建报名失败: ' + error.message
    }, { status: 500 });
  }
}
