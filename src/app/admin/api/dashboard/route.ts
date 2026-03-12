import { NextRequest, NextResponse } from 'next/server';
import { db, users, activities, visits, declarations, dailyDeclarations, activityRegistrations } from '@/lib/db';

// GET - 获取 Dashboard 统计数据
export async function GET(request: NextRequest) {
  try {
    // 获取各类统计数据
    const [
      userCount,
      activityCount,
      visitCount,
      declarationCount,
      dailyDeclarationCount,
      activityRegistrationsList,
    ] = await Promise.all([
      db.select().from(users),
      db.select().from(activities),
      db.select().from(visits),
      db.select().from(declarations),
      db.select().from(dailyDeclarations),
      db.select().from(activityRegistrations),
    ]);

    // 计算本周活跃用户（假设本周内有活动报名的用户）
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentRegistrations = activityRegistrationsList.filter((r: any) => {
      const regTime = new Date(r.registered_at);
      return regTime > oneWeekAgo;
    });

    const uniqueActiveUsers = new Set(
      recentRegistrations.map((r: any) => r.user_id)
    ).size;

    return NextResponse.json({
      success: true,
      data: {
        totalMembers: userCount.length,
        totalActivities: activityCount.length,
        totalVisits: visitCount.length,
        totalDeclarations: declarationCount.length,
        totalDailyDeclarations: dailyDeclarationCount.length,
        weeklyActive: uniqueActiveUsers,
      },
    });
  } catch (error) {
    console.error('获取 Dashboard 统计数据失败:', error);
    console.error('错误详情:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        error: '获取统计数据失败',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
