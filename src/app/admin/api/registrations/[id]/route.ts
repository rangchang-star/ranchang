import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations } from '@/lib/db';
import { eq } from 'drizzle-orm';

// PUT - 更新报名状态（通过/拒绝）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, note } = body;

    if (!status || !['approved', 'rejected', 'registered', 'completed'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: '无效的状态值',
        },
        { status: 400 }
      );
    }

    // 更新报名状态
    const updated = await db
      .update(activityRegistrations)
      .set({
        status,
        reviewed_at: new Date().toISOString(),
        note: note || null,
        updated_at: new Date().toISOString(),
      })
      .where(eq(activityRegistrations.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '报名记录不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新报名状态失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新报名状态失败',
      },
      { status: 500 }
    );
  }
}
