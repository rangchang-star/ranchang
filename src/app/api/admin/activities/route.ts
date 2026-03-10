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
      const dbActivities = await pgClient.query(`
        SELECT * FROM activities ORDER BY created_at DESC
      `);

      // 转换数据格式以适配后台管理页面
      const activities = dbActivities.rows.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        subtitle: activity.subtitle || '',
        date: activity.start_date ? new Date(activity.start_date).toISOString().split('T')[0] : '',
        time: activity.start_date && activity.end_date 
          ? `${new Date(activity.start_date).getHours()}:${String(new Date(activity.start_date).getMinutes()).padStart(2, '0')}-${new Date(activity.end_date).getHours()}:${String(new Date(activity.end_date).getMinutes()).padStart(2, '0')}`
          : '09:00-17:00',
        location: activity.address,
        type: activity.category,
        enrolled: 0, // 需要从 activity_registrations 表查询
        max: activity.capacity || 0,
        tags: [activity.category, activity.status === 'active' ? '报名中' : '已结束'],
        status: activity.status,
        pendingApplications: 0,
        category: activity.category,
        description: activity.description,
        image: activity.image,
        address: activity.address,
        capacity: activity.capacity || 0,
        teaFee: activity.tea_fee || 0,
        createdBy: activity.created_by?.toString() || '',
        createdAt: activity.created_at?.toISOString() || '',
        updatedAt: activity.updated_at?.toISOString() || '',
      }));

      return NextResponse.json({
        success: true,
        data: activities,
        total: activities.length,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动列表失败' },
      { status: 500 }
    );
  }
}
