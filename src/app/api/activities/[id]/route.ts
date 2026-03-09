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

    const dbActivities = await db.select().from(activities).where(eq(activities.id, parseInt(id)));

    if (!dbActivities || dbActivities.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动信息不存在' },
        { status: 404 }
      );
    }

    const activity = dbActivities[0];

    // 根据状态判断
    const now = new Date();
    const startDate = activity.startDate ? new Date(activity.startDate) : null;
    const endDate = activity.endDate ? new Date(activity.endDate) : null;
    
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
      id: activity.id.toString(),
      title: activity.title,
      subtitle: activity.subtitle || '',
      description: activity.description,
      image: activity.image || '',
      address: activity.address || '',
      startDate: activity.startDate?.toISOString(),
      endDate: activity.endDate?.toISOString(),
      capacity: activity.capacity || 0,
      teaFee: activity.teaFee || 0,
      category: activity.category || 'private',
      status: status,
      participants: [],
      enrolledCount: 0,
      maxParticipants: activity.capacity || 0,
      organizer: {
        id: activity.createdBy?.toString() || '',
        name: '燃场',
        avatar: '',
        company: '燃场',
        position: '主办方',
      },
      createdBy: activity.createdBy?.toString() || '',
      createdAt: activity.createdAt?.toISOString(),
      updatedAt: activity.updatedAt?.toISOString(),
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
        subtitle: body.subtitle,
        description: body.description,
        image: body.image,
        address: body.address,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        capacity: body.capacity,
        teaFee: body.teaFee,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(activities.id, parseInt(id)))
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
