import { NextRequest, NextResponse } from 'next/server';
import { db, consultations } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, topicId, question, userId } = body;

    // 参数校验
    if (!topic || !question || !userId) {
      return NextResponse.json(
        { success: false, error: '话题、问题和用户ID不能为空' },
        { status: 400 }
      );
    }

    // 插入咨询记录
    const newConsultation = await db
      .insert(consultations)
      .values({
        userId,
        topicId,
        topicName: topic,
        question,
        status: 'pending',
        consultantName: '大鱼老师',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newConsultation[0],
      message: '咨询提交成功',
    });
  } catch (error) {
    console.error('提交咨询失败:', error);
    return NextResponse.json(
      { success: false, error: '提交咨询失败' },
      { status: 500 }
    );
  }
}
