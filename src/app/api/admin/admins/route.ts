import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { randomUUID } from 'crypto';

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

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const admins = await db.select().from(users)
      .orderBy(desc(users.created_at));

    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error: any) {
    console.error('获取管理员列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取管理员列表失败: ' + error.message
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
    if (!body.phone || !body.name) {
      return NextResponse.json({
        success: false,
        error: '请填写手机号和姓名',
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

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
      id: randomUUID(),
      phone: body.phone,
      name: body.name,
      status: 'active',
      level: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      data: result[0],
      message: '管理员创建成功',
    });
  } catch (error: any) {
    console.error('创建管理员失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建管理员失败: ' + error.message
    }, { status: 500 });
  }
}
