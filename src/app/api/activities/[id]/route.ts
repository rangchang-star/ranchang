import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

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
    const startDate = activity.start_date ? new Date(activity.start_date) : null;
    const endDate = activity.end_date ? new Date(activity.end_date) : null;

    let status = 'upcoming';
    if (activity.status === 'ended') {
      status = 'ended';
    } else if (activity.status === 'cancelled') {
      status = 'cancelled';
    } else if (endDate && now > endDate) {
      status = 'ended';
    } else if (startDate && now > startDate) {
      status = 'ongoing';
    }

    // 格式化数据
    const formattedActivity = {
      id: activity.id,
      title: activity.title,
      subtitle: activity.subtitle,
      description: activity.description,
      startDate: activity.start_date?.toISOString(),
      endDate: activity.end_date?.toISOString(),
      location: activity.address,
      capacity: activity.capacity || 0,
      teaFee: activity.tea_fee || 0,
      category: activity.category,
      image: activity.image,
      status: status,
      createdBy: activity.created_by,
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
    const id = parseInt(params.id);
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
        subtitle: body.subtitle || null,
        category: body.category || null,
        description: body.description,
        image: body.image || null,
        address: body.address || null,
        start_date: body.start_date ? new Date(body.start_date) : null,
        end_date: body.end_date ? new Date(body.end_date) : null,
        capacity: body.capacity || null,
        tea_fee: body.tea_fee || null,
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
      data: result[0]
    });
  } catch (error: any) {
    console.error('更新活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新活动失败: ' + error.message
    }, { status: 500 });
  }
}
