import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 从数据库读取活动数据
    const { db, activities } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const dbActivities = await db.select().from(activities).where(eq(activities.id, id));

    if (!dbActivities || dbActivities.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动信息不存在' },
        { status: 404 }
      );
    }

    const activity = dbActivities[0];

    // 根据状态判断
    const now = new Date();
    const startTime = activity.start_time ? new Date(activity.start_time) : null;
    const endTime = activity.end_time ? new Date(activity.end_time) : null;

    let status = 'upcoming';
    if (activity.status === 'ended') {
      status = 'ended';
    } else if (activity.status === 'cancelled') {
      status = 'cancelled';
    } else if (endTime && now > endTime) {
      status = 'ended';
    } else if (startTime && now > startTime) {
      status = 'ongoing';
    }

    // 格式化数据
    const formattedActivity = {
      id: activity.id.toString(),
      title: activity.title,
      description: activity.description,
      date: activity.date?.toISOString(),
      startTime: activity.start_time,
      endTime: activity.end_time,
      location: activity.location,
      capacity: activity.capacity || 0,
      registeredCount: activity.registered_count || 0,
      type: activity.type,
      coverImage: activity.cover_image,
      status: status,
      createdAt: activity.created_at?.toISOString(),
      updatedAt: activity.updated_at?.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedActivity,
    });
  } catch (error: any) {
    console.error('获取活动信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动信息失败: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 验证必填字段
    if (!body.title || !body.description) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    // 从数据库更新活动数据
    const { db, activities } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.update(activities)
      .set({
        title: body.title,
        description: body.description,
        start_time: body.start_time || null,
        end_time: body.end_time || null,
        location: body.location || null,
        capacity: body.capacity || null,
        type: body.type || null,
        cover_image: body.cover_image || null,
        status: body.status,
        updated_at: new Date(),
      })
      .where(eq(activities.id, id))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动信息不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '活动更新成功',
      data: { id }
    });
  } catch (error: any) {
    console.error('更新活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新活动失败: ' + error.message
    }, { status: 500 });
  }
}
