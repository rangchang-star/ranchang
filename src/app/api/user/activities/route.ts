import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations, activities, appUsers } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET - 获取用户报名的活动列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 查询用户的报名记录（关联活动信息）
    const registrations = await db
      .select({
        id: activityRegistrations.id,
        activityId: activityRegistrations.activityId,
        userId: activityRegistrations.userId,
        status: activityRegistrations.status,
        paymentStatus: activityRegistrations.paymentStatus,
        note: activityRegistrations.note,
        createdAt: activityRegistrations.createdAt,
        activityTitle: activities.title,
        activityCategory: activities.type,
        activityDate: activities.startDate,
        activityLocation: activities.location,
        activityDescription: activities.description,
        activityCapacity: activities.capacity,
      })
      .from(activityRegistrations)
      .innerJoin(activities, eq(activityRegistrations.activityId, activities.id))
      .where(eq(activityRegistrations.userId, userId))
      .orderBy(desc(activityRegistrations.createdAt));

    // 格式化数据
    const formattedActivities = registrations.map(reg => {
      let displayStatus = '待审核';
      if (reg.status === 'pending') {
        displayStatus = '待审核';
      } else if (reg.status === 'approved') {
        // 判断活动是否已结束
        const activityDate = new Date(reg.activityDate);
        const now = new Date();
        displayStatus = activityDate < now ? '已参加' : '待参加';
      } else if (reg.status === 'rejected') {
        displayStatus = '已拒绝';
      } else if (reg.status === 'cancelled') {
        displayStatus = '已取消';
      }

      // 格式化日期
      const date = new Date(reg.activityDate);
      const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

      // 活动类型映射
      const categoryMap: Record<string, string> = {
        private: '私董会',
        salon: '沙龙',
        workshop: '工作坊',
        ai: 'AI实战',
        visit: '探访',
        meetup: '聚会',
      };

      return {
        id: reg.activityId,
        registrationId: reg.id,
        title: reg.activityTitle,
        date: formattedDate,
        time: '', // 可以后续从 activities 表添加 startTime/endTime 字段
        location: reg.activityLocation,
        status: displayStatus,
        category: reg.activityCategory ? (categoryMap[reg.activityCategory] || reg.activityCategory) : '活动',
        description: reg.activityDescription,
        participants: reg.activityCapacity,
        enrolled: 0, // 可以从统计查询
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    console.error('获取用户活动列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户活动列表失败' },
      { status: 500 }
    );
  }
}
