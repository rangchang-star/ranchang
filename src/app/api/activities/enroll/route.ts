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
    if (!body.activityId || !body.userId || !body.userName || !body.userPhone) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { activityId, userId, userName, userPhone, reason } = body;

    // 验证当前登录用户是否就是请求中的userId
    if (authResult.user!.id !== parseInt(userId)) {
      return NextResponse.json({
        success: false,
        error: '只能为自己报名活动'
      }, { status: 403 });
    }

    const { db, activities, activityApplications, activityRegistrations } = await import('@/storage/database/supabase/connection');
    const { eq, and } = await import('drizzle-orm');

    // 检查活动是否存在
    const activityData = await db.select().from(activities).where(eq(activities.id, parseInt(activityId)));
    if (activityData.length === 0) {
      return NextResponse.json({
        success: false,
        error: '活动不存在'
      }, { status: 404 });
    }

    const activity = activityData[0];

    // 检查活动是否已结束
    if (activity.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: '活动已结束'
      }, { status: 400 });
    }

    // 检查用户是否已经报名
    const existingRegistrations = await db.select()
      .from(activityRegistrations)
      .where(
        and(
          eq(activityRegistrations.activity_id, parseInt(activityId)),
          eq(activityRegistrations.user_id, parseInt(userId))
        )
      );

    if (existingRegistrations.length > 0) {
      return NextResponse.json({
        success: false,
        error: '您已经报名过该活动',
        data: { status: existingRegistrations[0].status }
      }, { status: 400 });
    }

    // 检查是否已经有待审核的申请
    const existingApplications = await db.select()
      .from(activityApplications)
      .where(
        and(
          eq(activityApplications.activity_id, parseInt(activityId)),
          eq(activityApplications.user_id, parseInt(userId))
        )
      );

    if (existingApplications.length > 0) {
      return NextResponse.json({
        success: false,
        error: '您的申请正在审核中',
        data: { status: existingApplications[0].status }
      }, { status: 400 });
    }

    // 检查活动容量
    const allRegistrations = await db.select()
      .from(activityRegistrations)
      .where(eq(activityRegistrations.activity_id, parseInt(activityId)));

    const approvedCount = allRegistrations.filter(r => r.status === 'approved').length;
    if (activity.capacity && approvedCount >= activity.capacity) {
      return NextResponse.json({
        success: false,
        error: '活动已满员'
      }, { status: 400 });
    }

    // 创建报名申请
    const result = await db.insert(activityApplications).values({
      user_id: parseInt(userId),
      activity_id: parseInt(activityId),
      user_name: userName,
      user_phone: userPhone,
      reason: reason || '希望参加活动',
      status: 'pending',
      created_at: new Date(),
      reviewed_at: null,
      reviewed_by: null,
      review_comment: null,
    }).returning();

    return NextResponse.json({
      success: true,
      message: '报名申请已提交，请等待审核',
      data: {
        applicationId: result[0].id,
        status: result[0].status,
      }
    });
  } catch (error: any) {
    console.error('提交报名申请失败:', error);
    return NextResponse.json({
      success: false,
      error: '提交报名申请失败'
    }, { status: 500 });
  }
}
