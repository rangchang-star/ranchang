import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, visits } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const dbVisits = await db.select().from(visits).orderBy(desc(visits.created_at));

    // 格式化数据（保持与前端需要的格式一致）
    const formattedVisits = dbVisits.map(visit => ({
      id: visit.id,
      title: visit.title,
      description: visit.description,
      image: visit.image,
      location: visit.location,
      date: visit.date?.toISOString(),
      capacity: visit.capacity || 0,
      teaFee: visit.tea_fee || 0,
      status: visit.status,
      duration: '4小时', // 默认时长
      visitors: [], // 简化字段，后续可扩展
      record: visit.description,
      tags: ['已审核', '已发布'], // 默认标签
      audioDuration: '',
      audioUrl: '',
      createdBy: visit.created_by,
      createdAt: visit.created_at?.toISOString(),
      updatedAt: visit.updated_at?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedVisits
    });
  } catch (error: any) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取探访列表失败: ' + error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 验证必填字段
    if (!body.title || !body.description) {
      return NextResponse.json({
        success: false,
        error: '请填写标题和描述'
      }, { status: 400 });
    }

    // 插入数据库
    const { db, visits } = await import('@/storage/database/supabase/connection');

    const result = await db.insert(visits).values({
      title: body.title,
      description: body.description,
      image: body.image || null,
      location: body.location || null,
      date: body.date ? new Date(body.date) : null,
      capacity: body.capacity || null,
      tea_fee: body.tea_fee || null,
      status: body.status || 'draft',
      created_by: body.created_by || null,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('创建探访失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建探访失败: ' + error.message
    }, { status: 500 });
  }
}
