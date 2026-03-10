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

    // 直接创建数据库连接，避免连接池满的问题
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';

    const postgres = (await import('postgres')).default;

    // 创建单个连接（不使用连接池）
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    // 使用原始 SQL 查询（根据 ran_field 数据库实际结构）
    const dbVisits = await client`
      SELECT "id", "title", "description", "image", "location",
             "date", "capacity", "tea_fee", "status",
             "created_by", "created_at", "updated_at"
      FROM "visits"
      ORDER BY "date" DESC
    `;

    // 立即关闭连接
    await client.end();

    // 格式化数据（保持与前端需要的格式一致）
    const formattedVisits = dbVisits.map(visit => ({
      id: visit.id.toString(),
      title: visit.title, // 使用 title 作为标题
      description: visit.description,
      image: visit.image, // 使用 image 作为图片
      location: visit.location,
      date: visit.date?.toISOString(),
      capacity: visit.capacity,
      teaFee: visit.tea_fee || 0, // 使用 tea_fee 字段
      status: visit.status,
      duration: '4小时', // 默认时长
      visitors: [], // 简化字段，后续可扩展
      record: visit.description,
      tags: ['已审核', '已发布'], // 默认标签
      audioDuration: '',
      audioUrl: '',
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
