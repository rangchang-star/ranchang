import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { registrations, activities, visits, users } from '@/storage/database/supabase/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET - 获取报名列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const activityId = searchParams.get('activityId');
    const visitId = searchParams.get('visitId');
    
    const conditions = [];
    if (userId) conditions.push(eq(registrations.userId, parseInt(userId)));
    if (activityId) conditions.push(eq(registrations.activityId, parseInt(activityId)));
    if (visitId) conditions.push(eq(registrations.visitId, parseInt(visitId)));
    
    let result;
    if (conditions.length > 0) {
      result = await db.select({
        id: registrations.id,
        userId: registrations.userId,
        activityId: registrations.activityId,
        visitId: registrations.visitId,
        status: registrations.status,
        paymentStatus: registrations.paymentStatus,
        createdAt: registrations.createdAt,
      }).from(registrations)
        .where(and(...conditions))
        .orderBy(desc(registrations.createdAt));
    } else {
      result = await db.select({
        id: registrations.id,
        userId: registrations.userId,
        activityId: registrations.activityId,
        visitId: registrations.visitId,
        status: registrations.status,
        paymentStatus: registrations.paymentStatus,
        createdAt: registrations.createdAt,
      }).from(registrations)
        .orderBy(desc(registrations.createdAt));
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

    // 检查是否已经报名
    let existingRegistration;
    if (activityId) {
      existingRegistration = await db.select()
        .from(registrations)
        .where(and(
          eq(registrations.userId, parseInt(userId)),
          eq(registrations.activityId, parseInt(activityId)),
          eq(registrations.status, 'registered')
        ));
    } else {
      existingRegistration = await db.select()
        .from(registrations)
        .where(and(
          eq(registrations.userId, parseInt(userId)),
          eq(registrations.visitId, parseInt(visitId!)),
          eq(registrations.status, 'registered')
        ));
    }

    if (existingRegistration && existingRegistration.length > 0) {
      return NextResponse.json({
        success: false,
        error: '您已经报名过此活动'
      }, { status: 400 });
    }

    // 创建报名记录
    const result = await db.insert(registrations).values({
      userId: parseInt(userId),
      activityId: activityId ? parseInt(activityId) : null,
      visitId: visitId ? parseInt(visitId) : null,
      status: 'registered',
      paymentStatus: 'unpaid',
    }).returning();

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
