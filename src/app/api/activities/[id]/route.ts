import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { activities } from '@/storage/database/supabase/schema';
import { eq } from 'drizzle-orm';

// GET - 获取单个活动详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: '无效的活动ID'
      }, { status: 400 });
    }

    const result = await db.select().from(activities).where(eq(activities.id, id));

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
  } catch (error) {
    console.error('获取活动详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动详情失败'
    }, { status: 500 });
  }
}

// PUT - 更新活动
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: '无效的活动ID'
      }, { status: 400 });
    }

    const body = await request.json();
    
    const updateData = {
      title: body.title,
      subtitle: body.subtitle,
      category: body.category,
      description: body.description,
      image: body.image,
      address: body.address,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      capacity: body.capacity,
      teaFee: body.teaFee,
      status: body.status,
      updatedAt: new Date()
    };

    const result = await db.update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning();

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
  } catch (error) {
    console.error('更新活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新活动失败'
    }, { status: 500 });
  }
}

// DELETE - 删除活动
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: '无效的活动ID'
      }, { status: 400 });
    }

    const result = await db.delete(activities).where(eq(activities.id, id)).returning();

    return NextResponse.json({
      success: true,
      message: '活动已删除'
    });
  } catch (error) {
    console.error('删除活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除活动失败'
    }, { status: 500 });
  }
}
