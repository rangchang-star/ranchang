import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// GET - 获取用户对活动的报名状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const registration = await db
      .select()
      .from(activityRegistrations)
      .where(
        and(
          eq(activityRegistrations.activityId, activityId),
          eq(activityRegistrations.userId, userId)
        )
      )
      .limit(1);

    const isRegistered = registration.length > 0;

    return NextResponse.json({
      success: true,
      data: {
        isRegistered,
        status: isRegistered ? registration[0].status : null,
      },
    });
  } catch (error) {
    console.error('获取报名状态失败:', error);
    return NextResponse.json(
      { success: false, error: '获取报名状态失败' },
      { status: 500 }
    );
  }
}
