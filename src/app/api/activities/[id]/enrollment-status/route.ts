import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

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

    // 检查用户是否有待审核的申请
    const application = MockDatabase.getActivityApplicationsByUserId(userId).find(
      app => app.activityId === activityId
    );

    // 检查用户是否已经有参与记录
    const registrationStatus = MockDatabase.getUserActivityRegistrationStatus(userId, activityId);

    let status = null;
    if (application && application.status === 'pending') {
      status = 'pending';
    } else if (registrationStatus) {
      status = registrationStatus;
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
