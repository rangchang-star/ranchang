import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '../send-code/route';

// 简单的 JWT 生成（生产环境应使用 jsonwebtoken 库）
function generateToken(userId: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7天有效期
    })
  );
  const signature = btoa(`${header}.${payload}.secret`); // 简单的签名，生产环境应使用真实签名
  return `${header}.${payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code, password, loginType = 'code' } = body;

    // 验证参数
    if (!phone) {
      return NextResponse.json(
        { success: false, message: '请输入手机号' },
        { status: 400 }
      );
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: '请输入正确的手机号' },
        { status: 400 }
      );
    }

    // 根据登录类型验证
    if (loginType === 'password') {
      // 密码登录（允许空密码登录用于测试）
      // 密码验证在查询用户后进行
    } else {
      // 验证码登录
      if (!code) {
        return NextResponse.json(
          { success: false, message: '请输入验证码' },
          { status: 400 }
        );
      }

      // 验证验证码
      if (!verifyCode(phone, code)) {
        return NextResponse.json(
          { success: false, message: '验证码错误或已过期' },
          { status: 400 }
        );
      }
    }

    // 从数据库查找用户
    const connectionString = process.env.DATABASE_URL || '';

    if (!connectionString || connectionString === '') {
      return NextResponse.json({
        success: false,
        message: '数据库未配置'
      }, { status: 500 });
    }

    // 使用 pg 库（和 users API 保持一致）
    const { default: pg } = await import('pg');

    // 从 DATABASE_URL 解析连接参数
    // 格式: postgresql://user:password@host:port/database
    const urlMatch = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!urlMatch) {
      console.error('DATABASE_URL 格式错误:', connectionString);
      return NextResponse.json({
        success: false,
        message: '数据库配置错误'
      }, { status: 500 });
    }

    const [, dbUser, dbPassword, dbHost, dbPort, dbName] = urlMatch;

    const pgClient = new pg.Client({
      host: dbHost,
      port: parseInt(dbPort),
      database: dbName,
      user: dbUser,
      password: dbPassword,
      ssl: false, // 和 users API 保持一致
    });

    await pgClient.connect();

    // 查询用户
    const result = await pgClient.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    // 立即关闭连接
    await pgClient.end();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: '该手机号未注册，请先注册' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    console.log('[DEBUG] 登录用户:', user.id, user.phone);

    // 密码登录时验证密码
    if (loginType === 'password') {
      // 兼容两种密码字段名称
      const userPassword = user.password;
      // 允许空密码登录（用于测试）
      if (userPassword && userPassword !== password) {
        return NextResponse.json(
          { success: false, message: '密码错误' },
          { status: 401 }
        );
      }
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: '账号已被禁用，请联系客服' },
        { status: 403 }
      );
    }

    // 生成 token
    const token = generateToken(user.id);

    // 返回用户信息（排除敏感信息）
    const { password: pwd, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
