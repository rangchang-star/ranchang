import { NextRequest, NextResponse } from 'next/server';
import { db, dailyDeclarations } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取每日现货资源列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');

    let query = db
      .select()
      .from(dailyDeclarations)
      .orderBy(desc(dailyDeclarations.rank), desc(dailyDeclarations.date));

    if (featured === 'true') {
      query = (query as any).where(eq(dailyDeclarations.isFeatured, true));
    }

    const declarationList = await query;

    // 转换数据格式
    const data = declarationList.map((declaration: any) => ({
      id: declaration.id,
      title: declaration.title,
      date: declaration.date,
      image: declaration.image,
      imageKey: declaration.imageKey,
      audio: declaration.audio,
      audioKey: declaration.audioKey,
      summary: declaration.summary,
      text: declaration.text,
      iconType: declaration.iconType,
      rank: declaration.rank,
      profile: declaration.profile,
      duration: declaration.duration,
      views: declaration.views,
      isActive: declaration.isActive,
      isFeatured: declaration.isFeatured,
      createdAt: declaration.createdAt,
      updatedAt: declaration.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取每日现货资源列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日现货资源列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建每日现货资源
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, duration, image, audio, isActive = true, isFeatured = false } = body;

    if (!title || !date) {
      return NextResponse.json(
        { success: false, error: '标题和日期为必填项' },
        { status: 400 }
      );
    }

    const [newDeclaration] = await db
      .insert(dailyDeclarations)
      .values({
        title,
        date,
        duration,
        image,
        audio,
        isActive,
        isFeatured,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newDeclaration,
    });
  } catch (error) {
    console.error('创建每日现货资源失败:', error);
    return NextResponse.json(
      { success: false, error: '创建每日现货资源失败' },
      { status: 500 }
    );
  }
}
