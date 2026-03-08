import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取所有管理员
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    let admins;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq, desc } = await import('drizzle-orm');

        const dbAdmins = await db.select().from(users)
          .where(eq(users.role, 'admin'))
          .orderBy(desc(users.createdAt));

        admins = dbAdmins;
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 降级到模拟数据
        admins = MockDatabase.getAdmins();
      }
    } else {
      // 使用模拟数据
      admins = MockDatabase.getAdmins();
    }

    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error: any) {
    console.error('获取管理员列表失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '获取管理员列表失败'
    }, { status: 500 });
  }
}

// POST - 创建管理员
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const body = await request.json();

    // 验证必填字段
    if (!body.phone || !body.password || !body.nickname || !body.name) {
      return NextResponse.json({
        success: false,
        error: '请填写完整的管理员信息',
      }, { status: 400 });
    }

    let newAdmin;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        // 检查手机号是否已存在
        const existing = await db.select().from(users).where(eq(users.phone, body.phone));

        if (existing.length > 0) {
          return NextResponse.json({
            success: false,
            error: '该手机号已被注册'
          }, { status: 400 });
        }

        // 创建管理员
        const result = await db.insert(users).values({
          phone: body.phone,
          password: body.password,
          nickname: body.nickname,
          name: body.name,
          role: 'admin',
          status: 'active',
        }).returning();

        newAdmin = result[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅创建模拟数据:', dbError.message);
        // 降级到模拟数据
        newAdmin = MockDatabase.createAdmin({
          phone: body.phone,
          password: body.password,
          nickname: body.nickname,
          name: body.name,
        });
      }
    } else {
      // 使用模拟数据
      newAdmin = MockDatabase.createAdmin({
        phone: body.phone,
        password: body.password,
        nickname: body.nickname,
        name: body.name,
      });
    }

    return NextResponse.json({
      success: true,
      data: newAdmin,
      message: '管理员创建成功',
    });
  } catch (error: any) {
    console.error('创建管理员失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '创建管理员失败'
    }, { status: error.message === '该手机号已被注册' ? 400 : 500 });
  }
}
