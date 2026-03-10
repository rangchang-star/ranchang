import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// GET - 获取活动列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // 尝试连接数据库
        const { db, activities } = await import('@/storage/database/supabase/connection');
        const { eq, desc } = await import('drizzle-orm');
        
        const result = await db.select().from(activities).orderBy(desc(activities.created_at));
        
        return NextResponse.json({
          success: true,
          data: result
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 数据库连接失败时，使用模拟数据
      }
    }
    
    // 使用统一的模拟数据
    const activities = MockDatabase.getActivities();

    // 为每个活动添加参与人员信息
    const activitiesWithParticipants = activities.map(activity => ({
      ...activity,
      participants: MockDatabase.getActivityParticipants(activity.id),
      enrolledCount: MockDatabase.getActivityParticipants(activity.id).length,
      guests: MockDatabase.getActivityGuests(activity.id),
    }));

    return NextResponse.json({
      success: true,
      data: activitiesWithParticipants
    });
  } catch (error: any) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动列表失败'
    }, { status: 500 });
  }
}

// POST - 创建活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, activities } = await import('@/storage/database/supabase/connection');
        const { sql } = await import('drizzle-orm');
        const result = await db.insert(activities).values({
          id: sql`gen_random_uuid()`,
          title: body.title,
          description: body.description,
          date: body.date ? new Date(body.date) : null,
          start_time: body.start_time || null,
          end_time: body.end_time || null,
          location: body.location || null,
          capacity: body.capacity || null,
          type: body.type || null,
          cover_image: body.cover_image || null,
          status: body.status || 'active',
          created_at: new Date(),
          updated_at: new Date(),
        }).returning();
        
        return NextResponse.json({
          success: true,
          data: result[0]
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败:', dbError.message);
      }
    }
    
    // 使用 MockDatabase 创建活动
    const newActivity = MockDatabase.createActivity(body);

    return NextResponse.json({
      success: true,
      data: newActivity
    });
  } catch (error: any) {
    console.error('创建活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建活动失败'
    }, { status: 500 });
  }
}
