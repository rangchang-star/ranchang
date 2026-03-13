import { NextRequest, NextResponse } from 'next/server';
import { db, declarations } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';

// GET - 获取宣告列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const userId = searchParams.get('userId');

    let query = db
      .select()
      .from(declarations)
      .orderBy(desc(declarations.createdAt));

    const conditions = [];
    if (featured === 'true') {
      conditions.push(eq(declarations.isFeatured, true));
    }
    if (userId) {
      conditions.push(eq(declarations.userId, userId));
    }

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const declarationList = await query;

    // 转换数据格式
    const data = declarationList.map((declaration: any) => ({
      id: declaration.id,
      userId: declaration.userId,
      type: declaration.type,
      subtype: declaration.subtype,
      direction: declaration.direction,
      text: declaration.text,
      summary: declaration.summary,
      audioUrl: declaration.audioUrl,
      views: declaration.views,
      isFeatured: declaration.isFeatured,
      date: declaration.date,
      createdAt: declaration.createdAt,
      updatedAt: declaration.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取宣告列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取宣告列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建宣告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newDeclaration = await db
      .insert(declarations)
      .values({
        id: crypto.randomUUID(),
        userId: body.userId,
        type: 'resource', // 统一为资源现货
        subtype: body.subtype || 'resource', // 子类型：ability(能力现货), connection(人脉现货), resource(资源现货)
        direction: body.direction,
        text: body.text,
        summary: body.summary,
        audioUrl: body.audioUrl,
        date: body.date || new Date().toISOString().split('T')[0],
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newDeclaration[0],
    });
  } catch (error) {
    console.error('创建宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '创建宣告失败' },
      { status: 500 }
    );
  }
}
