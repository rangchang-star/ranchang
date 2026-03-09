import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { db, activities: activitiesTable, registrations: registrationsTable, users: usersTable } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 获取活动信息
    const dbActivities = await db.select().from(activitiesTable).where(eq(activitiesTable.id, id));

    if (dbActivities.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    const activity = dbActivities[0];

    // 获取活动的参与记录
    const dbRegistrations = await db.select().from(registrationsTable).where(eq(registrationsTable.activityId, id));

    // 获取报名用户的详细信息
    const registrations = await Promise.all(
      dbRegistrations.map(async (registration) => {
        const dbUsers = await db.select().from(usersTable).where(eq(usersTable.id, registration.userId));
        const user = dbUsers[0];

        return {
          id: registration.userId,
          activityId: id,
          userId: registration.userId,
          userName: user?.nickname || user?.name || '未知',
          userPhone: user?.phone || '未知',
          userCompany: user?.company || '未知',
          userPosition: user?.position || '未知',
          userAvatar: user?.avatar || '',
          status: registration.status,
          registeredAt: registration.createdAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        activity: {
          id: activity.id,
          title: activity.title,
          subtitle: activity.subtitle,
          category: activity.category,
          capacity: activity.capacity,
          teaFee: activity.teaFee,
          startDate: activity.startDate,
          endDate: activity.endDate,
          address: activity.address,
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
