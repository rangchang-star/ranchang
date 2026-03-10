import { NextRequest, NextResponse } from 'next/server';

// 字段名转换函数：snake_case -> camelCase
function convertToCamelCase(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }

  // 如果是 Date 对象，检查是否有效
  if (data instanceof Date) {
    // 检查日期是否有效
    if (isNaN(data.getTime())) {
      return null; // 无效日期返回 null
    }
    return data.toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(item => convertToCamelCase(item));
  }

  if (typeof data === 'object') {
    const camelCaseResult: any = {};
    // 手动遍历，避免使用 Object.entries
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelCaseResult[camelCaseKey] = convertToCamelCase(data[key]);
      }
    }
    return camelCaseResult;
  }

  // 对于字符串，不进行日期转换，直接返回
  return data;
}

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

    const { db, declarations } = await import('@/storage/database/supabase/connection');
    const { desc, eq } = await import('drizzle-orm');

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let result;

    // 如果提供了 userId，则按用户ID过滤
    if (userId) {
      result = await db.select().from(declarations).where(eq(declarations.user_id, userId)).orderBy(desc(declarations.created_at));
    } else {
      result = await db.select().from(declarations).orderBy(desc(declarations.created_at));
    }

    // 转换字段名并返回
    return NextResponse.json({
      success: true,
      data: convertToCamelCase(result)
    });
  } catch (error: any) {
    console.error('获取高燃宣告列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取高燃宣告列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建高燃宣告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, direction, text, summary, audioUrl, views, isFeatured } = body;

    // 验证必填字段
    if (!userId || !text) {
      return NextResponse.json({
        success: false,
        error: '缺少必填字段'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, declarations } = await import('@/storage/database/supabase/connection');

    // 插入数据
    const insertResult = await db.insert(declarations).values({
      id: crypto.randomUUID(),
      user_id: String(userId),
      direction: direction || null,
      text: text,
      summary: summary || null,
      audio_url: audioUrl || null,
      views: views || 0,
      is_featured: isFeatured || false,
      date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      data: convertToCamelCase(insertResult[0])
    });
  } catch (error: any) {
    console.error('创建高燃宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建高燃宣告失败: ' + error.message
    }, { status: 500 });
  }
}
