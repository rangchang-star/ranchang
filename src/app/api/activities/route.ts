import { NextRequest, NextResponse } from 'next/server';
import { db, activities } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';

// GET - 获取活动列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

    let query = db.select().from(activities).orderBy(desc(activities.date));

    const conditions = [];
    if (status && status !== 'all') {
      conditions.push(eq(activities.status, status as any));
    }
    if (type && type !== 'all') {
      conditions.push(eq(activities.type, type));
    }

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const activityList = await query;

    // 转换数据格式（snake_case → camelCase）
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

// POST - 创建活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newActivity = await db
      .insert(activities)
      .values({
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        startDate: new Date(body.startDate || body.date),
        endDate: new Date(body.endDate || body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location,
        capacity: body.capacity,
        type: body.type || 'salon',
        teaFee: body.teaFee, // 茶水费
        coverImage: body.coverImage,
        coverImageKey: body.coverImageKey,
        status: body.status || 'draft',
        createdBy: body.createdBy,
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
