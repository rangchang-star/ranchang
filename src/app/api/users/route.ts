import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 打印环境变量（脱敏）
    console.log('[DEBUG] DATABASE_URL configured:', !!process.env.DATABASE_URL);
    console.log('[DEBUG] DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 30));

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        console.log('[DEBUG] Attempting to connect to database...');
        // 尝试连接数据库
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq, desc } = await import('drizzle-orm');

        console.log('[DEBUG] Database connection established, querying users...');
        const result = await db.select({
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

        console.log('[DEBUG] Query successful, returned', result.length, 'users');
        // 不返回密码字段
        return NextResponse.json({
          success: true,
          data: result
        });
      } catch (dbError: any) {
        console.error('[DEBUG] Database connection failed:', dbError.message);
        console.error('[DEBUG] Full error:', dbError);
        // 数据库连接失败时，使用模拟数据
      }
    } else {
      console.log('[DEBUG] DATABASE_URL not configured');
    }

    // 使用统一的模拟数据
    const users = MockDatabase.getUsers();

    // 不返回密码字段
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({
      success: true,
      data: usersWithoutPassword
    });
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
    
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const result = await db.insert(users).values({
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
        
        // 不返回密码字段
        const { password, ...userWithoutPassword } = result[0];
        
        return NextResponse.json({
          success: true,
          data: userWithoutPassword
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败:', dbError.message);
        // 继续执行，返回模拟响应
      }
    }
    
    // 使用 MockDatabase 创建用户
    const newUser = MockDatabase.createUser(body);

    // 不返回密码字段
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    });
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
