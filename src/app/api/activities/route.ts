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
        
        const result = await db.select().from(activities).orderBy(desc(activities.createdAt));
        
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

    return NextResponse.json({
      success: true,
      data: activities
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
        const result = await db.insert(activities).values({
          category: body.category,
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          image: body.image,
          capacity: body.capacity,
          teaFee: body.teaFee,
          address: body.address,
          startDate: body.startDate,
          endDate: body.endDate,
          status: body.status || 'active',
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
