import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import bcrypt from 'bcrypt';

// POST - 用户登录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    // 验证必填字段
    if (!phone) {
      return NextResponse.json({
        success: false,
        error: '手机号不能为空'
      }, { status: 400 });
    }

    // 从模拟数据库获取用户
    const users = MockDatabase.getUsers();
    const user = users.find(u => u.phone === phone);

    // 用户不存在
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 401 });
    }

    // 验证密码
    // 如果密码为空，则允许登录（特殊处理）
    if (password && password !== '') {
      // 使用 bcrypt 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({
          success: false,
          error: '密码错误'
        }, { status: 401 });
      }
    }

    // 登录成功，返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        message: '登录成功'
      }
    });
  } catch (error: any) {
    console.error('登录失败:', error);
    return NextResponse.json({
      success: false,
      error: '登录失败，请重试'
    }, { status: 500 });
  }
}
