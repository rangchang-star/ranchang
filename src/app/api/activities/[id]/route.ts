import { NextRequest, NextResponse } from 'next/server';
import { db, activities, activityRegistrations } from '@/lib/db';
import { eq, sql, and } from 'drizzle-orm';

// GET - 获取活动详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const activityList = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id));

    if (activityList.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    const activity = activityList[0];

    // 实时计算已通过的报名人数
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(activityRegistrations)
      .where(
        and(
          eq(activityRegistrations.activityId, id),
          eq(activityRegistrations.status, 'approved')
        )
      );

    const approvedCount = countResult[0]?.count || 0;

    const data = {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      date: activity.date,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      capacity: activity.capacity,
      type: activity.type,
      coverImage: activity.coverImage,
      coverImageKey: activity.coverImageKey,
      status: activity.status,
      registeredCount: approvedCount, // 使用实时计算的已通过人数
      createdBy: activity.createdBy,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      teaFee: activity.teaFee,
      tags: activity.tags,
      guests: activity.guests,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取活动详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新活动
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedActivity = await db
      .update(activities)
      .set({
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location,
        capacity: body.capacity,
        type: body.type,
        teaFee: body.teaFee, // 茶水费
        coverImage: body.coverImage,
        coverImageKey: body.coverImageKey,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(activities.id, id))
      .returning();

    if (updatedActivity.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedActivity[0],
    });
  } catch (error) {
    console.error('更新活动失败:', error);
    return NextResponse.json(
      { success: false, error: '更新活动失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除活动
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedActivity = await db
      .delete(activities)
      .where(eq(activities.id, id))
      .returning();

    if (deletedActivity.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '活动删除成功',
    });
  } catch (error) {
    console.error('删除活动失败:', error);
    return NextResponse.json(
      { success: false, error: '删除活动失败' },
      { status: 500 }
    );
  }
}
