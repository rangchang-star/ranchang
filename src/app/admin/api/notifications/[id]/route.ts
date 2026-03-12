import { NextRequest, NextResponse } from 'next/server';
import { db, notifications } from '@/lib/db';
import { eq } from 'drizzle-orm';

// DELETE - 删除通知
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(notifications).where(eq(notifications.id, id));

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除通知失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除通知失败',
      },
      { status: 500 }
    );
  }
}
