import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// 定义用户类型
type User = {
  id: number;
  phone: string;
  name: string;
  avatar: string;
  company: string;
  position: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 获取活动信息
    const activities = MockDatabase.getActivities();
    const activity = activities.find((a) => String(a.id) === id);

    if (!activity) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    // 获取活动的参与记录
    const activityRegistrations = MockDatabase.getActivityRegistrationsByActivityId(id);

    // 获取用户信息（显式指定类型）
    const users = MockDatabase.getUsers() as User[];

    // 组合数据
    const registrations = activityRegistrations.map((registration) => {
      const user = users.find((u) => String(u.id) === registration.userId);
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
    });

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
          approved: registrations.filter((r) => r.status === 'approved').length,
          pending: registrations.filter((r) => r.status === 'pending').length,
          rejected: registrations.filter((r) => r.status === 'rejected').length,
          completed: registrations.filter((r) => r.status === 'completed').length,
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
