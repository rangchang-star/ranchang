import { NextRequest, NextResponse } from 'next/server';
import { db, visitRegistrations, visits, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取探访报名详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const registration = await db
      .select({
        id: visitRegistrations.id,
        visitId: visitRegistrations.visitId,
        userId: visitRegistrations.userId,
        status: visitRegistrations.status,
        note: visitRegistrations.note,
        createdAt: visitRegistrations.createdAt,
        updatedAt: visitRegistrations.updatedAt,
        // 探访信息
        visitTitle: visits.companyName,
        visitDate: visits.date,
        visitTime: visits.time,
        visitLocation: visits.location,
        visitDescription: visits.description,
        // 用户信息
        userName: appUsers.name,
        userNickname: appUsers.nickname,
        userEmail: appUsers.email,
        userPhone: appUsers.phone,
        userCompany: appUsers.company,
      })
      .from(visitRegistrations)
      .leftJoin(visits, eq(visitRegistrations.visitId, visits.id))
      .leftJoin(appUsers, eq(visitRegistrations.userId, appUsers.id))
      .where(eq(visitRegistrations.id, id))
      .limit(1);

    if (!registration || registration.length === 0) {
      return NextResponse.json(
        { success: false, error: '报名记录不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration[0],
    });
  } catch (error) {
    console.error('获取探访报名详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访报名详情失败' },
      { status: 500 }
    );
  }
}

// PATCH - 审核探访报名（通过/拒绝）
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

    // 先获取报名详情
    const registrationList = await db
      .select({
        id: visitRegistrations.id,
        visitId: visitRegistrations.visitId,
        userId: visitRegistrations.userId,
        status: visitRegistrations.status,
        visitTitle: visits.companyName,
        visitDate: visits.date,
        userName: appUsers.name,
        userNickname: appUsers.nickname,
      })
      .from(visitRegistrations)
      .leftJoin(visits, eq(visitRegistrations.visitId, visits.id))
      .leftJoin(appUsers, eq(visitRegistrations.userId, appUsers.id))
      .where(eq(visitRegistrations.id, id))
      .limit(1);

    if (!registrationList || registrationList.length === 0) {
      return NextResponse.json(
        { success: false, error: '报名记录不存在' },
        { status: 404 }
      );
    }

    const registration = registrationList[0];

    // 更新报名状态
    const updated = await db
      .update(visitRegistrations)
      .set({
        status: action === 'approve' ? 'approved' : 'rejected',
        updatedAt: new Date(),
      })
      .where(eq(visitRegistrations.id, id))
      .returning();

    // 如果审核通过，更新探访活动的报名人数
    if (action === 'approve') {
      await db
        .update(visits)
        .set({
          registeredCount: (visits.registeredCount as any) + 1,
        })
        .where(eq(visits.id, registration.visitId));
    }

    // 如果审核通过，发送通知给用户
    if (action === 'approve' && registration.userName) {
      const { sendNotification } = await import('@/lib/notifications');
      
      await sendNotification({
        userId: registration.userId,
        type: 'visit',
        title: '恭喜！您的探访申请已通过审核',
        content: `您申请探访的"${registration.visitTitle}"已获批准。活动时间：${registration.visitDate ? new Date(registration.visitDate).toLocaleDateString('zh-CN') : '待定'}`,
        relatedId: registration.visitId,
      });
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

// DELETE - 删除报名记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await db
      .delete(visitRegistrations)
      .where(eq(visitRegistrations.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: '报名记录不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('删除报名记录失败:', error);
    return NextResponse.json(
      { success: false, error: '删除报名记录失败' },
      { status: 500 }
    );
  }
}
