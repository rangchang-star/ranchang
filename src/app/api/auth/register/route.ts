import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-database';
import { verifyCode } from '../send-code/route';

// 简单的 JWT 生成（生产环境应使用 jsonwebtoken 库）
function generateToken(userId: number): string {
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

// 动态用户存储（内存，重启后清空）
const dynamicUsers: any[] = [];

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
    let existingUser = null;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const dbUsers = await db.select().from(users).where(eq(users.phone, phone));
        if (dbUsers.length > 0) {
          existingUser = dbUsers[0];
        }
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据检查:', dbError.message);
      }
    }

    // 如果数据库中没有找到，从模拟数据中检查
    if (!existingUser) {
      existingUser = mockUsers.find((u) => u.phone === phone) ||
                    dynamicUsers.find((u) => u.phone === phone);
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '该手机号已注册，请直接登录' },
        { status: 409 }
      );
    }

    let newUser;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');

        const result = await db.insert(users).values({
          phone,
          password: password || '',
          nickname,
          name: nickname,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          age: 30,
          company: '',
          position: '',
          industry: '',
          bio: '',
          need: '',
          tagStamp: 'pureExchange',
          tags: [],
          hardcoreTags: [],
          resourceTags: [],
          isTrusted: false,
          role: 'user',
          status: 'active',
        }).returning();

        newUser = result[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅创建模拟数据:', dbError.message);
        // 降级到模拟数据
        newUser = {
          id: mockUsers.length + dynamicUsers.length + 1000,
          phone,
          password: password || '',
          nickname,
          name: nickname,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          age: 30,
          company: '',
          position: '',
          industry: '',
          bio: '',
          need: '',
          tagStamp: 'pureExchange',
          tags: [],
          hardcoreTags: [],
          resourceTags: [],
          isTrusted: false,
          isFeatured: false,
          role: 'user',
          status: 'active',
          connectionCount: 0,
          activityCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dynamicUsers.push(newUser);
      }
    } else {
      // 使用模拟数据
      newUser = {
        id: mockUsers.length + dynamicUsers.length + 1000,
        phone,
        password: password || '',
        nickname,
        name: nickname,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        age: 30,
        company: '',
        position: '',
        industry: '',
        bio: '',
        need: '',
        tagStamp: 'pureExchange',
        tags: [],
        hardcoreTags: [],
        resourceTags: [],
        isTrusted: false,
        isFeatured: false,
        role: 'user',
        status: 'active',
        connectionCount: 0,
        activityCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dynamicUsers.push(newUser);
    }

    console.log('新用户注册:', { phone, nickname, userId: newUser.id });

    // 生成 token
    const token = generateToken(newUser.id);

    // 返回用户信息（排除敏感信息）
    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: '注册成功',
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 导出动态用户存储（供登录接口使用）
export function getDynamicUsers() {
  return dynamicUsers;
}
