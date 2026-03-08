import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// 获取所有每日宣告
export async function GET(request: NextRequest) {
  try {
    let declarations;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
        const { desc } = await import('drizzle-orm');

        const dbDeclarations = await db.select().from(dailyDeclarations).orderBy(desc(dailyDeclarations.date));
        declarations = dbDeclarations;
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 降级到模拟数据
        declarations = MockDatabase.getDailyDeclarations();
      }
    } else {
      // 使用模拟数据
      declarations = MockDatabase.getDailyDeclarations();
    }

    return NextResponse.json({
      success: true,
      data: declarations,
    });
  } catch (error) {
    console.error('获取每日宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日宣告失败' },
      { status: 500 }
    );
  }
}

// 创建每日宣告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.date || !body.image || !body.audio) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    let newDeclaration;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');

        const result = await db.insert(dailyDeclarations).values({
          title: body.title,
          date: new Date(body.date),
          image: body.image,
          audio: body.audio,
          summary: body.summary || '',
          text: body.text || '',
          iconType: body.iconType || '',
          rank: body.rank || 0,
          profile: body.profile || '',
          duration: body.duration || '',
          views: body.views || 0,
          isFeatured: body.isFeatured || false,
        }).returning();

        newDeclaration = result[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅创建模拟数据:', dbError.message);
        // 降级到模拟数据
        newDeclaration = MockDatabase.createDailyDeclaration(body);
      }
    } else {
      // 使用模拟数据
      newDeclaration = MockDatabase.createDailyDeclaration(body);
    }

    return NextResponse.json({
      success: true,
      message: '每日宣告创建成功',
      data: newDeclaration
    });
  } catch (error) {
    console.error('创建每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建每日宣告失败'
    }, { status: 500 });
  }
}
