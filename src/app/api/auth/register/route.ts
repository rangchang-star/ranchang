import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// POST - 用户注册
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name } = body;

    // 验证必填字段
    if (!phone || !name) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填项' },
        { status: 400 }
      );
    }

    // 验证手机号格式（简单验证）
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

    // 创建新用户（暂不需要密码）
    const newUser = await db
      .insert(appUsers)
      .values({
        phone,
        name,
        nickname: name,
        bio: '',
        level: 1,
        hardcoreTags: [],
        tags: [],
        status: 'active',
        isTrusted: false,
        isFeatured: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newUser[0],
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
