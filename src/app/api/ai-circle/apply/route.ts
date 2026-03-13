import { NextRequest, NextResponse } from 'next/server';
import { db, approvals, appUsers } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

// POST - 申请加入 AI 加油圈
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userPhone, userWechat } = body;

    // 验证必填参数
    if (!userId || !userName || !userPhone || !userWechat) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查用户是否已经有待审核或已通过的 AI 加油圈申请
    // 优先查询 pending 状态
    const pendingApproval = await db
      .select({ id: approvals.id, status: approvals.status })
      .from(approvals)
      .where(
        sql`${approvals.type} = 'ai-circle' AND ${approvals.userId} = ${userId} AND ${approvals.status} = 'pending'`
      )
      .limit(1);

    if (pendingApproval && pendingApproval.length > 0) {
      return NextResponse.json(
        { success: false, error: '您已提交申请，请等待审核' },
        { status: 400 }
      );
    }

    // 再查询 approved 状态
    const approvedApproval = await db
      .select({ id: approvals.id, status: approvals.status })
      .from(approvals)
      .where(
        sql`${approvals.type} = 'ai-circle' AND ${approvals.userId} = ${userId} AND ${approvals.status} = 'approved'`
      )
      .limit(1);

    if (approvedApproval && approvedApproval.length > 0) {
      return NextResponse.json(
        { success: false, error: '您的申请已通过，无需重复申请' },
        { status: 400 }
      );
    }

    // 创建审批记录
    const newApproval = await db
      .insert(approvals)
      .values({
        id: crypto.randomUUID(),
        userId,
        type: 'ai-circle',
        title: '2026AI圈',
        description: `姓名: ${userName}, 电话: ${userPhone}, 微信: ${userWechat}`,
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
    console.error('申请加入AI加油圈失败:', error);
    // 如果表不存在，返回提示信息
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === '42P01') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI加油圈申请功能暂不可用，请联系管理员' 
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
