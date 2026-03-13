import { NextRequest, NextResponse } from 'next/server';
import { db, adminUsers } from '@/lib/db';
import { desc } from 'drizzle-orm';

// GET - 获取管理员列表
export async function GET(request: NextRequest) {
  try {
    const admins = await db
      .select()
      .from(adminUsers)
      .orderBy(desc(adminUsers.createdAt));

    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error('获取管理员列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取管理员列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建管理员
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 检查必填字段
    if (!body.phone || !body.password) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查手机号是否已存在
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(require('drizzle-orm').eq(adminUsers.username, body.phone));

    if (existingAdmin && existingAdmin.length > 0) {
      return NextResponse.json(
        { success: false, error: '该手机号已被使用' },
        { status: 400 }
      );
    }

    const newAdmin = await db
      .insert(adminUsers)
      .values({
        username: body.phone, // 使用手机号作为用户名
        email: body.phone + '@ranchang.com', // 生成一个临时邮箱
        password: body.password, // 注意：实际项目应该加密密码
        role: 'admin',
        status: 'active',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newAdmin[0],
    });
  } catch (error) {
    console.error('创建管理员失败:', error);
    return NextResponse.json(
      { success: false, error: '创建管理员失败' },
      { status: 500 }
    );
  }
}
