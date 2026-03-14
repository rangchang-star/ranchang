import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const users = await db.select({
      id: appUsers.id,
      name: appUsers.name,
      nickname: appUsers.nickname,
      phone: appUsers.phone,
      email: appUsers.email,
    }).from(appUsers)
      .where(eq(appUsers.status, 'active'));

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('加载用户列表失败:', error);
    return NextResponse.json(
      { success: false, error: '加载用户列表失败' },
      { status: 500 }
    );
  }
}
