import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, activities, registrations, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const result = await db.select().from(activities).where(eq(activities.id, parseInt(id))).limit(1);

        if (result.length === 0) {
          return NextResponse.json({
            success: false,
            error: '活动不存在'
          }, { status: 404 });
        }

        // 获取参与人员
        const participants = await db
          .select()
          .from(registrations)
          .where(eq(registrations.activityId, parseInt(id)))
          .leftJoin(users, eq(registrations.userId, users.id));

        return NextResponse.json({
          success: true,
          data: {
            ...result[0],
            participants: participants.filter(p => p.users).map(p => p.users),
            enrolledCount: participants.length,
          }
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }

    // 使用统一的模拟数据
    const activity = MockDatabase.getActivityById(parseInt(id));

    if (!activity) {
      return NextResponse.json({
        success: false,
        error: '活动不存在'
      }, { status: 404 });
    }

    // 获取活动的参与人员
    const participants = MockDatabase.getActivityParticipants(parseInt(id));

    return NextResponse.json({
      success: true,
      data: {
        ...activity,
        participants: participants,
        enrolledCount: participants.length,
      }
    });
  } catch (error: any) {
    console.error('获取活动详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动详情失败'
    }, { status: 500 });
  }
}
