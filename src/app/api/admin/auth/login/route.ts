import { NextRequest, NextResponse } from 'next/server';
import { db, adminUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// POST - 管理员登录
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 查找管理员
    const admins = await db
      .select({
        id: adminUsers.id,
        username: adminUsers.username,
        email: adminUsers.email,
        password: adminUsers.password,
        role: adminUsers.role,
        status: adminUsers.status,
        createdAt: adminUsers.createdAt,
        updatedAt: adminUsers.updatedAt,
      })
      .from(adminUsers)
      .where(eq(adminUsers.username, username));

    console.log(`Admin login attempt for username: ${username}, found ${admins.length} admins`);

    if (admins.length === 0) {
      return NextResponse.json(
        { success: false, error: '管理员不存在' },
        { status: 401 }
      );
    }

    const admin = admins[0];

    // 检查状态
    if (admin.status !== 'active') {
      return NextResponse.json(
        { success: false, error: '管理员账户已被禁用' },
        { status: 403 }
      );
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, admin.password || '');
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }

    // 返回管理员信息（不包含敏感信息）
    const adminData = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };

    // TODO: 生成JWT token
    // const token = jwt.sign({ adminId: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      success: true,
      data: adminData,
      // token,
    });
  } catch (error) {
    console.error('管理员登录失败:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
