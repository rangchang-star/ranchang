import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { db, activities: activitiesTable } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const dbActivities = await db.select().from(activitiesTable).orderBy(desc(activitiesTable.created_at));

    // 转换数据格式以适配后台管理页面
    const activities = dbActivities.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      subtitle: '',
      date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : '',
      time: activity.startTime && activity.endTime ? `${activity.startTime}-${activity.endTime}` : '09:00-17:00',
      location: activity.location,
      type: activity.type,
      enrolled: activity.registeredCount || 0,
      max: activity.capacity || 0,
      tags: [activity.type, activity.status === 'active' ? '报名中' : '已结束'],
      status: activity.status,
      pendingApplications: 0,
      category: activity.type,
      description: activity.description,
      image: activity.coverImage,
      address: activity.location,
      capacity: activity.capacity || 0,
      teaFee: 0,
      createdBy: '',
      createdAt: activity.createdAt || '',
      updatedAt: activity.updatedAt || '',
    }));

    return NextResponse.json({
      success: true,
      data: activities,
      total: activities.length,
    });
  } catch (error) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动列表失败' },
      { status: 500 }
    );
  }
}
