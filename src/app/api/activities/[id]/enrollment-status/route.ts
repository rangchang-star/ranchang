import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: '缺少用户ID参数'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, activityApplications, activityRegistrations } = await import('@/storage/database/supabase/connection');
    const { eq, and } = await import('drizzle-orm');

    // 检查用户是否有待审核的申请
    const applications = await db.select()
      .from(activityApplications)
      .where(
        and(
          eq(activityApplications.user_id, parseInt(userId)),
          eq(activityApplications.activity_id, parseInt(activityId))
        )
      );

    // 检查用户是否已经有参与记录
    const registrations = await db.select()
      .from(activityRegistrations)
      .where(
        and(
          eq(activityRegistrations.user_id, parseInt(userId)),
          eq(activityRegistrations.activity_id, parseInt(activityId))
        )
      );

    let status = null;
    if (applications.length > 0 && applications[0].status === 'pending') {
      status = 'pending';
    } else if (registrations.length > 0) {
      status = registrations[0].status;
    }

    return NextResponse.json({
      success: true,
      data: {
        status: status, // null: 未报名, pending: 待审核, approved: 已通过, rejected: 已拒绝, completed: 已完成
      }
    });
  } catch (error: any) {
    console.error('获取报名状态失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取报名状态失败'
    }, { status: 500 });
  }
}
