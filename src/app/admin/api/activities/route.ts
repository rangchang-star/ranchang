import { NextRequest, NextResponse } from 'next/server';
import { db, activities } from '@/lib/db';
import { eq, desc, like, and } from 'drizzle-orm';

// GET - 获取活动列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const conditions = [];

    if (search) {
      conditions.push(like((activities as any).title, `%${search}%`));
    }

    if (status && status !== 'all') {
      conditions.push(eq((activities as any).status, status));
    }

    // 只选择实际存在的字段，避免cover_image_key字段错误
    let query = db
      .select({
        id: activities.id,
        title: activities.title,
        description: activities.description,
        date: activities.date,
        start_time: activities.start_time,
        end_time: activities.end_time,
        location: activities.location,
        capacity: activities.capacity,
        registered_count: activities.registered_count,
        type: activities.type,
        cover_image: activities.cover_image,
        status: activities.status,
        created_at: activities.created_at,
        updated_at: activities.updated_at,
      })
      .from(activities);

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const activityList = await (query as any).orderBy(desc((activities as any).created_at));

    // 转换数据格式
    const data = activityList.map((activity: any) => {
      const date = new Date(activity.date);
      const isPast = date < new Date();

      return {
        id: activity.id,
        title: activity.title,
        subtitle: activity.description?.substring(0, 50) || '',
        date: activity.date.toISOString().split('T')[0],
        time: `${activity.start_time || ''} - ${activity.end_time || ''}`,
        location: activity.location || '',
        type: activity.type || 'salon',
        enrolled: activity.registered_count || 0,
        max: activity.capacity || 0,
        tags: [],
        status: isPast ? 'ended' : (activity.status === 'published' ? 'active' : 'draft'),
        pendingApplications: 0,
        category: activity.type || 'salon',
        description: activity.description || '',
        image: activity.cover_image || '',
        address: activity.location || '',
        capacity: activity.capacity || 0,
        teaFee: 0,
        createdBy: '',
        createdAt: activity.created_at,
        updatedAt: activity.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取活动列表失败',
      },
      { status: 500 }
    );
  }
}

// POST - 创建活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📝 [API] 创建活动数据:', body); // 调试日志

    const newActivity = await db
      .insert(activities)
      .values({
        id: crypto.randomUUID(),
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        start_time: body.startTime,
        end_time: body.endTime,
        location: body.location,
        capacity: body.capacity,
        type: body.type || 'salon',
        cover_image: body.image || body.imageUrl || '',
        cover_image_key: body.coverImageKey || '', // 新增：支持封面图fileKey
        status: body.status || 'draft',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    console.log('✅ [API] 创建活动成功:', newActivity[0]); // 调试日志

    return NextResponse.json({
      success: true,
      data: newActivity[0],
    });
  } catch (error) {
    console.error('❌ [API] 创建活动失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建活动失败',
      },
      { status: 500 }
    );
  }
}
