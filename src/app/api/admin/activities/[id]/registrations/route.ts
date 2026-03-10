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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查数据库连接
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
      // 获取活动信息
      const dbActivities = await pgClient.query(`
        SELECT * FROM activities WHERE id = $1
      `, [parseInt(id, 10)]);

      if (dbActivities.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: '活动不存在' },
          { status: 404 }
        );
      }

      const activity = dbActivities.rows[0];

      // 获取活动的参与记录
      const dbRegistrations = await pgClient.query(`
        SELECT * FROM activity_registrations WHERE activity_id = $1
      `, [parseInt(id, 10)]);

      // 获取报名用户的详细信息
      const registrations = await Promise.all(
        dbRegistrations.rows.map(async (registration: any) => {
          const dbUsers = await pgClient.query(`
            SELECT * FROM users WHERE id = $1
          `, [registration.user_id]);
          const user = dbUsers.rows[0];

          return {
            id: registration.user_id,
            activityId: id,
            userId: registration.user_id,
            userName: user?.name || '未知',
            userPhone: user?.phone || '未知',
            userCompany: user?.company || '未知',
            userPosition: user?.position || '未知',
            userAvatar: user?.avatar || '',
            status: registration.status,
            registeredAt: registration.registered_at,
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: {
          activity: {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            date: activity.start_date,
            startTime: activity.start_date,
            endTime: activity.end_date,
            location: activity.address,
            capacity: activity.capacity,
            type: activity.category,
            coverImage: activity.image,
          },
          registrations: registrations,
          statistics: {
            total: registrations.length,
            registered: registrations.filter((r: any) => r.status === 'registered').length,
            cancelled: registrations.filter((r: any) => r.status === 'cancelled').length,
          },
        },
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('获取活动报名信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取活动报名信息失败' },
      { status: 500 }
    );
  }
}
