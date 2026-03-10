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

// POST - 创建 notifications 表
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const connectionString = process.env.DATABASE_URL || '';
    const dbConfig = parseDatabaseUrl(connectionString);

    const { default: pg } = await import('pg');
    const pgClient = new pg.Client({
      ...dbConfig,
      ssl: false,
    });

    await pgClient.connect();

    try {
      // 创建 notifications 表
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          type VARCHAR(50) DEFAULT 'info',
          title VARCHAR(255) NOT NULL,
          message TEXT,
          action_url VARCHAR(500),
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await pgClient.query(createTableQuery);

      // 创建索引
      await pgClient.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)');
      await pgClient.query('CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)');

      return NextResponse.json({
        success: true,
        message: 'notifications 表创建成功'
      });
    } finally {
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('创建表失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建表失败: ' + error.message
    }, { status: 500 });
  }
}
