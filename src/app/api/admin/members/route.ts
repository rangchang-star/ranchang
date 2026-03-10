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
      const dbUsers = await pgClient.query(`
        SELECT * FROM users ORDER BY created_at DESC
      `);

      // 转换数据格式以适配后台管理页面
      const members = dbUsers.rows.map((user: any) => ({
        id: user.id,
        name: user.name,
        age: user.age,
        avatar: user.avatar,
        level: user.is_featured ? '活跃会员' : '种子会员',
        tags: user.hardcore_tags || [],
        industry: user.industry,
        joinDate: new Date(user.created_at).toISOString().split('T')[0],
        status: user.status,
        isFeatured: user.is_featured,
        phone: user.phone,
        company: user.company,
        position: user.position,
        bio: user.need,
        need: user.need,
        resourceTags: user.resource_tags || [],
        role: user.role || 'user',
        connectionCount: 0,
        activityCount: 0,
      }));

      return NextResponse.json({
        success: true,
        data: members,
        total: members.length,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('获取会员列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取会员列表失败' },
      { status: 500 }
    );
  }
}
