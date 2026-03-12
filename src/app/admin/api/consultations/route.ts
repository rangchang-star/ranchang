import { NextRequest, NextResponse } from 'next/server';
import { db, consultations, users } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET - 获取所有咨询记录
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const topicId = searchParams.get('topicId');

    let query = db
      .select({
        id: consultations.id,
        userId: consultations.user_id,
        topicId: consultations.topic_id,
        topicName: consultations.topic_name,
        question: consultations.question,
        answer: consultations.answer,
        status: consultations.status,
        consultantName: consultations.consultant_name,
        createdAt: consultations.created_at,
        updatedAt: consultations.updated_at,
        userName: users.name,
        userAvatar: users.avatar,
      })
      .from(consultations)
      .leftJoin(users, eq(consultations.user_id, users.id));

    // 添加状态筛选
    if (status) {
      query = (query as any).where(eq(consultations.status, status));
    }

    // 添加话题筛选
    if (topicId) {
      query = (query as any).where(eq(consultations.topic_id, topicId));
    }

    const data = await (query as any).orderBy(desc(consultations.created_at));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取咨询记录失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取咨询记录失败',
      },
      { status: 500 }
    );
  }
}
