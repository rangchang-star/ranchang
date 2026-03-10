import { NextRequest, NextResponse } from 'next/server';

// GET - 获取高燃宣告列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 从数据库获取宣告列表
    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');

    const declarations = await db.select().from(dailyDeclarations);

    return NextResponse.json({
      success: true,
      data: declarations
    });
  } catch (error: any) {
    console.error('获取高燃宣告列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取高燃宣告列表失败'
    }, { status: 500 });
  }
}
