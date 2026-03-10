import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { db, activities: activitiesTable, activityRegistrations: activityRegistrationsTable, users: usersTable } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 验证并转换 ID 为数字类型
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: '无效的活动 ID' },
        { status: 400 }
      );
    }

    // 获取活动信息
    const dbActivities = await db.select().from(activitiesTable).where(eq(activitiesTable.id, numericId));

    if (dbActivities.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    const activity = dbActivities[0];

    // 获取活动的参与记录
    const dbRegistrations = await db.select().from(activityRegistrationsTable).where(eq(activityRegistrationsTable.activityId, id));

    // 获取报名用户的详细信息
    const registrations = await Promise.all(
      dbRegistrations.map(async (registration) => {
        const dbUsers = await db.select().from(usersTable).where(eq(usersTable.id, registration.userId));
        const user = dbUsers[0];

        return {
          id: registration.userId,
          activityId: id,
          userId: registration.userId,
          userName: user?.name || '未知',
          userPhone: user?.phone || '未知',
          userCompany: user?.company || '未知',
          userPosition: user?.position || '未知',
          userAvatar: user?.avatar || '',
          status: registration.status,
          registeredAt: registration.registeredAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        activity: {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          date: activity.date,
          startTime: activity.start_time,
          endTime: activity.end_time,
          location: activity.location,
          capacity: activity.capacity,
          type: activity.type,
          coverImage: activity.cover_image,
        },
        registrations: registrations,
        statistics: {
          total: registrations.length,
          registered: registrations.filter((r) => r.status === 'registered').length,
          cancelled: registrations.filter((r) => r.status === 'cancelled').length,
        },
      },
    });
  } catch (error) {
    console.error('获取活动报名信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动报名信息失败' },
      { status: 500 }
    );
  }
}
