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

// GET - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
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
      // 获取查询参数中的 user_id（可选）
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('user_id');

      // 查询通知列表
      let sqlQuery = 'SELECT * FROM public.notifications';
      const params: any[] = [];

      if (userId) {
        sqlQuery += ' WHERE user_id = $1 ORDER BY created_at DESC';
        params.push(userId);
      } else {
        sqlQuery += ' ORDER BY created_at DESC';
      }

      const result = await pgClient.query(sqlQuery, params);

      // 格式化数据
      const formattedNotifications = result.rows.map((row: any) => ({
        id: row.id.toString(),
        userId: row.user_id?.toString() || '',
        type: row.type || 'info',
        title: row.title || '',
        content: row.message || row.content || '',
        message: row.message || row.content || '',
        actionUrl: row.action_url,
        read: row.is_read || false,
        time: row.created_at ? new Date(row.created_at).toLocaleString('zh-CN') : '',
        createdAt: row.created_at,
      }));

      return NextResponse.json({
        success: true,
        data: formattedNotifications
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取通知列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 检查数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '未配置数据库连接'
      }, { status: 500 });
    }

    // 验证必填字段
    if (!body.userId || !body.title || !body.message) {
      return NextResponse.json({
        success: false,
        error: '缺少必填字段：userId, title, message'
      }, { status: 400 });
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
      // 插入通知
      const insertQuery = `
        INSERT INTO notifications (
          user_id, type, title, message, action_url, is_read, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const values = [
        body.userId,
        body.type || 'info',
        body.title,
        body.message,
        body.actionUrl || null,
        body.read || false,
        new Date(),
      ];

      const result = await pgClient.query(insertQuery, values);

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('创建通知失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建通知失败: ' + error.message
    }, { status: 500 });
  }
}
