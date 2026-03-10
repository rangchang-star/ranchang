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

    // 从数据库读取探访数据
    const { db, visits } = await import('@/storage/database/supabase/connection');

    const dbVisits = await db.select().from(visits);

    // 格式化数据（保持与前端需要的格式一致）
    const formattedVisits = dbVisits.map(visit => ({
      id: visit.id.toString(),
      title: visit.company_name, // 使用 company_name 作为标题
      description: visit.description,
      image: visit.cover_image, // 使用 cover_image 作为图片
      location: visit.location,
      date: visit.date?.toISOString(),
      capacity: visit.capacity,
      teaFee: 0, // 默认茶水费
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
