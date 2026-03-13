import { NextRequest, NextResponse } from 'next/server';
import { db, approvals, appUsers } from '@/lib/db';
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

// PATCH - 快速审核（通过/拒绝）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'approve' | 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: '无效的操作' },
        { status: 400 }
      );
    }

    // 先获取审批详情
    const approvalList = await db
      .select()
      .from(approvals)
      .leftJoin(appUsers, eq(approvals.userId, appUsers.id))
      .where(eq(approvals.id, id))
      .limit(1);

    if (!approvalList || approvalList.length === 0) {
      return NextResponse.json(
        { success: false, error: '审批不存在' },
        { status: 404 }
      );
    }

    const approval = approvalList[0].approvals;
    const user = approvalList[0].app_users;

    // 更新审批状态
    const updated = await db
      .update(approvals)
      .set({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(approvals.id, id))
      .returning();

    // 如果审核通过，发送通知给用户
    if (action === 'approve' && user) {
      const { sendNotification } = await import('@/lib/notifications');
      
      if (approval.type === 'ai-circle') {
        // 2026AI圈审核通过
        await sendNotification({
          userId: approval.userId,
          type: 'approval',
          title: '恭喜！您的2026AI圈申请已通过审核',
          content: '欢迎加入2026AI圈！现在您可以参与圈子内的所有活动了。',
          relatedId: approval.id,
        });
      } else if (approval.type === 'visit') {
        // 申请探访审核通过
        // 1. 从visits表中根据title找到对应的探访
        const { visits, visitRegistrations } = await import('@/lib/db');
        const { eq } = await import('drizzle-orm');
        
        const visitList = await db
          .select({ id: visits.id })
          .from(visits)
          .where(eq(visits.companyName, approval.title))
          .limit(1);
        
        if (visitList && visitList.length > 0) {
          const visitId = visitList[0].id;
          
          // 2. 获取当前探访的报名人数
          const currentVisitList = await db
            .select({ registeredCount: visits.registeredCount })
            .from(visits)
            .where(eq(visits.id, visitId))
            .limit(1);
          
          // 3. 创建visit_registrations记录
          await db
            .insert(visitRegistrations)
            .values({
              id: crypto.randomUUID(),
              visitId,
              userId: approval.userId,
              status: 'approved',
              note: approval.description,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          
          // 4. 更新探访的报名人数
          if (currentVisitList && currentVisitList.length > 0) {
            const currentCount = currentVisitList[0].registeredCount || 0;
            await db
              .update(visits)
              .set({
                registeredCount: currentCount + 1,
              })
              .where(eq(visits.id, visitId));
          }
        }
        
        // 4. 发送通知
        await sendNotification({
          userId: approval.userId,
          type: 'visit',
          title: '恭喜！您的探访申请已通过审核',
          content: `您申请探访的"${approval.title}"已获批准，请留意活动安排和具体时间。`,
          relatedId: approval.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('审核失败:', error);
    return NextResponse.json(
      { success: false, error: '审核失败' },
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
