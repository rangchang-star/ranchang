import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { db, users } = await import('@/storage/database/supabase/connection');

    // 查询第一个用户
    const result = await db.select().from(users).limit(1);

    return NextResponse.json({
      success: true,
      userCount: result.length,
      firstUser: result.length > 0 ? { id: result[0].id, name: result[0].name } : null,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
