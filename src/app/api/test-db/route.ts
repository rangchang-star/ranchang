import { NextResponse } from 'next/server';

export async function GET() {
  const result: any = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) || 'none',
  };

  if (!process.env.DATABASE_URL) {
    result.status = 'error';
    result.message = '未配置 DATABASE_URL 环境变量';
    return NextResponse.json(result);
  }

  try {
    const { db } = await import('@/storage/database/supabase/connection');
    const { users } = await import('@/storage/database/supabase/schema');
    const { desc } = await import('drizzle-orm');

    // 测试查询
    const dbUsers = await db.select().from(users).orderBy(desc(users.created_at)).limit(1);

    result.status = 'success';
    result.message = '数据库连接成功';
    result.userCount = dbUsers.length;
    result.sampleUser = dbUsers[0] ? {
      id: dbUsers[0].id,
      name: dbUsers[0].name,
      phone: dbUsers[0].phone,
    } : null;

    return NextResponse.json(result);
  } catch (error: any) {
    result.status = 'error';
    result.message = '数据库连接失败';
    result.error = error.message;

    return NextResponse.json(result);
  }
}
