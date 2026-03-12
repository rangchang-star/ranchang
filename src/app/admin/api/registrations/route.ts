import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations, visitRecords, users, activities, visits } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';

// GET - 获取所有报名记录（活动和探访）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || ''; // activity 或 visit

    let data: any[] = [];

    if (type === 'activity' || type === '') {
      const activityRegistrationsList = await db
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
          activityTitle: activities.title,
          activityDate: activities.date,
          type: sql<string>`'activity'`,
        })
        .from(activityRegistrations)
        .leftJoin(users, eq(activityRegistrations.user_id, users.id))
        .leftJoin(activities, eq(activityRegistrations.activity_id, activities.id))
        .orderBy(desc(activityRegistrations.registered_at));

      data = [...data, ...activityRegistrationsList.map(r => ({ ...r, registrationType: 'activity' }))];
    }

    if (type === 'visit' || type === '') {
      const visitRecordsList = await db
        .select({
          id: visitRecords.id,
          visitId: visitRecords.visit_id,
          userId: visitRecords.user_id,
          status: visitRecords.status,
          registeredAt: visitRecords.registered_at,
          completedAt: visitRecords.completed_at,
          userName: users.name,
          userAvatar: users.avatar,
          userEmail: users.email,
          visitCompanyName: visits.company_name,
          visitDate: visits.date,
          type: sql<string>`'visit'`,
        })
        .from(visitRecords)
        .leftJoin(users, eq(visitRecords.user_id, users.id))
        .leftJoin(visits, eq(visitRecords.visit_id, visits.id))
        .orderBy(desc(visitRecords.registered_at));

      data = [...data, ...visitRecordsList.map(r => ({ ...r, registrationType: 'visit' }))];
    }

    return NextResponse.json({
      success: true,
      data: data,
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
