import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { users } from '@/storage/database/supabase/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json({
        success: false,
        error: '手机号和密码不能为空'
      }, { status: 400 });
    }

    // 查找用户
    const result = await db.select().from(users).where(eq(users.phone, phone));

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '手机号或密码错误'
      }, { status: 401 });
    }

    const user = result[0];

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        error: '手机号或密码错误'
      }, { status: 401 });
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: '账号已被禁用'
      }, { status: 403 });
    }

    // 不返回密码字段
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: 'mock-token-' + Date.now() // 实际项目中应该使用JWT
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({
      success: false,
      error: '登录失败'
    }, { status: 500 });
  }
}
