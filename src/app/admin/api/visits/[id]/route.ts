import { NextRequest, NextResponse } from 'next/server';
import { db, visits, visitRecords } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取探访详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const visitList = await db.select().from(visits).where(eq(visits.id, id));

    if (visitList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '探访不存在',
        },
        { status: 404 }
      );
    }

    const visit = visitList[0];

    // 转换数据格式
    const data = {
      id: visit.id,
      companyId: visit.company_id,
      companyName: visit.company_name,
      industry: visit.industry || '',
      location: visit.location || '',
      description: visit.description || '',
      date: visit.date.toISOString().split('T')[0],
      capacity: visit.capacity || 0,
      registeredCount: visit.registered_count || 0,
      coverImage: visit.cover_image || '',
      coverImageKey: visit.cover_image_key || '',
      status: visit.status || 'draft',
      createdAt: visit.created_at,
      updatedAt: visit.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取探访详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取探访详情失败',
      },
      { status: 500 }
    );
  }
}

// PUT - 更新探访信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('[DEBUG] PUT /admin/api/visits/[id] - 更新探访:', id);
    console.log('[DEBUG] 接收到的数据:', JSON.stringify(body, null, 2));

    // 字段映射：前端名 → 数据库名
    const updateData: any = {
      updated_at: new Date(),
    };

    // 映射字段
    if (body.companyId !== undefined) updateData.company_id = body.companyId;
    if (body.companyName !== undefined) updateData.company_name = body.companyName;
    if (body.industry !== undefined) updateData.industry = body.industry;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.capacity !== undefined) updateData.capacity = body.capacity;
    if (body.registeredCount !== undefined) updateData.registered_count = body.registeredCount;
    if (body.status !== undefined) updateData.status = body.status;

    // 处理图片字段：支持 coverImageKey 和 coverImage
    if (body.coverImageKey !== undefined) {
      updateData.cover_image_key = body.coverImageKey;
    }
    if (body.coverImage !== undefined) {
      updateData.cover_image = body.coverImage;
    }

    console.log('[DEBUG] 更新数据库的数据:', JSON.stringify(updateData, null, 2));

    const updated = await db
      .update(visits)
      .set(updateData)
      .where(eq(visits.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '探访不存在',
        },
        { status: 404 }
      );
    }

    const visit = updated[0];

    // 返回转换后的数据（返回给前端的格式）
    const responseData = {
      id: visit.id,
      companyId: visit.company_id,
      companyName: visit.company_name,
      industry: visit.industry || '',
      location: visit.location || '',
      description: visit.description || '',
      date: visit.date.toISOString().split('T')[0],
      capacity: visit.capacity || 0,
      registeredCount: visit.registered_count || 0,
      coverImage: visit.cover_image || '',
      coverImageKey: visit.cover_image_key || '',
      status: visit.status || 'draft',
      createdAt: visit.created_at,
      updatedAt: visit.updated_at,
    };

    console.log('[DEBUG] 返回给前端的数据:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('更新探访失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新探访失败',
      },
      { status: 500 }
    );
  }
}

// DELETE - 删除探访记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 先删除该探访的所有报名记录
    await db.delete(visitRecords).where(eq(visitRecords.visit_id, id));

    // 删除探访记录
    const deleted = await db
      .delete(visits)
      .where(eq(visits.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '探访记录不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除探访失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除探访失败',
      },
      { status: 500 }
    );
  }
}
