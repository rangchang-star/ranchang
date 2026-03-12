import { NextRequest, NextResponse } from 'next/server';
import { db, activities } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个活动详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('=== API CALLED ===');
    console.log('GET activity ID:', id);

    // 检查 db 连接
    console.log('db instance:', !!db);
    console.log('activities table:', !!activities);

    // 查询所有活动
    const allActivities = await db.select().from(activities);
    console.log('All activities count:', allActivities.length);
    console.log('All activity IDs:', allActivities.map(a => a.id));

    // 查询指定 ID 的活动
    const activityList = await db
      .select()
      .from(activities)
      .where(eq((activities as any).id, id))
      .limit(1);

    console.log('Activity list:', activityList);
    console.log('Activity list length:', activityList.length);

    if (activityList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '活动不存在',
        },
        { status: 404 }
      );
    }

    const activity = activityList[0];

    const data = {
      id: activity.id,
      title: activity.title,
      description: activity.description || '',
      date: activity.date.toISOString().split('T')[0],
      startTime: activity.start_time,
      endTime: activity.end_time,
      location: activity.location,
      capacity: activity.capacity,
      type: activity.type || 'salon',
      coverImage: activity.cover_image || '',
      coverImageKey: activity.cover_image_key || '', // 新增：返回fileKey
      status: activity.status || 'draft',
      registeredCount: activity.registered_count || 0,
      createdAt: activity.created_at,
      updatedAt: activity.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取活动详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取活动详情失败',
      },
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

    console.log('📝 [API] 更新活动数据:', { id, body }); // 调试日志

    // 字段映射：前端 camelCase -> 数据库 snake_case
    const updateData: any = {
      title: body.title,
      description: body.description,
      date: body.date ? new Date(body.date) : undefined,
      start_time: body.startTime,
      end_time: body.endTime,
      location: body.location,
      capacity: body.capacity,
      type: body.type,
      cover_image_key: body.coverImageKey || body.coverImage || '', // 新增：支持fileKey，向后兼容
      status: body.status,
      registered_count: body.registeredCount,
      updated_at: new Date(),
    };

    // 移除 undefined 值
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updated = await db
      .update(activities)
      .set(updateData)
      .where(eq((activities as any).id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '活动不存在',
        },
        { status: 404 }
      );
    }

    console.log('✅ [API] 更新活动成功:', updated[0]); // 调试日志

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('❌ [API] 更新活动失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新活动失败',
      },
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

    await db.delete(activities).where(eq((activities as any).id, id));

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除活动失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除活动失败',
      },
      { status: 500 }
    );
  }
}
