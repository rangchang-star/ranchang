import { NextRequest, NextResponse } from 'next/server';
import { db, dailyDeclarations } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET - 获取每日宣告列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    let query = db
      .select()
      .from(dailyDeclarations)
      .orderBy(desc(dailyDeclarations.date));

    if (status === 'featured') {
      query = (query as any).where(eq(dailyDeclarations.is_featured, true));
    }

    const declarationList = await query;

    return NextResponse.json({
      success: true,
      data: declarationList,
    });
  } catch (error) {
    console.error('获取每日宣告列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取每日宣告列表失败',
      },
      { status: 500 }
    );
  }
}

// POST - 创建每日宣告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newDeclaration = await db
      .insert(dailyDeclarations)
      .values({
        title: body.title,
        date: new Date(body.date),
        image: body.image,
        audio: body.audio,
        summary: body.summary,
        text: body.text,
        icon_type: body.iconType,
        rank: body.rank,
        profile: body.profile,
        duration: body.duration,
        is_featured: body.isFeatured || false,
        created_at: new Date(),
        updated_at: new Date(),
      } as any)
      .returning();

    return NextResponse.json({
      success: true,
      data: newDeclaration[0],
    });
  } catch (error) {
    console.error('创建每日宣告失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建每日宣告失败',
      },
      { status: 500 }
    );
  }
}
