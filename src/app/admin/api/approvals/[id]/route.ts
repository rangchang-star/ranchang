import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations, visitRecords, notifications } from '@/lib/db';
import { eq } from 'drizzle-orm';

// PUT - 审批记录
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, type, note } = body;

    if (!status || !type) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数',
        },
        { status: 400 }
      );
    }

    let result;

    if (type === 'activity') {
      result = await db
        .update(activityRegistrations)
        .set({
          status,
          reviewed_at: new Date().toISOString(),
          note: note || null,
          updated_at: new Date().toISOString(),
        })
        .where(eq(activityRegistrations.id, parseInt(id)))
        .returning();
    } else if (type === 'visit') {
      result = await db
        .update(visitRecords)
        .set({
          status,
        })
        .where(eq(visitRecords.id, id))
        .returning();
    } else {
      return NextResponse.json(
        {
          success: false,
          error: '无效的类型',
        },
        { status: 400 }
      );
    }

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '记录不存在',
        },
        { status: 404 }
      );
    }

    // 创建通知
    const record = result[0] as any;
    const userId = record.user_id || record.userId || null;
    const activityId = record.activity_id || record.activityId || null;
    const visitId = record.visit_id || record.visitId || null;

    if (userId) {
      await db.insert(notifications).values({
        user_id: userId,
        type: status === 'approved' ? 'success' : 'error',
        title: status === 'approved' ? '申请已通过' : '申请未通过',
        message: status === 'approved' ? '您的申请已通过审核' : '您的申请未通过审核',
        action_url: type === 'activity' ? `/activity/${activityId}` : `/visit/${visitId}`,
        is_read: false,
      });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('审批失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '审批失败',
      },
      { status: 500 }
    );
  }
}
