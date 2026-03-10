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
      subtitle: activity.subtitle,
      date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : '',
      time: activity.start_date && activity.end_date ? `${activity.start_date.toString().slice(11,16)}-${activity.end_date.toString().slice(11,16)}` : '09:00-17:00',
      location: activity.address,
      type: activity.category,
      enrolled: 0, // 需要从 activity_registrations 表查询
      max: activity.capacity || 0,
      tags: [activity.category, activity.status === 'active' ? '报名中' : '草稿'],
      status: activity.status,
      pendingApplications: 0,
      category: activity.category,
      description: activity.description,
      image: activity.image,
      address: activity.address,
      capacity: activity.capacity || 0,
      teaFee: activity.tea_fee || 0,
      createdBy: activity.created_by,
      createdAt: activity.created_at || '',
      updatedAt: activity.updated_at || '',
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
