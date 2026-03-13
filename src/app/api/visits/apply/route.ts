import { NextRequest, NextResponse } from 'next/server';
import { db, approvals, visits, appUsers } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

// POST - 申请探访
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitId, userId, userName, userPhone, userWechat } = body;

    // 验证必填参数
    if (!visitId || !userId || !userName || !userPhone || !userWechat) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查探访是否存在
    const visitExists = await db
      .select({ id: visits.id, title: visits.companyName, date: visits.date })
      .from(visits)
      .where(eq(visits.id, visitId))
      .limit(1);

    if (!visitExists || visitExists.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访不存在' },
        { status: 404 }
      );
    }

    const visitInfo = visitExists[0];

    // 检查用户是否已经有待审核或已通过的申请
    const existingApproval = await db
      .select({ id: approvals.id, status: approvals.status })
      .from(approvals)
      .where(
        sql`${approvals.type} = 'visit' AND ${approvals.userId} = ${userId} AND ${approvals.title} = ${visitInfo.title}`
      )
      .limit(1);

    if (existingApproval && existingApproval.length > 0) {
      const status = existingApproval[0].status;
      if (status === 'pending') {
        return NextResponse.json(
          { success: false, error: '您已提交申请，请等待审核' },
          { status: 400 }
        );
      } else if (status === 'approved') {
        return NextResponse.json(
          { success: false, error: '您的申请已通过，无需重复申请' },
          { status: 400 }
        );
      }
    }

    // 创建审批记录（而不是直接创建visit_registrations）
    const newApproval = await db
      .insert(approvals)
      .values({
        id: crypto.randomUUID(),
        userId,
        type: 'visit',
        title: visitInfo.title || '探访申请',
        description: `姓名: ${userName}, 电话: ${userPhone}, 微信: ${userWechat}${visitInfo.date ? `, 探访时间: ${visitInfo.date.toISOString().split('T')[0]}` : ''}`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: '申请提交成功，请等待管理员审核',
      data: newApproval[0],
    });
  } catch (error) {
    console.error('申请探访失败:', error);
    // 如果表不存在，返回提示信息
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === '42P01') {
      return NextResponse.json(
        { 
          success: false, 
          error: '探访申请功能暂不可用，请联系管理员' 
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: '申请提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
