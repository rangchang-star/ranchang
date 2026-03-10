import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证用户登录状态
    const authResult = await requireAuth(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      }, { status: authResult.statusCode || 401 });
    }

    // 验证必填字段
    if (!body.activityId) {
      return NextResponse.json({
        success: false,
        error: '活动ID不能为空'
      }, { status: 400 });
    }

    const activityId = parseInt(body.activityId);
    const userId = parseInt(authResult.user!.id);

    // 验证当前登录用户
    if (!authResult.user!.id) {
      return NextResponse.json({
        success: false,
        error: '用户ID无效'
      }, { status: 400 });
    }

    // 从数据库检查活动是否存在
    const { db, activities, activityRegistrations } = await import('@/storage/database/supabase/connection');
    const { eq, and, count } = await import('drizzle-orm');

    const dbActivities = await db.select().from(activities).where(eq(activities.id, activityId));

    if (!dbActivities || dbActivities.length === 0) {
      return NextResponse.json({
        success: false,
        error: '活动不存在'
      }, { status: 404 });
    }

    const activity = dbActivities[0];

    // 检查活动状态
    if (activity.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: '活动未开放报名'
      }, { status: 400 });
    }

    // 检查用户是否已经报名
    const existingRegistrations = await db
      .select()
      .from(activityRegistrations)
      .where(and(
        eq(activityRegistrations.activity_id, activityId),
        eq(activityRegistrations.user_id, userId)
      ));

    if (existingRegistrations && existingRegistrations.length > 0) {
      return NextResponse.json({
        success: false,
        error: '您已经报名过该活动',
        data: { status: existingRegistrations[0].status }
      }, { status: 400 });
    }

    // 检查活动容量
    const [countResult] = await db
      .select({ count: count() })
      .from(activityRegistrations)
      .where(eq(activityRegistrations.activity_id, activityId));

    const currentRegistrations = countResult?.count || 0;

    if (activity.capacity && currentRegistrations >= activity.capacity) {
      return NextResponse.json({
        success: false,
        error: '活动已满员'
      }, { status: 400 });
    }

    // 创建报名记录
    const result = await db.insert(activityRegistrations).values({
      activity_id: activityId,
      user_id: userId,
      status: 'registered',
      registered_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: '报名成功',
      data: result[0]
    });
  } catch (error: any) {
    console.error('提交报名申请失败:', error);
    return NextResponse.json({
      success: false,
      error: '提交报名申请失败: ' + error.message
    }, { status: 500 });
  }
}
