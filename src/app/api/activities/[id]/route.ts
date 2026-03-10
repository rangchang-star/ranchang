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

    // 使用 supabase/schema 中的 activities 定义
    const { activities } = await import('@/storage/database/supabase/schema');
    const { default: postgres } = await import('postgres');
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { eq } = await import('drizzle-orm');

    // 创建数据库连接
    const connectionString = process.env.DATABASE_URL || '';
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    const db = drizzle(client);

    const dbActivities = await db.select().from(activities).where(eq(activities.id, parseInt(id)));

    await client.end();

    if (!dbActivities || dbActivities.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动信息不存在' },
        { status: 404 }
      );
    }

    const activity = dbActivities[0];

    // 根据状态判断
    const now = new Date();
    const startTime = activity.start_date ? new Date(activity.start_date) : null;
    const endTime = activity.end_date ? new Date(activity.end_date) : null;

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
      startDate: activity.start_date?.toISOString(),
      endDate: activity.end_date?.toISOString(),
      address: activity.address,
      capacity: activity.capacity || 0,
      registeredCount: 0, // 需要从 activity_registrations 表查询
      category: activity.category,
      image: activity.image,
      teaFee: activity.tea_fee || 0,
      status: status,
      createdAt: activity.created_at?.toISOString(),
      updatedAt: activity.updated_at?.toISOString(),
      createdBy: activity.created_by,
      subtitle: activity.subtitle,
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
        date: body.date ? new Date(body.date) : null,
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
