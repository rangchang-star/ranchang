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

    // 从数据库读取探访数据
    const { db, visits } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const dbVisits = await db.select().from(visits).where(eq(visits.id, id));

    if (!dbVisits || dbVisits.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访信息不存在' },
        { status: 404 }
      );
    }

    const visit = dbVisits[0];

    // 格式化数据
    const formattedVisit = {
      id: visit.id.toString(),
      title: visit.company_name, // 使用 company_name 作为标题
      description: visit.description,
      image: visit.cover_image, // 使用 cover_image 作为图片
      location: visit.location,
      date: visit.date?.toISOString(),
      capacity: visit.capacity,
      teaFee: 0, // 默认茶水费
      status: visit.status,
      duration: '4小时',
      visitors: [],
      record: visit.description,
      tags: ['已审核', '已发布'],
      audioDuration: '',
      audioUrl: '',
      companyId: visit.company_id,
      createdAt: visit.created_at?.toISOString(),
      updatedAt: visit.updated_at?.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedVisit,
    });
  } catch (error: any) {
    console.error('获取探访信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访信息失败: ' + error.message },
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
    if (!body.company_name || !body.date || !body.location) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    // 从数据库更新探访数据
    const { db, visits } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.update(visits)
      .set({
        company_name: body.company_name,
        company_id: body.company_id || null,
        industry: body.industry || null,
        description: body.description,
        cover_image: body.cover_image || null,
        location: body.location,
        date: new Date(body.date),
        capacity: body.capacity || null,
        status: body.status,
        updated_at: new Date(),
      })
      .where(eq(visits.id, id))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访信息不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '探访更新成功',
      data: { id }
    });
  } catch (error: any) {
    console.error('更新探访失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新探访失败: ' + error.message
    }, { status: 500 });
  }
}
