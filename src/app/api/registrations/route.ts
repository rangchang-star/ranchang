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
    
    let query = db.select({
      id: registrations.id,
      userId: registrations.userId,
      activityId: registrations.activityId,
      visitId: registrations.visitId,
      status: registrations.status,
      paymentStatus: registrations.paymentStatus,
      createdAt: registrations.createdAt,
    }).from(registrations).orderBy(desc(registrations.createdAt));
    
    // 如果有筛选条件，添加过滤
    if (userId) {
      query = query.where(eq(registrations.userId, parseInt(userId)));
    }
    if (activityId) {
      query = query.where(eq(registrations.activityId, parseInt(activityId)));
    }
    if (visitId) {
      query = query.where(eq(registrations.visitId, parseInt(visitId)));
    }
    
    const result = await query;
    
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
          eq(registrations.userId, userId),
          eq(registrations.activityId, activityId),
          eq(registrations.status, 'registered')
        ));
    } else {
      existingRegistration = await db.select()
        .from(registrations)
        .where(and(
          eq(registrations.userId, userId),
          eq(registrations.visitId, visitId),
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
      userId,
      activityId: activityId || null,
      visitId: visitId || null,
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
