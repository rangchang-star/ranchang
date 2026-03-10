import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

// 从 DATABASE_URL 解析连接参数
function parseDatabaseUrl(connectionString: string) {
  const urlMatch = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!urlMatch) {
    throw new Error('DATABASE_URL 格式错误');
  }
  const [, user, password, host, port, database] = urlMatch;
  return { user, password, host, port: parseInt(port), database };
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 检查数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json(
        { error: '数据库未配置' },
        { status: 500 }
      );
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
      // 从 users 表查询管理员用户（role='admin'）
      const dbAdmins = await pgClient.query(`
        SELECT * FROM users WHERE phone = $1 AND role = 'admin'
      `, [username]);

      if (dbAdmins.rows.length === 0) {
        return NextResponse.json(
          { error: '用户名或密码错误' },
          { status: 401 }
        );
      }

      const admin = dbAdmins.rows[0];

      // 验证密码
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return NextResponse.json(
          { error: '用户名或密码错误' },
          { status: 401 }
        );
      }

      // 检查用户状态
      if (admin.status !== 'active') {
        return NextResponse.json(
          { error: '账号已被禁用' },
          { status: 403 }
        );
      }

      // 设置 cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_session', admin.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return NextResponse.json({
        success: true,
        admin: {
          id: admin.id,
          username: admin.phone, // 使用 phone 作为用户名
          name: admin.name,
          role: admin.role,
          status: admin.status,
        },
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
