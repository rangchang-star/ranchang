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

// GET - 获取活动列表
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

    // 查询活动列表
    const sqlQuery = 'SELECT * FROM public.activities ORDER BY created_at DESC';
    const result = await pgClient.query(sqlQuery);

    // 关闭连接
    await pgClient.end();

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建活动
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
    if (!body.title || !body.description) {
      return NextResponse.json({
        success: false,
        error: '请填写标题和描述'
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
      // 插入活动
      const insertQuery = `
        INSERT INTO activities (
          title, subtitle, category, description, image, address,
          start_date, end_date, capacity, tea_fee, status, created_by,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        body.title,
        body.subtitle || null,
        body.category || 'private',
        body.description,
        body.image || null,
        body.address || null,
        body.start_date ? new Date(body.start_date) : null,
        body.end_date ? new Date(body.end_date) : null,
        body.capacity || 0,
        body.tea_fee || 0,
        body.status || 'draft',
        body.created_by || null,
        new Date(),
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
    console.error('创建活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建活动失败: ' + error.message
    }, { status: 500 });
  }
}
