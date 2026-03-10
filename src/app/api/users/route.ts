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

// GET - 获取用户列表
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

    // 查询用户列表
    const sqlQuery = 'SELECT * FROM public.users ORDER BY created_at DESC LIMIT 10';
    const result = await pgClient.query(sqlQuery);

    // 关闭连接
    await pgClient.end();

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建用户（注册）
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
    if (!body.phone || !body.name) {
      return NextResponse.json({
        success: false,
        error: '手机号和姓名不能为空'
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
      // 插入用户
      const insertQuery = `
        INSERT INTO users (
          phone, password, nickname, name, avatar, age,
          company, position, industry, bio, need,
          tag_stamp, tags, hardcore_tags, resource_tags,
          is_trusted, is_featured, connection_count, activity_count,
          role, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING *
      `;

      const values = [
        body.phone,
        body.password || '',
        body.nickname || null,
        body.name,
        body.avatar || null,
        body.age || null,
        body.company || null,
        body.position || null,
        body.industry || null,
        body.bio || null,
        body.need || null,
        body.tag_stamp || 'pureExchange',
        body.tags ? JSON.stringify(body.tags) : null,
        body.hardcore_tags ? JSON.stringify(body.hardcore_tags) : null,
        body.resource_tags ? JSON.stringify(body.resource_tags) : null,
        body.is_trusted || false,
        body.is_featured || false,
        0,
        0,
        'user',
        'active',
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
    console.error('创建用户失败:', error);

    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: '该手机号已被注册'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: '创建用户失败: ' + error.message
    }, { status: 500 });
  }
}
