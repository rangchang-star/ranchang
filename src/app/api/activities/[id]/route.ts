import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, activities } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');
        
        const result = await db.select().from(activities).where(eq(activities.id, parseInt(id))).limit(1);
        
        if (result.length === 0) {
          return NextResponse.json({
            success: false,
            error: '活动不存在'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          data: result[0]
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }
    
    // 使用统一的模拟数据
    const activity = MockDatabase.getActivityById(parseInt(id));

    if (!activity) {
      return NextResponse.json({
        success: false,
        error: '活动不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    console.error('获取活动详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动详情失败'
    }, { status: 500 });
  }
}
