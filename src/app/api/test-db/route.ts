import { NextResponse } from 'next/server';

// 从 DATABASE_URL 解析连接参数
function parseDatabaseUrl(connectionString: string) {
  const urlMatch = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!urlMatch) {
    throw new Error('DATABASE_URL 格式错误');
  }
  const [, user, password, host, port, database] = urlMatch;
  return { user, password, host, port: parseInt(port), database };
}

export async function GET() {
  const result: any = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) || 'none',
  };

  if (!process.env.DATABASE_URL) {
    result.status = 'error';
    result.message = '未配置 DATABASE_URL 环境变量';
    return NextResponse.json(result);
  }

  try {
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
      // 测试查询
      const usersQuery = 'SELECT id, phone, name FROM public.users ORDER BY created_at DESC LIMIT 1';
      const usersResult = await pgClient.query(usersQuery);

      const activitiesQuery = 'SELECT id, title FROM public.activities ORDER BY created_at DESC LIMIT 1';
      const activitiesResult = await pgClient.query(activitiesQuery);

      result.status = 'success';
      result.message = '数据库连接成功';
      result.users = {
        count: usersResult.rows.length,
        sample: usersResult.rows[0] || null,
      };
      result.activities = {
        count: activitiesResult.rows.length,
        sample: activitiesResult.rows[0] || null,
      };
    } finally {
      // 关闭连接
      await pgClient.end();
    }

    return NextResponse.json(result);
  } catch (error: any) {
    result.status = 'error';
    result.message = '数据库连接失败';
    result.error = error.message;

    return NextResponse.json(result);
  }
}
