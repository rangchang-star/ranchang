import { NextRequest, NextResponse } from 'next/server';
import { db, activities } from '@/lib/db';
import { desc, like, eq, and } from 'drizzle-orm';

// GET - 获取活动列表（后台）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let query = db.select().from(activities).orderBy(desc(activities.createdAt));

    const conditions = [];
    if (search) {
      conditions.push(like(activities.title, `%${search}%`));
    }
    if (status && status !== 'all') {
      conditions.push(eq(activities.status, status as any));
    }

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const activityList = await query;

    const data = activityList.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      date: activity.date,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      capacity: activity.capacity,
      type: activity.type,
      teaFee: activity.teaFee, // 茶水费
      coverImage: activity.coverImage,
      coverImageKey: activity.coverImageKey,
      status: activity.status,
      registeredCount: activity.registeredCount,
      createdBy: activity.createdBy,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建活动（后台）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.date || !body.startTime || !body.endTime || !body.location || !body.capacity) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填字段（标题、日期、时间、地点、人数）' },
        { status: 400 }
      );
    }

    const newActivity = await db
      .insert(activities)
      .values({
        title: body.title,
        description: body.description || '',
        date: new Date(body.date),
        startDate: new Date(body.startDate || body.date),
        endDate: new Date(body.endDate || body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location,
        capacity: body.capacity ? parseInt(body.capacity) : 30,
        type: body.type || 'salon',
        coverImage: body.coverImage,
        coverImageKey: body.coverImageKey,
        status: body.status || 'draft',
        createdBy: body.createdBy,
        teaFee: body.teaFee,
        tags: body.tags,
        guests: body.guests,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newActivity[0],
    });
  } catch (error) {
    console.error('创建活动失败:', error);
    return NextResponse.json(
      { success: false, error: '创建活动失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新活动（后台）
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少活动ID' },
        { status: 400 }
      );
    }

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
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少活动ID' },
        { status: 400 }
      );
    }

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
