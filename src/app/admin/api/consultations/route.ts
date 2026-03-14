import { NextRequest, NextResponse } from 'next/server';
import { db, consultations, appUsers } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取咨询列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    let query = db
      .select()
      .from(consultations)
      .leftJoin(appUsers, eq(consultations.userId, appUsers.id))
      .orderBy(desc(consultations.createdAt));

    const consultationList = await query;

    const data = consultationList.map((item: any) => ({
      id: item.consultations.id,
      userId: item.consultations.userId,
      userName: item.app_users?.name || item.app_users?.nickname || '未知用户',
      userAvatar: item.app_users?.avatar || '/avatar-default.jpg',
      topicId: item.consultations.topicId,
      topicName: item.consultations.topicName,
      question: item.consultations.question,
      answer: item.consultations.answer,
      status: item.consultations.status,
      consultantName: item.consultations.consultantName,
      createdAt: item.consultations.createdAt,
      updatedAt: item.consultations.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取咨询列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取咨询列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建咨询（管理员手动创建）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newConsultation = await db
      .insert(consultations)
      .values({
        userId: body.userId,
        topicId: body.topicId,
        topicName: body.topicName,
        question: body.question,
        status: body.status || 'pending',
        consultantName: body.consultantName || '大鱼老师',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newConsultation[0],
    });
  } catch (error) {
    console.error('创建咨询失败:', error);
    return NextResponse.json(
      { success: false, error: '创建咨询失败' },
      { status: 500 }
    );
  }
}
