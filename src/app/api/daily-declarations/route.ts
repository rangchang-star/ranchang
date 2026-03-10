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

// GET - 获取所有每日宣告
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

    // 查询每日宣告
    const sqlQuery = 'SELECT * FROM public.daily_declarations ORDER BY date DESC';
    const result = await pgClient.query(sqlQuery);

    // 关闭连接
    await pgClient.end();

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('获取每日宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日宣告失败: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - 创建每日宣告
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
    if (!body.title || !body.date) {
      return NextResponse.json({
        success: false,
        error: '请填写标题和日期'
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
      // 插入每日宣告
      const insertQuery = `
        INSERT INTO daily_declarations (
          title, date, image, audio, summary, text,
          icon_type, rank, profile, duration, views, is_featured,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        body.title,
        new Date(body.date),
        body.image || null,
        body.audio || null,
        body.summary || '',
        body.text || '',
        body.icon_type || '',
        body.rank || 0,
        body.profile || '',
        body.duration || '',
        body.views || 0,
        body.is_featured || false,
        new Date(),
        new Date(),
      ];

      const result = await pgClient.query(insertQuery, values);

      return NextResponse.json({
        success: true,
        message: '每日宣告创建成功',
        data: result.rows[0]
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('创建每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建每日宣告失败: ' + error.message
    }, { status: 500 });
  }
}
