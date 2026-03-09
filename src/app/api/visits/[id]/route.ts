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
      title: visit.title,
      description: visit.description,
      image: visit.image,
      location: visit.location,
      date: visit.date?.toISOString(),
      capacity: visit.capacity,
      teaFee: visit.teaFee,
      status: visit.status,
      duration: '4小时',
      visitors: [],
      record: visit.description,
      tags: ['已审核', '已发布'],
      audioDuration: '',
      audioUrl: '',
      createdBy: visit.createdBy,
      createdAt: visit.createdAt?.toISOString(),
      updatedAt: visit.updatedAt?.toISOString(),
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
    if (!body.title || !body.date || !body.location) {
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
        title: body.title,
        description: body.description,
        image: body.image,
        location: body.location,
        date: new Date(body.date),
        capacity: body.capacity,
        teaFee: body.teaFee,
        status: body.status,
        updatedAt: new Date(),
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
