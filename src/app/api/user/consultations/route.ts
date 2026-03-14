import { NextRequest, NextResponse } from 'next/server';
import { db, consultations } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    // 查询用户的所有咨询记录
    const userConsultations = await db
      .select()
      .from(consultations)
      .where(eq(consultations.userId, userId))
      .orderBy(desc(consultations.createdAt));

    return NextResponse.json({
      success: true,
      data: userConsultations,
    });
  } catch (error) {
    console.error('获取用户咨询记录失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户咨询记录失败' },
      { status: 500 }
    );
  }
}
