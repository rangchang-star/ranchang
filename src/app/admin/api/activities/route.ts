import { NextRequest, NextResponse } from 'next/server';
import { mockActivities } from '@/lib/mock-database';

export async function GET(request: NextRequest) {
  try {
    // 转换数据格式以适配后台管理页面
    const activities = mockActivities.map((activity) => ({
      id: activity.id.toString(),
      title: activity.title,
      subtitle: activity.subtitle || '',
      date: activity.startTime.split('T')[0],
      time: `${activity.startTime.split('T')[1]?.substring(0, 5) || '09:00'}-${activity.endTime.split('T')[1]?.substring(0, 5) || '17:00'}`,
      location: activity.location,
      type: activity.category,
      enrolled: activity.currentParticipants || 0,
      max: activity.maxParticipants || 0,
      tags: [activity.category, activity.status === 'upcoming' ? '报名中' : '已结束'],
      status: activity.status,
      pendingApplications: 0, // 临时使用，实际应该从报名数据计算
      category: activity.category,
      description: activity.description,
      image: activity.image,
      address: activity.location,
      capacity: activity.maxParticipants || 0,
      teaFee: 0, // 临时使用
      createdBy: activity.creatorId?.toString() || '',
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
