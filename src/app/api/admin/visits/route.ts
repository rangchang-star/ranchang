import { NextRequest, NextResponse } from 'next/server';

// 从 DATABASE_URL 解析连接参数
function parseDatabaseUrl(connectionString: string) {
  const urlMatch = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!urlMatch) {
    throw new Error('DATABASE_URL 格式错误');
  }
  const [, user, password, host, port, database] = urlMatch;
  return { user, password, host, port: parseInt(port), database };
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const connectionString = process.env.DATABASE_URL || '';
    const dbConfig = parseDatabaseUrl(connectionString);

    // 创建数据库连接（使用 pg 库）
    const { default: pg } = await import('pg');
    const pgClient = new pg.Client({
      ...dbConfig,
      ssl: false,
    });

    await pgClient.connect();

    try {
      const dbVisits = await pgClient.query(`
        SELECT * FROM visits ORDER BY created_at DESC
      `);

      // 转换数据格式以适配后台管理页面
      const visits = dbVisits.rows.map((visit: any) => ({
        id: visit.id,
        date: visit.date || visit.created_at,
        time: '14:00-16:00',
        status: visit.status === 'active' ? 'completed' : visit.status,
        target: {
          name: visit.title || '待确认',
          title: '待确认',
          company: visit.title || '待确认',
          avatar: '',
        },
        purpose: visit.description ? visit.description.substring(0, 50) + '...' : '暂无描述',
        location: visit.location || '待确认',
        participants: 0,
        rating: 5,
        tags: [visit.status, '探访'],
        title: visit.title,
        duration: visit.duration,
        visitors: [],
        record: visit.description,
        audioDuration: '',
        audioUrl: '',
        image: visit.image,
        outcome: '',
        keyPoints: [],
        nextSteps: [],
        notes: '',
        images: [],
        views: 0,
        likes: 0,
        createdAt: visit.created_at,
      }));

      return NextResponse.json({
        success: true,
        data: visits,
        total: visits.length,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访列表失败' },
      { status: 500 }
    );
  }
}
