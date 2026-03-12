import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations, visitRecords, users, activities, visits } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';

// GET - 获取所有待审批记录
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // activity, visit, 或空（全部）
    const status = searchParams.get('status') || 'registered'; // registered（待审批）, approved, rejected

    let data: any[] = [];

    // 活动报名记录
    if (!type || type === 'activity') {
      const activityData = await db
        .select({
          id: activityRegistrations.id,
          activityId: activityRegistrations.activity_id,
          userId: activityRegistrations.user_id,
          status: activityRegistrations.status,
          registeredAt: activityRegistrations.registered_at,
          reviewedAt: activityRegistrations.reviewed_at,
          note: activityRegistrations.note,
          userName: users.name,
          userPhone: users.phone,
          userEmail: users.email,
          userCompany: users.company,
          userPosition: users.position,
          activityTitle: activities.title,
          activityDate: activities.date,
          registrationType: sql<string>`'activity'`,
        })
        .from(activityRegistrations)
        .leftJoin(users, eq(activityRegistrations.user_id, users.id))
        .leftJoin(activities, eq(activityRegistrations.activity_id, activities.id))
        .where(status ? eq(activityRegistrations.status, status) : undefined)
        .orderBy(desc(activityRegistrations.registered_at));

      data = [...data, ...activityData];
    }

    // 探访报名记录
    if (!type || type === 'visit') {
      const visitData = await db
        .select({
          id: visitRecords.id,
          visitId: visitRecords.visit_id,
          userId: visitRecords.user_id,
          status: visitRecords.status,
          registeredAt: visitRecords.registered_at,
          completedAt: visitRecords.completed_at,
          userName: users.name,
          userPhone: users.phone,
          userEmail: users.email,
          visitCompanyName: visits.company_name,
          visitDate: visits.date,
          registrationType: sql<string>`'visit'`,
        })
        .from(visitRecords)
        .leftJoin(users, eq(visitRecords.user_id, users.id))
        .leftJoin(visits, eq(visitRecords.visit_id, visits.id))
        .where(status ? eq(visitRecords.status, status) : undefined)
        .orderBy(desc(visitRecords.registered_at));

      data = [...data, ...visitData];
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取待审批记录失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取待审批记录失败',
      },
      { status: 500 }
    );
  }
}
