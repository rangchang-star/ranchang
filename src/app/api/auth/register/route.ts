import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

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
      .select({
        id: appUsers.id,
        phone: appUsers.phone,
      })
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
    const now = new Date();
    const newUser = await db
      .insert(appUsers)
      .values({
        id: randomUUID(),
        phone,
        password: hashedPassword,
        name: name || phone, // 临时用手机号作为name
        nickname: name || phone,
        level: 1, // 改为数字类型
        hardcoreTags: [],
        status: 'active',
        isFeatured: false,
        isTrusted: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        id: appUsers.id,
        phone: appUsers.phone,
        name: appUsers.name,
        avatar: appUsers.avatar,
        industry: appUsers.industry,
        company: appUsers.company,
        position: appUsers.position,
        level: appUsers.level,
        status: appUsers.status,
        createdAt: appUsers.createdAt,
        updatedAt: appUsers.updatedAt,
      });

    // 返回用户信息
    const userWithoutPassword = newUser[0];

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
