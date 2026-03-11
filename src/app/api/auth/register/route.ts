import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/auth-code-utils';

// 简单的 JWT 生成（生产环境应使用 jsonwebtoken 库）
function generateToken(userId: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId: String(userId),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7天有效期
    })
  );
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password, nickname } = body;

    // 验证参数
    if (!phone) {
      return NextResponse.json(
        { success: false, message: '请输入手机号' },
        { status: 400 }
      );
    }

    if (!nickname) {
      return NextResponse.json(
        { success: false, message: '请输入昵称' },
        { status: 400 }
      );
    }

    // 验证昵称长度
    if (nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { success: false, message: '昵称长度为2-20位' },
        { status: 400 }
      );
    }

    // 检查手机号是否已注册
    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const dbUsers = await db.select().from(users).where(eq(users.phone, phone));

    if (dbUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: '该手机号已注册，请直接登录' },
        { status: 409 }
      );
    }

    // 创建新用户（ID 由数据库自增生成）
    // 使用类型断言以支持 password 等字段
    const insertData: any = {
      phone,
      password: password || '',
      name: nickname || '',
      nickname: nickname || '',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      age: 30,
      company: null,
      position: null,
      industry: null,
      bio: null,
      need: null,
      tag_stamp: 'pureExchange',
      tags: null,
      hardcore_tags: null,
      resource_tags: null,
      is_trusted: false,
      is_featured: false,
      connection_count: 0,
      activity_count: 0,
      role: 'user',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await db.insert(users).values(insertData as any).returning();
    const newUser = result[0] as any; // 类型断言

    console.log('新用户注册:', { phone, nickname, userId: newUser.id });

    // 生成 token（user.id 可能是 string 或 number）
    const userId = typeof newUser.id === 'number' ? newUser.id : parseInt(newUser.id);
    const token = generateToken(userId);

    // 返回用户信息
    const { password: pwd, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: '注册成功',
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error: any) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
