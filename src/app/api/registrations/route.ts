import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { activityRegistrations, visitRecords, activities, visits, users } from '@/storage/database/supabase/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// GET - 获取报名列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const activityId = searchParams.get('activityId');
    const visitId = searchParams.get('visitId');

    let result;

    // 根据查询参数选择查询哪个表
    if (activityId) {
      // 查询活动报名记录
      const conditions = [];
      if (userId) conditions.push(eq(activityRegistrations.userId, userId));
      conditions.push(eq(activityRegistrations.activityId, activityId));

      result = await db.select({
        id: activityRegistrations.id,
        userId: activityRegistrations.userId,
        activityId: activityRegistrations.activityId,
        type: sql<string>`'activity'`,
        status: activityRegistrations.status,
        registeredAt: activityRegistrations.registeredAt,
        reviewedAt: activityRegistrations.reviewedAt,
        note: activityRegistrations.note,
      }).from(activityRegistrations)
        .where(and(...conditions))
        .orderBy(desc(activityRegistrations.registeredAt));
    } else if (visitId) {
      // 查询探访记录
      const conditions = [];
      if (userId) conditions.push(eq(visitRecords.userId, userId));
      conditions.push(eq(visitRecords.visitId, visitId));

      result = await db.select({
        id: visitRecords.id,
        userId: visitRecords.userId,
        visitId: visitRecords.visitId,
        type: sql<string>`'visit'`,
        status: visitRecords.status,
        registeredAt: visitRecords.registeredAt,
        completedAt: visitRecords.completedAt,
      }).from(visitRecords)
        .where(and(...conditions))
        .orderBy(desc(visitRecords.registeredAt));
    } else if (userId) {
      // 查询用户的所有报名记录（活动和探访）
      const activityResults = await db.select({
        id: activityRegistrations.id,
        userId: activityRegistrations.userId,
        activityId: activityRegistrations.activityId,
        type: sql<string>`'activity'`,
        status: activityRegistrations.status,
        registeredAt: activityRegistrations.registeredAt,
        reviewedAt: activityRegistrations.reviewedAt,
        note: activityRegistrations.note,
      }).from(activityRegistrations)
        .where(eq(activityRegistrations.userId, userId))
        .orderBy(desc(activityRegistrations.registeredAt));

      const visitResults = await db.select({
        id: visitRecords.id,
        userId: visitRecords.userId,
        visitId: visitRecords.visitId,
        type: sql<string>`'visit'`,
        status: visitRecords.status,
        registeredAt: visitRecords.registeredAt,
        completedAt: visitRecords.completedAt,
      }).from(visitRecords)
        .where(eq(visitRecords.userId, userId))
        .orderBy(desc(visitRecords.registeredAt));

      result = [...activityResults, ...visitResults].sort((a, b) => {
        const aTime = a.registeredAt ? new Date(a.registeredAt).getTime() : 0;
        const bTime = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
        return bTime - aTime;
      });
    } else {
      return NextResponse.json({
        success: false,
        error: '请提供至少一个查询参数'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取报名列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取报名列表失败'
    }, { status: 500 });
  }
}

// POST - 创建报名记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityId, visitId } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: '用户ID不能为空'
      }, { status: 400 });
    }

    if (!activityId && !visitId) {
      return NextResponse.json({
        success: false,
        error: '活动ID或探访ID不能为空'
      }, { status: 400 });
    }

    // 根据类型创建报名记录
    let result;
    if (activityId) {
      // 检查是否已经报名
      const existingRegistration = await db.select()
        .from(activityRegistrations)
        .where(and(
          eq(activityRegistrations.userId, userId),
          eq(activityRegistrations.activityId, activityId),
          eq(activityRegistrations.status, 'registered')
        ));

      if (existingRegistration && existingRegistration.length > 0) {
        return NextResponse.json({
          success: false,
          error: '您已经报名过此活动'
        }, { status: 400 });
      }

      // 创建活动报名记录
      result = await db.insert(activityRegistrations).values({
        id: sql`gen_random_uuid()`,
        userId,
        activityId,
        status: 'registered',
        registeredAt: new Date(),
      }).returning();
    } else {
      // 检查是否已经报名
      const existingRegistration = await db.select()
        .from(visitRecords)
        .where(and(
          eq(visitRecords.userId, userId),
          eq(visitRecords.visitId, visitId!),
          eq(visitRecords.status, 'registered')
        ));

      if (existingRegistration && existingRegistration.length > 0) {
        return NextResponse.json({
          success: false,
          error: '您已经报名过此探访'
        }, { status: 400 });
      }

      // 创建探访记录
      result = await db.insert(visitRecords).values({
        id: sql`gen_random_uuid()`,
        userId,
        visitId,
        status: 'registered',
        registeredAt: new Date(),
      }).returning();
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: '报名成功'
    });
  } catch (error: any) {
    console.error('创建报名失败:', error);

    return NextResponse.json({
      success: false,
      error: '创建报名失败'
    }, { status: 500 });
  }
}
