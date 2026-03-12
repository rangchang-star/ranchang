import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// POST - 用户登录
export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: '手机号和密码不能为空' },
        { status: 400 }
      );
    }

    // 查找用户
    const users = await db
      .select({
        id: appUsers.id,
        phone: appUsers.phone,
        password: appUsers.password,
        name: appUsers.name,
        avatar: appUsers.avatar,
        industry: appUsers.industry,
        company: appUsers.company,
        position: appUsers.position,
        level: appUsers.level,
        status: appUsers.status,
        createdAt: appUsers.createdAt,
        updatedAt: appUsers.updatedAt,
      })
      .from(appUsers)
      .where(eq(appUsers.phone, phone));

    console.log(`Login attempt for phone: ${phone}, found ${users.length} users`);

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password || '');
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }

    // 返回用户信息（不包含敏感信息）
    const userData = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      avatar: user.avatar,
      industry: user.industry,
      company: user.company,
      position: user.position,
      level: user.level,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // TODO: 生成JWT token
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      success: true,
      data: userData,
      // token,
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
