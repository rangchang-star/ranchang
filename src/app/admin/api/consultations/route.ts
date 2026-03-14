import { NextRequest, NextResponse } from 'next/server';
import { db, consultations } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取咨询列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 可选：筛选状态

    let consultationsList;

    if (status) {
      consultationsList = await db
        .select()
        .from(consultations)
        .where(eq(consultations.status, status))
        .orderBy(desc(consultations.createdAt))
        .limit(10);
    } else {
      consultationsList = await db
        .select()
        .from(consultations)
        .orderBy(desc(consultations.createdAt))
        .limit(10);
    }

    // 格式化返回数据
    const formattedConsultations = consultationsList.map((consult) => ({
      id: consult.id,
      title: consult.topicName || '未分类',
      type: consult.topicId || 'general',
      date: consult.createdAt ? new Date(consult.createdAt).toISOString().split('T')[0] : '',
      status: consult.status === 'pending' ? '待处理' : (consult.status === 'answered' ? '已回复' : consult.status),
      question: consult.question,
      answer: consult.answer,
      consultantName: consult.consultantName,
      userId: consult.userId,
    }));

    return NextResponse.json({
      success: true,
      data: formattedConsultations,
    });
  } catch (error) {
    console.error('获取咨询列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取咨询列表失败' },
      { status: 500 }
    );
  }
}
