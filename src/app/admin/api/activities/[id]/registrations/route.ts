import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations, appUsers, activities } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';

// GET - 获取活动的所有报名信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 查询活动信息
    const activity = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1);

    if (activity.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    // 查询报名信息（关联用户信息）
    const registrations = await db
      .select({
        id: activityRegistrations.id,
        activityId: activityRegistrations.activityId,
        userId: activityRegistrations.userId,
        userName: appUsers.name,
        userPhone: appUsers.phone,
        userCompany: appUsers.company,
        userPosition: appUsers.position,
        userAvatar: appUsers.avatar,
        status: activityRegistrations.status,
        paymentStatus: activityRegistrations.paymentStatus,
        note: activityRegistrations.note,
        createdAt: activityRegistrations.createdAt,
        updatedAt: activityRegistrations.updatedAt,
      })
      .from(activityRegistrations)
      .innerJoin(appUsers, eq(activityRegistrations.userId, appUsers.id))
      .where(eq(activityRegistrations.activityId, id))
      .orderBy(desc(activityRegistrations.createdAt));

    // 计算统计数据
    const statistics = {
      total: registrations.length,
      pending: registrations.filter(r => r.status === 'pending').length,
      approved: registrations.filter(r => r.status === 'approved').length,
      rejected: registrations.filter(r => r.status === 'rejected').length,
      cancelled: registrations.filter(r => r.status === 'cancelled').length,
    };

    // 格式化活动信息
    const activityInfo = {
      id: activity[0].id,
      title: activity[0].title,
      subtitle: activity[0].subtitle,
      category: activity[0].type,
      capacity: activity[0].capacity,
      startDate: activity[0].startDate,
      endDate: activity[0].endDate,
      location: activity[0].location,
    };

    // 格式化报名信息
    const formattedRegistrations = registrations.map(reg => ({
      id: reg.id,
      activityId: reg.activityId,
      userId: reg.userId,
      userName: reg.userName,
      userPhone: reg.userPhone,
      userCompany: reg.userCompany,
      userPosition: reg.userPosition,
      userAvatar: reg.userAvatar,
      status: reg.status,
      paymentStatus: reg.paymentStatus,
      note: reg.note,
      registeredAt: reg.createdAt,
      updatedAt: reg.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        activity: activityInfo,
        registrations: formattedRegistrations,
        statistics,
      },
    });
  } catch (error) {
    console.error('获取报名信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取报名信息失败' },
      { status: 500 }
    );
  }
}
