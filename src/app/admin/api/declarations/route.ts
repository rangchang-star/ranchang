import { NextRequest, NextResponse } from 'next/server';
import { db, declarations, users } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET - 获取高燃宣告列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    let query = db
      .select({
        id: (declarations as any).id,
        userId: (declarations as any).user_id,
        direction: (declarations as any).direction,
        text: (declarations as any).text,
        summary: (declarations as any).summary,
        audioUrl: (declarations as any).audio_url,
        views: (declarations as any).views,
        date: (declarations as any).date,
        isFeatured: (declarations as any).is_featured,
        createdAt: (declarations as any).created_at,
        updatedAt: (declarations as any).updated_at,
        userName: (users as any).name,
        userAvatar: (users as any).avatar,
        userLevel: (users as any).level,
      })
      .from(declarations)
      .leftJoin(users, eq((declarations as any).user_id, (users as any).id));

    if (status === 'featured') {
      query = query.where(eq((declarations as any).is_featured, true));
    }

    const declarationList = await query.orderBy(desc((declarations as any).created_at));

    return NextResponse.json({
      success: true,
      data: declarationList,
    });
  } catch (error) {
    console.error('获取高燃宣告列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取高燃宣告列表失败',
      },
      { status: 500 }
    );
  }
}

// PUT - 批量更新宣告
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, updates } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少宣告ID列表',
        },
        { status: 400 }
      );
    }

    // 批量更新
    const results = await Promise.all(
      ids.map((id: string) =>
        db
          .update(declarations)
          .set({
            ...updates,
            updated_at: new Date(),
          })
          .where(eq((declarations as any).id, id))
          .returning()
      )
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('更新宣告失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新宣告失败',
      },
      { status: 500 }
    );
  }
}
