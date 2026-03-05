import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { activities } from '@/storage/database/supabase/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET - 获取活动列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query = db.select().from(activities).orderBy(desc(activities.createdAt));
    
    // 如果有状态筛选，添加条件
    if (status && status !== 'all') {
      const result = await query.where(eq(activities.status, status as any));
      return NextResponse.json({
        success: true,
        data: result
      });
    }
    
    const result = await query;
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
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
    
    const result = await db.insert(activities).values({
      title: body.title,
      subtitle: body.subtitle,
      category: body.category || 'private',
      description: body.description,
      image: body.image || '',
      address: body.address || '',
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      capacity: body.capacity || 0,
      teaFee: body.teaFee || 0,
      status: body.status || 'draft',
      createdBy: body.createdBy || 1,
    }).returning();
    
    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('创建活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建活动失败'
    }, { status: 500 });
  }
}
