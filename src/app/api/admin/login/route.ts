import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 从数据库查询管理员
    const { db, adminUsers } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const dbAdmins = await db.select().from(adminUsers).where(eq(adminUsers.username, username));

    if (dbAdmins.length === 0) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const admin = dbAdmins[0];

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
    cookieStore.set('admin_session', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
