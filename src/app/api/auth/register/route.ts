import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// POST - 用户注册
export async function POST(request: NextRequest) {
  try {
    const { phone, password, name } = await request.json();

    // 验证必填字段
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: '请填写手机号和密码' },
        { status: 400 }
      );
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: '手机号格式不正确' },
        { status: 400 }
      );
    }

    // 检查手机号是否已注册
    const existingUser = await db
      .select()
      .from(appUsers)
      .where(eq(appUsers.phone, phone))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: '该手机号已注册' },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser = await db
      .insert(appUsers)
      .values({
        phone,
        password: hashedPassword,
        name: name || '',
        nickname: name || '',
        bio: '',
        level: 1,
        hardcoreTags: [],
        tags: [],
        status: 'active',
        isTrusted: false,
        isFeatured: false,
      })
      .returning();

    // 返回用户信息（不返回密码）
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: '注册成功',
    });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { success: false, error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
