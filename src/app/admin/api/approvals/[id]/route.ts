import { NextRequest, NextResponse } from 'next/server';
import { db, approvals } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取审批详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const approval = await db
      .select()
      .from(approvals)
      .where(eq(approvals.id, id))
      .limit(1);

    if (!approval || approval.length === 0) {
      return NextResponse.json(
        { success: false, error: '审批不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: approval[0],
    });
  } catch (error) {
    console.error('获取审批详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取审批详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 审批操作
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(approvals)
      .set({
        status: body.status,
        reviewNote: body.reviewNote,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(approvals.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: '审批不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('审批失败:', error);
    return NextResponse.json(
      { success: false, error: '审批失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除审批
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db
      .delete(approvals)
      .where(eq(approvals.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: '审批不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('删除审批失败:', error);
    return NextResponse.json(
      { success: false, error: '删除审批失败' },
      { status: 500 }
    );
  }
}
