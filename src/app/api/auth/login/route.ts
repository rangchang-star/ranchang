import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-database';
import { verifyCode } from '../send-code/route';
import { getDynamicUsers } from '../register/route';

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
    const { phone, code } = body;

    // 验证参数
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: '请输入手机号和验证码' },
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

    // 查找用户（包括静态用户和动态用户）
    const dynamicUsers = getDynamicUsers();
    const user =
      mockUsers.find((u) => u.phone === phone) ||
      dynamicUsers.find((u) => u.phone === phone);

    if (!user) {
      return NextResponse.json(
        { success: false, message: '该手机号未注册，请先注册' },
        { status: 404 }
      );
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
    const { password, ...safeUser } = user;

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
