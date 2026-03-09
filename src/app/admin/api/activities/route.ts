import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { db, activities: activitiesTable } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const dbActivities = await db.select().from(activitiesTable).orderBy(desc(activitiesTable.createdAt));

    // 转换数据格式以适配后台管理页面
    const activities = dbActivities.map((activity: any) => ({
      id: activity.id.toString(),
      title: activity.title,
      subtitle: activity.subtitle || '',
      date: activity.startDate ? activity.startDate.split('T')[0] : '',
      time: activity.startDate && activity.endDate
        ? `${activity.startDate.split('T')[1]?.substring(0, 5) || '09:00'}-${activity.endDate.split('T')[1]?.substring(0, 5) || '17:00'}`
        : '09:00-17:00',
      location: activity.address,
      type: activity.category,
      enrolled: 0, // 需要从报名表计算
      max: activity.capacity || 0,
      tags: [activity.category, activity.status === 'active' ? '报名中' : '已结束'],
      status: activity.status,
      pendingApplications: 0, // 需要从报名数据计算
      category: activity.category,
      description: activity.description,
      image: activity.image,
      address: activity.address,
      capacity: activity.capacity || 0,
      teaFee: activity.teaFee || 0,
      createdBy: activity.createdBy?.toString() || '',
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
