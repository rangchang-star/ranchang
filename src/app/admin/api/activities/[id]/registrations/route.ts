import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations, users, activities } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET - 获取活动报名列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 获取活动信息
    const activityList = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1);

    const activityInfo = activityList[0] || null;

    // 获取报名记录
    const registrations = await db
      .select({
        id: activityRegistrations.id,
        activityId: activityRegistrations.activity_id,
        userId: activityRegistrations.user_id,
        status: activityRegistrations.status,
        registeredAt: activityRegistrations.registered_at,
        reviewedAt: activityRegistrations.reviewed_at,
        note: activityRegistrations.note,
        userName: users.name,
        userAvatar: users.avatar,
        userEmail: users.email,
        userPhone: users.phone,
        userCompany: users.company,
        userPosition: users.position,
      })
      .from(activityRegistrations)
      .leftJoin(users, eq(activityRegistrations.user_id, users.id))
      .where(eq(activityRegistrations.activity_id, id))
      .orderBy(desc(activityRegistrations.registered_at));

    // 计算统计数据
    const statistics = {
      total: registrations.length,
      approved: registrations.filter((r: any) => r.status === 'approved').length,
      pending: registrations.filter((r: any) => r.status === 'registered').length,
      rejected: registrations.filter((r: any) => r.status === 'rejected').length,
      completed: registrations.filter((r: any) => r.status === 'completed').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        activity: activityInfo,
        registrations,
        statistics,
      },
    });
  } catch (error) {
    console.error('获取报名列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取报名列表失败',
      },
      { status: 500 }
    );
  }
}
