import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { randomUUID } from 'crypto';

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 前台使用真实的 ran_field 数据库
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field');
    
    if (!connectionString || connectionString === '') {
      return NextResponse.json({
        success: false,
        error: '未配置数据库连接'
      }, { status: 500 });
    }

    // 创建临时的数据库连接
    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { db, users } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');
    
    // 使用 ran_field 数据库
    const client = postgres(connectionString, {
      max: 10,
      ssl: false,
      connection: {
        application_name: 'ran-field-app-frontend',
      },
    });
    
    const frontendDb = drizzle(client);

    try {
      const result = await frontendDb.select({
        id: users.id,
        phone: users.phone,
        nickname: users.nickname,
        name: users.name,
        avatar: users.avatar,
        age: users.age,
        company: users.company,
        position: users.position,
        industry: users.industry,
        bio: users.bio,
        need: users.need,
        tagStamp: users.tagStamp,
        tags: users.tags,
        hardcoreTags: users.hardcoreTags,
        resourceTags: users.resourceTags,
        isTrusted: users.isTrusted,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      }).from(users).orderBy(desc(users.createdAt));

      await client.end();
      
      return NextResponse.json({
        success: true,
        data: result
      });
    } catch (dbError: any) {
      await client.end();
      console.error('前台数据库查询失败，使用模拟数据:', dbError.message);
      
      // 降级到模拟数据
      const users = MockDatabase.getUsers() as any[];
      const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return NextResponse.json({
        success: true,
        data: usersWithoutPassword
      });
    }
  } catch (error: any) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户列表失败'
    }, { status: 500 });
  }
}

// POST - 创建用户（注册）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 前台使用真实的 ran_field 数据库
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field');
    
    if (!connectionString || connectionString === '') {
      return NextResponse.json({
        success: false,
        error: '未配置数据库连接'
      }, { status: 500 });
    }

    // 创建临时的数据库连接
    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { db, users } = await import('@/storage/database/supabase/connection');
    
    // 使用 ran_field 数据库
    const client = postgres(connectionString, {
      max: 10,
      ssl: false,
      connection: {
        application_name: 'ran-field-app-frontend',
      },
    });
    
    const frontendDb = drizzle(client);

    try {
      const result = await frontendDb.insert(users).values({
        id: randomUUID(),
        phone: body.phone,
        password: body.password,
        nickname: body.nickname,
        name: body.name,
        avatar: body.avatar,
        age: body.age,
        company: body.company,
        position: body.position,
        industry: body.industry,
        bio: body.bio,
        need: body.need,
        tagStamp: body.tagStamp,
        tags: body.tags,
        hardcoreTags: body.hardcoreTags,
        resourceTags: body.resourceTags,
        isTrusted: body.isTrusted || false,
        role: 'user',
        status: 'active',
      }).returning();
      
      await client.end();
      
      const { password, ...userWithoutPassword } = result[0];
      
      return NextResponse.json({
        success: true,
        data: userWithoutPassword
      });
    } catch (dbError: any) {
      await client.end();
      console.error('前台数据库插入失败，返回模拟响应:', dbError.message);
      
      // 使用 MockDatabase 创建用户
      const newUser = MockDatabase.createUser(body);

      const { password, ...userWithoutPassword } = newUser;

      return NextResponse.json({
        success: true,
        data: userWithoutPassword
      });
    }
  } catch (error: any) {
    console.error('创建用户失败:', error);
    
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: '该手机号已被注册'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: '创建用户失败'
    }, { status: 500 });
  }
}
