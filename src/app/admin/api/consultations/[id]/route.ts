import { NextRequest, NextResponse } from 'next/server';
import { db, consultations, notifications } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// GET - 获取咨询详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const consultation = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, id))
      .limit(1);

    if (!consultation || consultation.length === 0) {
      return NextResponse.json(
        { success: false, error: '咨询不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: consultation[0],
    });
  } catch (error) {
    console.error('获取咨询详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取咨询详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新咨询
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 先查询咨询的当前状态
    const current = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, id))
      .limit(1);

    if (!current || current.length === 0) {
      return NextResponse.json(
        { success: false, error: '咨询不存在' },
        { status: 404 }
      );
    }

    const consultation = current[0];

    // 更新咨询
    const updated = await db
      .update(consultations)
      .set({
        topicId: body.topicId,
        topicName: body.topicName,
        question: body.question,
        answer: body.answer,
        status: body.status,
        consultantName: body.consultantName,
        updatedAt: new Date(),
      })
      .where(eq(consultations.id, id))
      .returning();

    // 如果之前没有回复，现在有回复了，则创建通知
    if (!consultation.answer && body.answer && consultation.userId) {
      await db.insert(notifications).values({
        id: randomUUID(),
        userId: consultation.userId,
        type: 'message',
        title: '咨询回复',
        message: `${consultation.topicName || '咨询'}已回复，点击查看详情`,
        actionUrl: '/profile#consultations',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: '咨询不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新咨询失败:', error);
    return NextResponse.json(
      { success: false, error: '更新咨询失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除咨询
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db
      .delete(consultations)
      .where(eq(consultations.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: '咨询不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('删除咨询失败:', error);
    return NextResponse.json(
      { success: false, error: '删除咨询失败' },
      { status: 500 }
    );
  }
}
