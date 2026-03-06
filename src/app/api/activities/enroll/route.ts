import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.activityId || !body.userId || !body.userName || !body.userPhone) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    const { activityId, userId, userName, userPhone, reason } = body;

    // 检查活动是否存在
    const activity = MockDatabase.getActivityById(parseInt(activityId));
    if (!activity) {
      return NextResponse.json({
        success: false,
        error: '活动不存在'
      }, { status: 404 });
    }

    // 检查活动是否已结束
    if (activity.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: '活动已结束'
      }, { status: 400 });
    }

    // 检查用户是否已经报名
    const existingStatus = MockDatabase.getUserActivityRegistrationStatus(userId.toString(), activityId.toString());
    if (existingStatus) {
      return NextResponse.json({
        success: false,
        error: '您已经报名过该活动',
        data: { status: existingStatus }
      }, { status: 400 });
    }

    // 检查是否已经有待审核的申请
    const existingApplication = MockDatabase.getActivityApplicationsByUserId(userId.toString()).find(
      app => app.activityId === activityId.toString()
    );
    if (existingApplication) {
      return NextResponse.json({
        success: false,
        error: '您的申请正在审核中',
        data: { status: existingApplication.status }
      }, { status: 400 });
    }

    // 检查活动容量
    const registrations = MockDatabase.getActivityRegistrationsByActivityId(activityId.toString());
    const approvedCount = registrations.filter(r => r.status === 'approved').length;
    if (approvedCount >= activity.capacity) {
      return NextResponse.json({
        success: false,
        error: '活动已满员'
      }, { status: 400 });
    }

    // 创建报名申请
    const application = MockDatabase.createActivityApplication({
      activityId: activityId.toString(),
      userId: userId.toString(),
      reason: reason || '希望参加活动',
    });

    return NextResponse.json({
      success: true,
      message: '报名申请已提交，请等待审核',
      data: {
        applicationId: application.id,
        status: application.status,
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
