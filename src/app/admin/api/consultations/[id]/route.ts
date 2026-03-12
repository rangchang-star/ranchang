import { NextRequest, NextResponse } from 'next/server';
import { db, consultations } from '@/lib/db';
import { eq } from 'drizzle-orm';

// PUT - 更新咨询状态
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, answer, consultantName } = body;

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少状态参数',
        },
        { status: 400 }
      );
    }

    const updated = await db
      .update(consultations)
      .set({
        status,
        answer: answer || null,
        consultant_name: consultantName || null,
        updated_at: new Date().toISOString(),
      } as any)
      .where(eq(consultations.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '咨询记录不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新咨询记录失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新咨询记录失败',
      },
      { status: 500 }
    );
  }
}
