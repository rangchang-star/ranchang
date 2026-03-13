import { NextRequest, NextResponse } from 'next/server';
import { db, visitRegistrations, visits, appUsers } from '@/lib/db';
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
      .select({ id: visits.id })
      .from(visits)
      .where(eq(visits.id, visitId))
      .limit(1);

    if (!visitExists || visitExists.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访不存在' },
        { status: 404 }
      );
    }

    // 检查用户是否已经报名过
    const existingRegistration = await db
      .select({ id: visitRegistrations.id })
      .from(visitRegistrations)
      .where(
        sql`${visitRegistrations.visitId} = ${visitId} AND ${visitRegistrations.userId} = ${userId}`
      )
      .limit(1);

    if (existingRegistration && existingRegistration.length > 0) {
      return NextResponse.json(
        { success: false, error: '您已经报名过此探访' },
        { status: 400 }
      );
    }

    // 创建报名记录
    const newRegistration = await db
      .insert(visitRegistrations)
      .values({
        id: crypto.randomUUID(),
        visitId,
        userId,
        status: 'registered',
        note: `姓名: ${userName}, 电话: ${userPhone}, 微信: ${userWechat}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 更新探访的报名人数
    await db
      .update(visits)
      .set({
        registeredCount: sql`${visits.registeredCount} + 1`,
      })
      .where(eq(visits.id, visitId));

    // 发送通知给管理员（可选）
    // 这里可以添加管理员通知逻辑

    return NextResponse.json({
      success: true,
      message: '申请提交成功',
      data: newRegistration[0],
    });
  } catch (error) {
    console.error('申请探访失败:', error);
    // 如果表不存在，返回提示信息
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === '42P01') {
      return NextResponse.json(
        { 
          success: false, 
          error: '探访报名功能暂不可用，请联系管理员' 
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
