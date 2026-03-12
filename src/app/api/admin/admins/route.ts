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

    const newAdmin = await db
      .insert(adminUsers)
      .values({
        username: body.username,
        email: body.email,
        password: body.password,
        name: body.nickname,
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
