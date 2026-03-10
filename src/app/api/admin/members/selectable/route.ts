import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';

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
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

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
      // 获取所有用户
      const dbUsers = await pgClient.query(`
        SELECT * FROM users ORDER BY created_at DESC
      `);

      // 转换为适合前台使用的格式
      const members = dbUsers.rows.map((user: any) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: user.need,
        position: user.position,
        company: user.company,
        hardcoreTags: user.hardcore_tags || [],
        industry: user.industry,
      }));

      return NextResponse.json({
        success: true,
        data: members,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('获取会员列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取会员列表失败'
    }, { status: 500 });
  }
}
