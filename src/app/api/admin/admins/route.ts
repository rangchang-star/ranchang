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

// GET - 获取所有管理员
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
      const admins = await pgClient.query(`
        SELECT * FROM users ORDER BY created_at DESC
      `);

      return NextResponse.json({
        success: true,
        data: admins.rows,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('获取管理员列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取管理员列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建管理员
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const body = await request.json();

    // 验证必填字段
    if (!body.phone || !body.name) {
      return NextResponse.json({
        success: false,
        error: '请填写手机号和姓名',
      }, { status: 400 });
    }

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
      // 检查手机号是否已存在
      const existing = await pgClient.query(`
        SELECT id FROM users WHERE phone = $1
      `, [body.phone]);

      if (existing.rows.length > 0) {
        return NextResponse.json({
          success: false,
          error: '该手机号已被注册'
        }, { status: 400 });
      }

      // 创建管理员
      const result = await pgClient.query(`
        INSERT INTO users (phone, password, name, role, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        body.phone,
        body.password || '',
        body.name,
        'admin',
        'active',
        new Date(),
        new Date(),
      ]);

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: '管理员创建成功',
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('创建管理员失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建管理员失败: ' + error.message
    }, { status: 500 });
  }
}
