import { NextRequest, NextResponse } from 'next/server';
import { db, activities } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个活动详情（后台）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const activity = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1);

    if (activity.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activity[0],
    });
  } catch (error) {
    console.error('获取活动详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新活动（后台）
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
        date: new Date(body.date),
        startDate: new Date(body.startDate || body.date),
        endDate: new Date(body.endDate || body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location,
        capacity: body.capacity ? parseInt(body.capacity) : 30,
        type: body.type,
        coverImage: body.coverImage,
        coverImageKey: body.coverImageKey,
        status: body.status,
        teaFee: body.teaFee,
        tags: body.tags,
        guests: body.guests,
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

// DELETE - 删除活动（后台）
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
      message: '活动已删除',
    });
  } catch (error) {
    console.error('删除活动失败:', error);
    return NextResponse.json(
      { success: false, error: '删除活动失败' },
      { status: 500 }
    );
  }
}
