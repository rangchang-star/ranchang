import { NextRequest, NextResponse } from 'next/server';

// 字段名转换函数：snake_case -> camelCase
function convertToCamelCase(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }

  // 如果是 Date 对象，直接返回
  if (data instanceof Date) {
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
    const { desc, sql } = await import('drizzle-orm');

    console.log('开始查询 declarations...');

    // 调试：检查当前数据库
    try {
      const dbResult = await db.execute(sql`SELECT current_database()`);
      console.log('当前连接的数据库结果:', JSON.stringify(dbResult, null, 2));
    } catch (e) {
      console.error('查询当前数据库失败:', e);
    }

    // 从数据库获取高燃宣告数据，按创建时间倒序排列
    const result = await db
      .select()
      .from(declarations)
      .orderBy(desc(declarations.createdAt))
      .limit(50); // 限制返回数量，避免数据过多

    console.log('查询结果数量:', result.length);
    console.log('第一条数据:', JSON.stringify(result[0], null, 2));

    // 暂时不转换，直接返回原始数据
    return NextResponse.json({
      success: true,
      data: result
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
    if (!userId || !direction || !text) {
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
    const { sql } = await import('drizzle-orm');

    // 生成新的 ID
    const id = sql`gen_random_uuid()`;

    // 插入数据
    const insertResult = await db.insert(declarations).values({
      id: id,
      userId: String(userId),
      direction: direction,
      text: text,
      summary: summary || null,
      audioUrl: audioUrl || null,
      views: views || 0,
      isFeatured: isFeatured || false,
      date: new Date(),
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
