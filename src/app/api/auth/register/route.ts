import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/verification-code';

// 简单的 JWT 生成（生产环境应使用 jsonwebtoken 库）
function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId,
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

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json(
        { success: false, message: '未配置数据库连接' },
        { status: 500 }
      );
    }

    // 检查手机号是否已注册
    try {
      const { db, users } = await import('@/storage/database/supabase/connection');
      const { eq } = await import('drizzle-orm');

      const dbUsers = await db.select().from(users).where(eq(users.phone, phone));

      if (dbUsers.length > 0) {
        return NextResponse.json(
          { success: false, message: '该手机号已注册，请直接登录' },
          { status: 409 }
        );
      }

      // 创建新用户
      const result = await db.insert(users).values({
        phone,
        name: nickname || '',
        nickname: nickname || '',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        age: 30,
        industry: null,
        need: null,
        hardcore_tags: [],
        resource_tags: [],
        role: 'user',
        company: null,
        position: null,
        status: 'active',
        is_featured: false,
        password: password || '',
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();

      const newUser = result[0];

      console.log('新用户注册:', { phone, nickname, userId: newUser.id });

      // 生成 token
      const token = generateToken(String(newUser.id));

      return NextResponse.json({
        success: true,
        message: '注册成功',
        data: {
          user: newUser,
          token,
        },
      });
    } catch (dbError: any) {
      console.error('注册失败:', dbError);
      return NextResponse.json(
        { success: false, message: '注册失败，请稍后重试' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
